import type { Achievement } from '../achievements';

export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type SkillLevel = 'beginner' | 'elementary' | 'intermediate' | 'upper_intermediate' | 'advanced' | 'mastery';
export type LearningGoal = 'travel' | 'business' | 'hskExam' | 'culture' | 'family' | 'casual';
export type AppAppearance = 'light' | 'dark' | 'system';

export interface UserProfile {
    name: string;
    email?: string;
    emailVerified?: boolean;
    avatar: string;
    startLevel: SkillLevel;
    cefrLevel: CefrLevel;
    placementTestCompletedAt?: string | null;
    placementTestScore?: number | null;
    goalPurpose: LearningGoal;
    dailyMinutes: number;
    showPinyin: boolean;
    audioAutoPlay: boolean;
    appAppearance: AppAppearance;
    hasCompletedOnboarding: boolean;
    timezone?: string;
    aiTutorSkin?: string;
    joinDate: string;
}

export interface UserStreak {
    current: number;
    best: number;
    lastStudyDateKey: string | null;
    streakFreezes?: number;
    freezeUsed?: boolean;
}

export interface UserWallet {
    gemBalance: number;
    streakFreezes: number;
}

export interface UserPremium {
    isActive: boolean;
    expiresAt: string | null;
    aiDailyMessageLimit: number | null;
}

export interface UserCosmetics {
    aiTutorSkin: string;
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
    wallet: UserWallet;
    premium: UserPremium;
    cosmetics: UserCosmetics;
}

export interface UserStatsResponse {
    stats: DailyStat[];
}

/**
 * Copy lives in the client i18n bundle, keyed by `id`; the server sends only
 * the `id` and the values that copy interpolates.
 */
export interface TodayPlanStep {
    id: string;
    kind: 'review' | 'practice' | 'lesson' | 'ai';
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

export type ShopItemCategory = 'streak' | 'avatar' | 'ai_tutor' | 'premium';
export type ShopGrantType = 'streak_freeze' | 'avatar' | 'ai_tutor_skin' | 'premium_days';

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    emoji: string;
    category: ShopItemCategory;
    priceGems: number;
    grantType: ShopGrantType;
    grantQuantity: number;
    metadata: Record<string, unknown>;
    ownedQuantity: number;
    isOwned: boolean;
    isEquipped: boolean;
}

export interface ShopResponse {
    wallet: UserWallet;
    premium: UserPremium;
    cosmetics: UserCosmetics;
    items: ShopItem[];
}

export interface PurchaseShopItemResponse extends ShopResponse {
    purchased: boolean;
    equipped: boolean;
    item: ShopItem;
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
    /** Meaning in the requested locale, falling back to `english`. */
    gloss?: string | null;
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
