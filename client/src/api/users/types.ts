export interface UserProfile {
    name: string;
    avatar: string;
    startLevel: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
    goalPurpose: 'travel' | 'business' | 'hskExam' | 'culture' | 'family' | 'casual';
    dailyMinutes: number;
    showPinyin: boolean;
    audioAutoPlay: boolean;
    appAppearance: 'light' | 'dark' | 'system';
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
}

export interface AddActivityResponse {
    todayStats: DailyStat;
    streak: UserStreak;
}
