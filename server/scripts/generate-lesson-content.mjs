import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { ContentValidator } from '../src/services/content-validator.js';
import { contentPath, resolveContentPath } from '../src/config/content-paths.js';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: path.join(serverRoot, '.env') });

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const level = Number(args.find((arg) => arg.startsWith('--level='))?.split('=')[1] || 1);
const topic = args.find((arg) => arg.startsWith('--topic='))?.split('=').slice(1).join('=') || 'daily_life';
const skill = args.find((arg) => arg.startsWith('--skill='))?.split('=')[1] || 'reading';
const maxRetries = Number(args.find((arg) => arg.startsWith('--retries='))?.split('=')[1] || 3);
const SAVE = args.includes('--save');
const outputDir = resolveContentPath(
  args.find((arg) => arg.startsWith('--output-dir='))?.split('=').slice(1).join('='),
  ['lessons', 'generated']
);

const promptBySkill = {
  listening: 'generate-dialogue.txt',
  speaking: 'generate-dialogue.txt',
  reading: 'generate-passage.txt',
  writing: 'generate-exercises.txt',
  mixed: 'generate-exercises.txt'
};

const requireValidArgs = () => {
  if (!Number.isInteger(level) || level < 1 || level > 9) {
    throw new Error('--level must be an integer from 1 to 9.');
  }

  if (!['listening', 'speaking', 'reading', 'writing', 'mixed'].includes(skill)) {
    throw new Error('--skill must be listening, speaking, reading, writing, or mixed.');
  }
};

const loadPrompt = async () => {
  const promptName = promptBySkill[skill] || promptBySkill.mixed;
  const prompt = await readFile(contentPath('prompts', promptName), 'utf8');

  return prompt
    .replaceAll('{level}', String(level))
    .replaceAll('{topic}', topic)
    .replaceAll('{skill}', skill);
};

const createDryRunLesson = () => ({
  lesson_id: `hsk${level}-sample-${skill}-${topic}`.replace(/[^a-z0-9-]+/gi, '-').toLowerCase(),
  metadata: {
    title_zh: '今天吃什么',
    title_en: 'What shall we eat today?',
    hsk_level: level,
    cefr_level: level <= 2 ? 'A1' : level <= 3 ? 'A2' : level <= 4 ? 'B1' : level <= 6 ? 'B2' : 'C1',
    primary_skill: skill,
    secondary_skills: skill === 'listening' ? ['speaking'] : [],
    topic,
    estimated_minutes: 10,
    xp_reward: 30,
    tags: [topic, skill]
  },
  learning_objectives: [
    'Understand a short everyday exchange.',
    'Use target words in a simple answer.'
  ],
  vocabulary_focus: [
    { simplified: '今天', pinyin: 'jīn tiān', english: 'today', is_new: true },
    { simplified: '吃', pinyin: 'chī', english: 'to eat', is_new: true }
  ],
  grammar_focus: [
    {
      pattern: '... 吃什么?',
      explanation: 'Ask what someone wants to eat.',
      examples: [{ zh: '你今天吃什么?', pinyin: 'Nǐ jīn tiān chī shén me?', en: 'What are you eating today?' }]
    }
  ],
  warm_up: {
    type: 'vocabulary_review',
    items: ['今天', '吃']
  },
  core_modules: [
    {
      module_type: skill === 'mixed' ? 'reading' : skill,
      phases: [
        {
          type: 'comprehension',
          content_zh: '今天你吃什么? 我吃米饭。',
          content_pinyin: 'Jīn tiān nǐ chī shén me? Wǒ chī mǐ fàn.',
          content_en: 'What are you eating today? I am eating rice.'
        }
      ]
    }
  ],
  practice: {
    exercises: [
      {
        kind: 'multiple_choice',
        skill,
        bloom_level: 'understand',
        prompt: 'What does 吃 mean?',
        options: ['to eat', 'to drink', 'today'],
        correct_answer: 'to eat',
        acceptable_variants: ['eat'],
        explanation: '吃 means to eat.'
      }
    ]
  },
  review: {
    key_takeaways: ['Use 吃 to talk about eating.'],
    srs_inject_word_ids: []
  }
});

