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

export interface AddActivityPayload {
    xp?: number;
    minutes?: number;
    exercisesCorrect?: number;
    exercisesTotal?: number;
    skill?: string;
    skillScore?: number;
}

export interface AddActivityResponse {
    todayStats: DailyStat;
    streak: UserStreak;
    unlockedAchievements?: Achievement[];
}
