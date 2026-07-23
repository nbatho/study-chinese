import type { CefrLevel } from "../../api/users";

export type CurriculumSkill =
  | "grammar"
  | "vocabulary"
  | "writing"
  | "listening"
  | "speaking"
  | "reading"
  | "test";

export interface CurriculumLesson {
  order: number;
  skill: CurriculumSkill;
  title: string;
  objective: string;
  estimatedMinutes: number;
  xpReward: number;
}

export interface CurriculumTopic {
  id: string;
  title: string;
  lessons: CurriculumLesson[];
}

export interface HskCurriculumLevel {
  hskLevel: number;
  cefrLevel: CefrLevel;
  focus: string;
  topics: CurriculumTopic[];
  endTest: CurriculumLesson;
}

const lesson = (
  order: number,
  skill: CurriculumSkill,
  title: string,
  objective: string,
  estimatedMinutes = 12,
  xpReward = 30,
): CurriculumLesson => ({ order, skill, title, objective, estimatedMinutes, xpReward });

export const HSK_CURRICULUM: HskCurriculumLevel[] = [
  {
    hskLevel: 1,
    cefrLevel: "A1",
    focus: "Grammar, core vocabulary, and simple sentence writing",
    topics: [
      {
        id: "hsk1-introductions",
        title: "Introductions and personal details",
        lessons: [
          lesson(1, "grammar", "Pronouns and basic identity sentences", "Write short self-introduction sentences with name, nationality, and role."),
          lesson(2, "vocabulary", "Greetings, countries, and jobs", "Recognize essential greeting and profile words in short texts."),
          lesson(3, "writing", "Yes/no and question-word forms", "Write simple questions about name, age, home, and likes."),
          lesson(4, "speaking", "First self-introduction", "Introduce yourself and answer slow, supported personal questions."),
        ],
      },
      {
        id: "hsk1-family",
        title: "Family and close relationships",
        lessons: [
          lesson(5, "vocabulary", "Family members and basic adjectives", "Name close family members and describe them with simple adjectives."),
          lesson(6, "grammar", "Possession and have/has patterns", "Write sentences about who has what and who belongs to whom."),
          lesson(7, "reading", "A short family profile", "Find relationships, ages, and simple facts in a short paragraph."),
          lesson(8, "listening", "Recognizing family descriptions", "Identify people and details in slow, clear audio."),
        ],
      },
      {
        id: "hsk1-daily-life",
        title: "Daily routine",
        lessons: [
          lesson(9, "grammar", "Present habits and daily actions", "Write simple routine sentences about waking, eating, studying, and sleeping."),
          lesson(10, "vocabulary", "Time, weekdays, and daily verbs", "Read simple schedules and match activities to times."),
          lesson(11, "writing", "Frequency words in short routines", "Write a short daily routine with always, usually, and sometimes."),
          lesson(12, "listening", "A simple daily schedule", "Recognize times, activities, and order of events."),
        ],
      },
      {
        id: "hsk1-shopping",
        title: "Shopping and concrete needs",
        lessons: [
          lesson(13, "vocabulary", "Numbers, prices, food, and objects", "Write a basic shopping list and recognize prices."),
          lesson(14, "grammar", "There is, there are, and simple negatives", "Describe what exists or does not exist in a shop or room."),
          lesson(15, "reading", "Menus, price tags, and labels", "Find product names, quantities, and prices in simple texts."),
          lesson(16, "speaking", "Buying something politely", "Ask for an item, ask the price, and close a basic transaction."),
        ],
      },
    ],
    endTest: lesson(17, "test", "HSK 1 end-of-level can-do test", "Show A1 ability across simple writing, basic reading, slow listening, and supported speaking.", 20, 50),
  },
  {
    hskLevel: 2,
    cefrLevel: "A2",
    focus: "Routine communication, sentence expansion, and practical writing",
    topics: [
      {
        id: "hsk2-home-city",
        title: "Home, city, and local places",
        lessons: [
          lesson(1, "grammar", "Location words and existence patterns", "Describe where people, places, and objects are."),
          lesson(2, "vocabulary", "Neighborhood places and directions", "Recognize common public places and route words."),
          lesson(3, "writing", "Describing your area", "Write a short connected description of your home or neighborhood."),
          lesson(4, "listening", "Following simple directions", "Understand clear route instructions and location details."),
        ],
      },
      {
        id: "hsk2-plans",
        title: "Plans, invitations, and appointments",
        lessons: [
          lesson(5, "grammar", "Time phrases and future plans", "Write sentences about what will happen and when."),
          lesson(6, "speaking", "Making and accepting invitations", "Invite someone, accept, refuse, and suggest another time."),
          lesson(7, "reading", "Messages and appointment notes", "Find time, place, and purpose in short practical messages."),
          lesson(8, "writing", "A short invitation message", "Write a clear invitation with time, place, and activity."),
        ],
      },
      {
        id: "hsk2-food-travel",
        title: "Food, transport, and travel basics",
        lessons: [
          lesson(9, "vocabulary", "Meals, transport, and tickets", "Use common words for ordering food and moving around."),
          lesson(10, "listening", "Restaurant and transport exchanges", "Understand simple service conversations."),
          lesson(11, "speaking", "Ordering and asking for help", "Handle routine exchanges in restaurants and stations."),
          lesson(12, "grammar", "Measure words and comparison basics", "Use common measure words and simple comparisons."),
        ],
      },
      {
        id: "hsk2-health-weather",
        title: "Health, weather, and immediate needs",
        lessons: [
          lesson(13, "reading", "Weather reports and simple notices", "Read short notices about weather, opening times, and needs."),
          lesson(14, "vocabulary", "Body, feelings, and weather", "Describe basic health, mood, and weather conditions."),
          lesson(15, "writing", "Explaining a simple problem", "Write a short message about being late, sick, or needing help."),
          lesson(16, "speaking", "Requesting help in routine situations", "Explain a basic problem and ask for a simple solution."),
        ],
      },
    ],
    endTest: lesson(17, "test", "HSK 2 end-of-level can-do test", "Show A2 ability in routine tasks, short messages, familiar reading, and simple exchanges.", 22, 55),
  },
  {
    hskLevel: 3,
    cefrLevel: "B1",
    focus: "Reading, listening, and responsive communication on familiar topics",
    topics: [
      {
        id: "hsk3-experiences",
        title: "Personal experiences and events",
        lessons: [
          lesson(1, "reading", "Reading a personal story", "Identify main ideas, sequence, emotions, and supporting details."),
          lesson(2, "listening", "Listening to a travel or life story", "Understand main points in clear standard speech."),
          lesson(3, "speaking", "Retelling a memorable event", "Speak for one to two minutes with time markers and connectors."),
          lesson(4, "writing", "A connected experience paragraph", "Write a 120-150 word account with beginning, middle, and ending."),
        ],
      },
      {
        id: "hsk3-travel",
        title: "Travel and problem solving",
        lessons: [
          lesson(5, "listening", "Hotel, station, and airport situations", "Catch requests, problems, instructions, and practical details."),
          lesson(6, "speaking", "Solving travel problems", "Ask for help, explain the issue, and check understanding."),
          lesson(7, "reading", "Schedules, notices, and travel guidance", "Find necessary information and infer the right action."),
          lesson(8, "writing", "Changing or canceling a booking", "Write a polite practical message with all needed details."),
        ],
      },
      {
        id: "hsk3-study-work",
        title: "Study, work, and future plans",
        lessons: [
          lesson(9, "reading", "Choosing a field or job", "Recognize opinions, reasons, and examples in familiar texts."),
          lesson(10, "listening", "A short interview about study or work", "Understand key details about experience, goals, and challenges."),
          lesson(11, "speaking", "Presenting goals and plans", "Describe hopes, ambitions, plans, and reasons briefly."),
          lesson(12, "speaking", "Discussing choices and advice", "Agree, disagree politely, ask opinions, and give advice."),
        ],
      },
      {
        id: "hsk3-media-opinions",
        title: "Media, society, and opinions",
        lessons: [
          lesson(13, "reading", "A short article on daily life or media", "Understand the main point and separate fact from opinion."),
          lesson(14, "listening", "A familiar-topic discussion", "Identify each speaker's view and main reason."),
          lesson(15, "speaking", "Giving a supported opinion", "State an opinion with two reasons and a simple example."),
          lesson(16, "writing", "A short opinion paragraph", "Write a clear opinion paragraph with reasons, example, and conclusion."),
        ],
      },
    ],
    endTest: lesson(17, "test", "HSK 3 end-of-level can-do test", "Show B1 ability to understand clear input, handle familiar situations, and give short reasons.", 25, 60),
  },
  {
    hskLevel: 4,
    cefrLevel: "B2",
    focus: "Complex reading, sustained listening, and fluent interaction",
    topics: [
      {
        id: "hsk4-arguments",
        title: "Arguments and viewpoints",
        lessons: [
          lesson(1, "reading", "Reading balanced arguments", "Identify claims, evidence, counterpoints, and conclusion."),
          lesson(2, "listening", "Following a structured discussion", "Track main ideas and speaker stance in extended speech."),
          lesson(3, "speaking", "Explaining advantages and disadvantages", "Compare options and defend a preferred solution."),
          lesson(4, "writing", "A balanced opinion response", "Write a clear response with viewpoint, reasons, and contrast."),
        ],
      },
      {
        id: "hsk4-workplace",
        title: "Workplace and academic communication",
        lessons: [
          lesson(5, "listening", "Meeting updates and task negotiation", "Understand responsibilities, deadlines, and concerns."),
          lesson(6, "speaking", "Clarifying and negotiating tasks", "Ask precise questions, confirm details, and propose changes."),
          lesson(7, "reading", "Reports and formal announcements", "Scan for conclusions, requirements, and supporting facts."),
          lesson(8, "writing", "A concise professional email", "Write a structured request, update, or explanation."),
        ],
      },
      {
        id: "hsk4-culture",
        title: "Culture, customs, and comparison",
        lessons: [
          lesson(9, "reading", "Reading cultural explanation texts", "Understand examples, implied comparisons, and purpose."),
          lesson(10, "listening", "Interviews about customs", "Identify speaker attitudes and culturally specific details."),
          lesson(11, "speaking", "Comparing customs and habits", "Explain similarities, differences, and personal reactions."),
          lesson(12, "vocabulary", "Abstract nouns and connectors", "Use vocabulary for causes, effects, contrast, and social values."),
        ],
      },
      {
        id: "hsk4-news",
        title: "News, trends, and public life",
        lessons: [
          lesson(13, "reading", "Understanding news-style texts", "Find the issue, background, result, and stakeholder views."),
          lesson(14, "listening", "Listening to reports and interviews", "Follow clear reports on familiar public topics."),
          lesson(15, "speaking", "Reacting to current issues", "Give a spontaneous but organized response to a topical question."),
          lesson(16, "writing", "Summarizing a public issue", "Summarize key points and add a supported opinion."),
        ],
      },
    ],
    endTest: lesson(17, "test", "HSK 4 end-of-level can-do test", "Show B2 ability to understand complex familiar content and interact with fluency.", 28, 70),
  },
  {
    hskLevel: 5,
    cefrLevel: "C1",
    focus: "Demanding texts, implicit meaning, and flexible academic/professional expression",
    topics: [
      {
        id: "hsk5-implicit-meaning",
        title: "Implicit meaning and nuance",
        lessons: [
          lesson(1, "reading", "Reading between the lines", "Recognize implied meaning, tone, and author attitude."),
          lesson(2, "listening", "Inferring meaning in longer speech", "Understand indirect points and speaker intention."),
          lesson(3, "speaking", "Responding with nuance", "React flexibly while adjusting register and emphasis."),
          lesson(4, "writing", "A nuanced analytical paragraph", "Write precise analysis with cohesive devices and controlled tone."),
        ],
      },
      {
        id: "hsk5-academic",
        title: "Academic and professional analysis",
        lessons: [
          lesson(5, "reading", "Long-form analytical texts", "Extract structure, argument flow, and evidence hierarchy."),
          lesson(6, "listening", "Lectures and expert explanations", "Follow extended explanation and note key relationships."),
          lesson(7, "speaking", "Presenting a complex idea", "Explain a complex subject clearly with examples and signposting."),
          lesson(8, "writing", "A structured analytical response", "Produce clear, detailed text with logical organization."),
        ],
      },
      {
        id: "hsk5-social-professional",
        title: "Flexible social and professional language",
        lessons: [
          lesson(9, "listening", "Register shifts in conversation", "Notice formality, politeness, and relationship cues."),
          lesson(10, "speaking", "Adapting language to context", "Use language flexibly for social, academic, and professional purposes."),
          lesson(11, "reading", "Formal correspondence and policy texts", "Understand obligations, implications, and constraints."),
          lesson(12, "writing", "A formal proposal or response", "Write a polished text with purpose, justification, and next steps."),
        ],
      },
      {
        id: "hsk5-debate",
        title: "Debate and synthesis",
        lessons: [
          lesson(13, "reading", "Comparing multiple sources", "Synthesize viewpoints and identify agreements and conflicts."),
          lesson(14, "listening", "Panel discussion comprehension", "Follow multiple speakers and reconstruct the argument thread."),
          lesson(15, "speaking", "Defending a position under challenge", "Respond fluently to questions and refine your argument."),
          lesson(16, "writing", "Source-based synthesis", "Combine information from sources into a coherent written response."),
        ],
      },
    ],
    endTest: lesson(17, "test", "HSK 5 end-of-level can-do test", "Show C1 ability to handle demanding input and express ideas fluently and flexibly.", 30, 80),
  },
  {
    hskLevel: 6,
    cefrLevel: "C2",
    focus: "Near-complete comprehension, synthesis, precision, and spontaneous expression",
    topics: [
      {
        id: "hsk6-synthesis",
        title: "Synthesis across sources",
        lessons: [
          lesson(1, "reading", "Integrating complex written sources", "Understand and combine dense information from varied texts."),
          lesson(2, "listening", "Integrating spoken viewpoints", "Reconstruct arguments from long spoken sources."),
          lesson(3, "speaking", "Coherent synthesis presentation", "Present synthesized information clearly and precisely."),
          lesson(4, "writing", "A concise synthesis brief", "Summarize multiple sources without losing nuance."),
        ],
      },
      {
        id: "hsk6-precision",
        title: "Precision and shades of meaning",
        lessons: [
          lesson(5, "reading", "Fine distinctions in advanced texts", "Differentiate subtle meanings, stance, and rhetorical choices."),
          lesson(6, "listening", "Fast speech and idiomatic meaning", "Understand idiomatic, compressed, or fast natural speech."),
          lesson(7, "speaking", "Precise spontaneous expression", "Express subtle distinctions fluently in complex situations."),
          lesson(8, "vocabulary", "Advanced collocations and idioms", "Use high-precision vocabulary and idiomatic phrasing appropriately."),
        ],
      },
      {
        id: "hsk6-public-discourse",
        title: "Public discourse and rhetoric",
        lessons: [
          lesson(9, "reading", "Editorials and persuasive rhetoric", "Analyze persuasion, assumption, and rhetorical strategy."),
          lesson(10, "listening", "Speeches and advanced interviews", "Follow dense public discourse and implicit framing."),
          lesson(11, "speaking", "High-level argumentation", "Argue a position fluently while handling counterarguments."),
          lesson(12, "writing", "An advanced editorial response", "Write a precise, coherent response with controlled rhetorical effect."),
        ],
      },
      {
        id: "hsk6-masterclass",
        title: "Mastery tasks and mediation",
        lessons: [
          lesson(13, "reading", "Expert-level reading under time pressure", "Extract meaning quickly from complex unfamiliar material."),
          lesson(14, "listening", "Summarizing long spoken input", "Capture content, argument, and nuance from extended speech."),
          lesson(15, "speaking", "Mediating complex information", "Explain complex content clearly for a different audience."),
          lesson(16, "writing", "A polished final response", "Produce clear, well-structured, detailed text on a complex subject."),
        ],
      },
    ],
    endTest: lesson(17, "test", "HSK 6 end-of-level can-do test", "Show C2 ability to understand almost everything heard or read and express meaning precisely.", 35, 90),
  },
];

