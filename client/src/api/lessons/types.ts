import type { Achievement } from '../achievements';
import type { UserStreak } from '../users';
import type { Word } from '../vocabulary';

export interface LessonSummary {
    id: string;
    title: string;
    subtitle: string;
    hskLevel: number;
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
