import type { Achievement } from '../achievements';
import type { CefrLevel, UserStreak, UserWallet } from '../users';
import type { Word } from '../vocabulary';

export interface LessonContentCounts {
    vocab: number;
    grammar: number;
    dialogueLines: number;
    readingPassages: number;
    exercises: number;
}

export interface LessonSummary {
    id: string;
    title: string;
    subtitle: string;
    titleEn?: string;
    titleVi?: string | null;
    subtitleEn?: string;
    subtitleVi?: string | null;
    hskLevel: number;
    cefrLevel: CefrLevel;
    order: number;
    skill: string;
    estimatedMinutes: number;
    xpReward: number;
    grammarCount: number;
    contentCounts?: LessonContentCounts | null;
    completedAt: string | null;
    bestAccuracy: number;
    attempts: number;
}

export interface LessonDetail extends Omit<LessonSummary, 'grammarCount' | 'completedAt' | 'bestAccuracy' | 'attempts'> {
    intro: string;
    introEn?: string;
    introVi?: string | null;
    learningObjectives?: string[];
    learningObjectivesEn?: string[];
    learningObjectivesVi?: string[];
    newWords: Word[];
    grammar: Array<{
        id: string;
        pattern: string;
        explanation: string;
        explanationEn?: string;
        explanationVi?: string | null;
        tips: string[];
        tipsEn?: string[];
        tipsVi?: string[];
        hskLevel?: number | null;
        cefrLevel?: CefrLevel | null;
        examples: Array<{
            simplified: string;
            traditional?: string;
            pinyin: string;
            english: string;
            en?: string;
            vi?: string | null;
        }>;
    }>;
    dialogue?: {
        id: string;
        title: string;
        scenario: string;
        lines: Array<{
            id: string;
            speaker: string;
            isUser: boolean;
            simplified: string;
            traditional: string;
            pinyin: string;
            english: string;
            en?: string;
            vi?: string | null;
        }>;
    } | null;
    exercises: Array<{
        id: string;
        kind: string;
        prompt: string;
        promptZh?: string;
        promptEn?: string | null;
        promptVi?: string | null;
        promptHanzi?: string;
        promptPinyin?: string;
        promptEnglish?: string;
        stimulus?: {
            type?: 'reading' | 'dialogue';
            title?: string;
            text?: string;
            pinyin?: string;
            english?: string;
            vocabulary?: string[];
            audioText?: string;
            lines?: Array<{
                speaker: string;
                simplified: string;
                pinyin?: string;
                english?: string;
            }>;
        };
        options?: string[];
        optionsZh?: string[];
        optionsEn?: string[];
        optionsVi?: string[];
        correctIndex?: number;
        correctText: string;
        correctTextZh?: string;
        correctTextEn?: string | null;
        correctTextVi?: string | null;
        answerExplanation?: string | null;
        answerExplanationZh?: string | null;
        answerExplanationEn?: string | null;
        answerExplanationVi?: string | null;
        acceptableVariants?: string[];
        audioWordId?: string;
        tone?: number;
    }>;
}

export interface LessonsResponse {
    lessons: LessonSummary[];
}

export interface LessonDetailResponse {
    lesson: LessonDetail;
}

export interface LessonGrammarEntry {
    id: string;
    pattern: string;
    explanation: string;
    explanationEn?: string;
    explanationVi?: string | null;
    tips: string[];
    tipsEn?: string[];
    tipsVi?: string[];
    hskLevel?: number | null;
    cefrLevel?: CefrLevel | null;
    examples: Array<{
        simplified: string;
        traditional?: string;
        pinyin: string;
        english: string;
        en?: string;
        vi?: string | null;
    }>;
    lesson: Pick<LessonSummary, 'id' | 'title' | 'subtitle' | 'hskLevel' | 'cefrLevel' | 'order' | 'skill' | 'completedAt' | 'bestAccuracy' | 'attempts'>;
}

export interface LessonGrammarIndexResponse {
    grammar: LessonGrammarEntry[];
}

export interface CompleteLessonPayload {
    accuracy: number;
    minutes?: number;
}

export interface CompleteLessonResponse {
    xpEarned: number;
    gemsEarned: number;
    wallet?: UserWallet | null;
    newWordsEnrolled: string[];
    progress: {
        lessonId: string;
        completedAt: string;
        bestAccuracy: number;
        attempts: number;
    };
    streak: UserStreak;
    unlockedAchievements?: Achievement[];
}

export interface ReportLessonIssuePayload {
    category: 'content' | 'translation' | 'audio' | 'exercise' | 'technical' | 'other';
    message: string;
    wordId?: string | null;
    exerciseId?: string | null;
}

export interface ReportLessonIssueResponse {
    report: {
        id: string;
        lessonId: string;
        category: string;
        status: string;
        message: string;
        createdAt: string;
    };
}
