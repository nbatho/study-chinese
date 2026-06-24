import type { Achievement } from '../achievements';

export type SkillLevel = 'beginner' | 'elementary' | 'intermediate' | 'advanced';
export type LearningGoal = 'travel' | 'business' | 'hskExam' | 'culture' | 'family' | 'casual';
export type AppAppearance = 'light' | 'dark' | 'system';

export interface UserProfile {
    name: string;
    avatar: string;
    startLevel: SkillLevel;
    goalPurpose: LearningGoal;
    dailyMinutes: number;
    showPinyin: boolean;
    audioAutoPlay: boolean;
    appAppearance: AppAppearance;
    hasCompletedOnboarding: boolean;
    timezone?: string;
    joinDate: string;
}

export interface UserStreak {
    current: number;
    best: number;
    lastStudyDateKey: string | null;
}

export interface DailyStat {
    dateKey: string;
    xp: number;
    minutesStudied: number;
    lessonsCompleted: number;
    wordsReviewed: number;
    exercisesCorrect: number;
    exercisesTotal: number;
}

export interface UserProfileResponse {
    profile: UserProfile;
    streak: UserStreak;
}

export interface UserStatsResponse {
    stats: DailyStat[];
}

export interface TodayPlanStep {
    id: string;
    kind: 'review' | 'practice' | 'lesson' | 'ai';
    title: string;
    description: string;
    estimateMinutes: number;
    href: string;
    status: 'done' | 'current' | 'next';
    meta?: Record<string, unknown>;
}

export interface TodayPlanResponse {
    plan: {
        dateKey: string;
        xpTarget: number;
        todayXp: number;
        dailyMinutes: number;
        steps: TodayPlanStep[];
    };
}

export interface AddActivityPayload {
    xp?: number;
    minutes?: number;
    exercisesCorrect?: number;
    exercisesTotal?: number;
    skill?: string;
    skillScore?: number;
    mistake?: MistakePayload;
}

export interface AddActivityResponse {
    todayStats: DailyStat;
    streak: UserStreak;
    mistake?: MistakeItem | null;
    unlockedAchievements?: Achievement[];
}

export interface MistakePayload {
    wordId?: string;
    skill: string;
    prompt?: string;
    userAnswer?: string;
    correctAnswer?: string;
    simplified?: string;
    pinyin?: string;
    english?: string;
    context?: Record<string, unknown>;
}

export interface MistakeItem {
    id: string;
    wordId?: string | null;
    skill: string;
    prompt?: string | null;
    userAnswer?: string | null;
    correctAnswer?: string | null;
    simplified?: string | null;
    pinyin?: string | null;
    english?: string | null;
    context?: Record<string, unknown>;
    mistakeCount: number;
    resolvedCount: number;
    needsPracticeCount: number;
    lastMistakeAt: string;
    lastPracticedAt?: string | null;
}

export interface MistakesResponse {
    mistakes: MistakeItem[];
}

export interface RecordMistakeResponse {
    mistake: MistakeItem;
}

export interface PracticeMistakePayload {
    correct: boolean;
}

export interface PracticeMistakeResponse {
    mistake: MistakeItem;
}