const extractJsonText = (text) => {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const first = candidate.indexOf('{');
  const last = candidate.lastIndexOf('}');

  if (first === -1 || last === -1 || last <= first) {
    return candidate;
  }

  return candidate.slice(first, last + 1);
};

const callOpenAiCompatible = async (prompt) => {
  const provider = String(process.env.AI_PROVIDER || 'mock').toLowerCase();
  const apiKey =
    provider === 'groq'
      ? process.env.GROQ_API_KEY || process.env.AI_API_KEY
      : process.env.OPENAI_API_KEY || process.env.AI_API_KEY;
  const url =
    process.env.AI_BASE_URL ||
    (provider === 'groq'
      ? 'https://api.groq.com/openai/v1/chat/completions'
      : 'https://api.openai.com/v1/chat/completions');
  const model =
    process.env.AI_MODEL ||
    (provider === 'groq' ? 'openai/gpt-oss-20b' : 'gpt-4o-mini');

  if (!apiKey) {
    throw new Error('Missing AI_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY. Use --dry-run for a local sample.');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content: 'Return valid JSON only. Create original Mandarin learning content.'
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      response_format: { type: 'json_object' }
    })
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`LLM request failed with ${response.status}: ${body.slice(0, 300)}`);
  }

  const payload = JSON.parse(body);
  return {
    model,
    rawText: payload.choices?.[0]?.message?.content || '{}'
  };
};

const saveGenerationLog = async ({ lesson, prompt, validation, modelName }) => {
  const db = await import('../src/config/db.config.js');

  try {
    await db.query(
      `
        INSERT INTO content_generation_logs (
          content_type,
          target_lesson_id,
          hsk_level,
          topic,
          skill,
          prompt_used,
          model_name,
          raw_output,
          validation_result,
          status
        )
        VALUES ('lesson', NULL, $1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8)
      `,
      [
        level,
        topic,
        skill,
        prompt,
        modelName,
        JSON.stringify(lesson),
        JSON.stringify(validation),
        validation.ok ? 'auto_validated' : 'pending'
      ]
    );
  } finally {
    await db.closeDB();
  }
};

const saveLessonFile = async ({ lesson, validation }) => {
  await mkdir(outputDir, { recursive: true });
  const lessonPath = path.join(outputDir, `${lesson.lesson_id}.json`);
  const reportPath = path.join(outputDir, `${lesson.lesson_id}.validation.json`);

  await writeFile(lessonPath, `${JSON.stringify(lesson, null, 2)}\n`, 'utf8');
  await writeFile(reportPath, `${JSON.stringify(validation, null, 2)}\n`, 'utf8');

  return { lessonPath, reportPath };
};

const run = async () => {
  requireValidArgs();
  const prompt = await loadPrompt();
  let lesson = DRY_RUN ? createDryRunLesson() : null;
  let modelName = DRY_RUN ? 'local-dry-run' : null;

  if (!DRY_RUN) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt += 1) {
      try {
        const result = await callOpenAiCompatible(`${prompt}\n\nAttempt: ${attempt}`);
        lesson = JSON.parse(extractJsonText(result.rawText));
        modelName = result.model;
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!lesson && lastError) {
      throw lastError;
    }
  }

  const validator = new ContentValidator();
  const validation = await validator.validateLesson(lesson, level);

  if (!DRY_RUN) {
    await saveGenerationLog({ lesson, prompt, validation, modelName });
  }

  const saved = SAVE ? await saveLessonFile({ lesson, validation }) : null;

  console.log(JSON.stringify({
    dryRun: DRY_RUN,
    modelName,
    validation,
    saved,
    lesson
  }, null, 2));
};

await run();
