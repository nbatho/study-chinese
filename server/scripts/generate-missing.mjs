import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(serverRoot, '..');
const curriculumPath = path.join(repoRoot, 'client/src/pages/Learn/curriculum.ts');
const manifestPath = path.join(repoRoot, 'data/lessons/generated/manifest.json');
const realLessonsPath = path.join(repoRoot, 'data/lessons/real');

const parseCurriculum = () => {
  const content = fs.readFileSync(curriculumPath, 'utf8');
  const levelBlocks = content.split('hskLevel:').slice(1);
  const lessons = [];

  for (const block of levelBlocks) {
    const levelMatch = block.match(/^\s*(\d+)/);
    if (!levelMatch) continue;
    const hskLevel = parseInt(levelMatch[1], 10);

    const topicRegex = /id:\s*"([^"]+)"[\s\S]*?lessons:\s*\[([\s\S]*?)\]/g;
    let topicMatch;
    while ((topicMatch = topicRegex.exec(block)) !== null) {
      const topicIdFull = topicMatch[1];
      const topicTopic = topicIdFull.replace(/^hsk\d+-/, '');
      const lessonsBlock = topicMatch[2];

      const lessonRegex = /lesson\(\s*(\d+)\s*,\s*"([^"]+)"/g;
      let lessonMatch;
      while ((lessonMatch = lessonRegex.exec(lessonsBlock)) !== null) {
        lessons.push({
          level: hskLevel,
          topic: topicTopic,
          order: parseInt(lessonMatch[1], 10),
          skill: lessonMatch[2] === 'test' ? 'mixed' : (lessonMatch[2] === 'vocabulary' || lessonMatch[2] === 'grammar' ? 'reading' : lessonMatch[2])
        });
      }
    }
    
    // Also parse endTest
    const endTestRegex = /endTest:\s*lesson\(\s*(\d+)\s*,\s*"([^"]+)"/;
    const endTestMatch = endTestRegex.exec(block);
    if (endTestMatch) {
      lessons.push({
        level: hskLevel,
        topic: 'end-test',
        order: parseInt(endTestMatch[1], 10),
        skill: 'mixed'
      });
    }
  }
  return lessons;
};

const getGeneratedLessonOrders = () => {
  const generatedOrders = new Set();

  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    for (const lesson of manifest.lessons) {
      // The lesson_id format is hskX-lYY-skill-topic
      const match = lesson.lesson_id.match(/-l(\d+)-/);
      if (match) {
        generatedOrders.add(`${lesson.hsk_level}-${parseInt(match[1], 10)}`);
      }
    }
  }

  if (fs.existsSync(realLessonsPath)) {
    const files = fs.readdirSync(realLessonsPath)
      .filter((file) => file.endsWith('.release.json'));

    for (const file of files) {
      const release = JSON.parse(fs.readFileSync(path.join(realLessonsPath, file), 'utf8'));
      if (!['auto_validated', 'ai_reviewed'].includes(release.status)) {
        continue;
      }

      const levelMatch = release.lesson_id.match(/^hsk(\d+)-/);
      const lessonMatch = release.lesson_id.match(/-l(\d+)-/);
      if (levelMatch && lessonMatch) {
        generatedOrders.add(`${parseInt(levelMatch[1], 10)}-${parseInt(lessonMatch[1], 10)}`);
      }
    }
  }

  return generatedOrders;
};

const run = async () => {
  const curriculumLessons = parseCurriculum();
  const generatedOrders = getGeneratedLessonOrders();
  
  let missingLessons = curriculumLessons.filter(
    l => !generatedOrders.has(`${l.level}-${l.order}`)
  );
  
  // Limiting to 36 lessons (~45 minutes of generation at 75s per lesson)
  missingLessons = missingLessons.slice(0, 36);
  
  console.log(`Found ${curriculumLessons.length} total lessons.`);
  console.log(`Found ${generatedOrders.size} generated lessons.`);
  console.log(`Need to generate ${missingLessons.length} missing lessons (limited due to rate limits).`);
  
  const maxConcurrent = 1;
  let index = 0;
  
  const runGeneration = (lesson) => {
    return new Promise((resolve, reject) => {
      console.log(`[START] Generating HSK ${lesson.level} Lesson ${lesson.order} (Topic: ${lesson.topic}, Skill: ${lesson.skill})...`);
      
      const child = spawn('npm', [
        'run', 'lessons:generate', '--',
        `--level=${lesson.level}`,
        `--lesson-no=${lesson.order}`,
        `--topic=${lesson.topic}`,
        `--skill=${lesson.skill}`,
        '--skip-ai-review',
        '--no-db-log'
      ], {
        cwd: serverRoot,
        stdio: 'inherit'
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          console.log(`[SUCCESS] Generated HSK ${lesson.level} Lesson ${lesson.order}.`);
          resolve();
        } else {
          console.error(`[ERROR] Failed to generate HSK ${lesson.level} Lesson ${lesson.order}.`);
          // We can resolve to continue or reject to fail fast. Let's resolve to continue trying others.
          resolve();
        }
      });
    });
  };

  const processNext = async () => {
    if (index >= missingLessons.length) return;
    const current = missingLessons[index++];
    await runGeneration(current);
    
    // If there are more lessons, wait 65 seconds to avoid the 6000 TPM limit
    if (index < missingLessons.length) {
      console.log('Waiting 65 seconds to avoid API rate limits...');
      await new Promise(resolve => setTimeout(resolve, 65000));
    }
    
    await processNext();
  };
  
  const workers = [];
  for (let i = 0; i < maxConcurrent; i++) {
    workers.push(processNext());
  }
  
  await Promise.all(workers);
  console.log('All generation tasks completed.');
  
  // Run content:agent to build manifest
  console.log('Running content:agent to build manifest and reports...');
  const runCmd = (cmd, args) => new Promise((resolve) => {
    const proc = spawn(cmd, args, { cwd: serverRoot, stdio: 'inherit' });
    proc.on('close', (code) => {
      console.log(`${cmd} ${args.join(' ')} exited with code ${code}`);
      resolve();
    });
  });

  await runCmd('npm', ['run', 'content:agent', '--', '--source', 'data/lessons/real', '--output', 'data/lessons/normalized']);
  
  console.log('Resetting lesson content...');
  await runCmd('npm', ['run', 'lessons:reset-content', '--', '--apply']);
  
  console.log('Resetting user progress...');
  await runCmd('npm', ['run', 'lessons:reset-user-progress', '--', '--apply']);
  
  console.log('Importing generated lessons...');
  await runCmd('npm', ['run', 'lessons:import']);
  
  console.log('All tasks finished!');
};

run().catch(console.error);