const getCurriculumLessonCount = (level: HskCurriculumLevel) =>
  level.topics.reduce((count, topic) => count + topic.lessons.length, 0) + 1;

export const getCurriculumLessons = (level: HskCurriculumLevel) => [
  ...level.topics.flatMap((topic) => topic.lessons),
  level.endTest,
];

export const CEFR_RANK: Record<CefrLevel, number> = { "pre-A1": 0, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

/** HSK 0 is the pronunciation track, so pre-A1 recommends HSK 0. */
const CEFR_RECOMMENDED_HSK: Record<CefrLevel, number> = { "pre-A1": 0, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };

const VISIBLE_HSK_LEVELS = HSK_CURRICULUM.map((level) => level.hskLevel);

/** Highest published HSK level the learner's CEFR level has reached. */
export const getRecommendedHsk = (cefrLevel: CefrLevel) => {
  const target = CEFR_RECOMMENDED_HSK[cefrLevel];

  return VISIBLE_HSK_LEVELS.reduce(
    (best, level) => (level <= target && level > best ? level : best),
    VISIBLE_HSK_LEVELS[0],
  );
};

export const getCurriculumLevel = (hskLevel: number) =>
  HSK_CURRICULUM.find((level) => level.hskLevel === hskLevel) ?? HSK_CURRICULUM[0];

/**
 * Progress within one HSK level. The denominator is that level's curriculum, not
 * every lesson in the database, and only server lessons whose `order` is part of
 * the curriculum count — so an out-of-syllabus lesson cannot push it past 100%.
 */
export const getLevelProgress = (
  level: HskCurriculumLevel,
  lessons: Array<{ hskLevel: number; order: number; completedAt: string | null }>,
) => {
  const completedOrders = new Set(
    lessons.filter((lesson) => lesson.hskLevel === level.hskLevel && lesson.completedAt).map((lesson) => lesson.order),
  );
  const completedCount = getCurriculumLessons(level).filter((lesson) => completedOrders.has(lesson.order)).length;
  const lessonCount = getCurriculumLessonCount(level);

  return {
    completedCount,
    lessonCount,
    percent: lessonCount ? Math.round((completedCount / lessonCount) * 100) : 0,
  };
};
