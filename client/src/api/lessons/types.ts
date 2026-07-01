import type { Achievement } from '../achievements';
import type { CefrLevel, UserStreak, UserWallet } from '../users';
import type { Word } from '../vocabulary';

export interface LessonSummary {
    id: string;
    title: string;
    subtitle: string;
    hskLevel: number;
    cefrLevel: CefrLevel;
    order: number;
    skill: string;
    estimatedMinutes: number;
    xpReward: number;
    completedAt: string | null;
    bestAccuracy: number;
    attempts: number;
}

export interface LessonDetail extends Omit<LessonSummary, 'completedAt' | 'bestAccuracy' | 'attempts'> {
    intro: string;
    newWords: Word[];
    grammar: Array<{
        id: string;
        pattern: string;
        explanation: string;
        tips: string[];
        examples: Array<{
            simplified: string;
            traditional?: string;
            pinyin: string;
            english: string;
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
        }>;
    } | null;
    exercises: Array<{
        id: string;
        kind: string;
        prompt: string;
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
        correctIndex?: number;
        correctText: string;
        answerExplanation?: string | null;
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
