import type { Achievement } from '../achievements';

export interface SrsDueCard {
    wordId: string;
    simplified: string;
    pinyin: string;
    /** English definition — the source text every gloss is translated from. */
    english: string;
    /** Definition in the requested locale; falls back to `english` when untranslated. */
    gloss: string;
    dueCardDetails: {
        easeFactor: number;
        intervalDays: number;
        repetitions: number;
        dueDate: string;
        masteryLevel: string;
    };
}

export interface SrsCard {
    wordId: string;
    easeFactor: number;
    intervalDays: number;
    repetitions: number;
    dueDate: string;
    masteryLevel: string;
    correctStreak: number;
    wrongCount: number;
}

export type ReviewQuality = 'again' | 'hard' | 'good' | 'easy';

export interface DueCardsResponse {
    cards: SrsDueCard[];
}

/** Every enrolled word, due or not — powers the "review list" view. */
export interface SrsEnrolledCard extends SrsDueCard {
    isDue: boolean;
}

export interface AllCardsResponse {
    cards: SrsEnrolledCard[];
}

export interface ReviewCardPayload {
    wordId: string;
    quality: ReviewQuality;
    mistake?: {
        wordId?: string;
        skill: string;
        prompt?: string;
        userAnswer?: string;
        correctAnswer?: string;
        simplified?: string;
        pinyin?: string;
        english?: string;
        context?: Record<string, unknown>;
    };
}

export interface ReviewCardResponse {
    card: SrsCard;
    xpEarned: number;
    todayWordsReviewed: number;
    mistake?: unknown;
    unlockedAchievements?: Achievement[];
}

export interface EnrollWordPayload {
    wordId?: string;
    simplified?: string;
    traditional?: string;
    text?: string;
    pinyin?: string;
    english?: string;
}

export interface EnrollWordResponse {
    enrolled: boolean;
    word?: unknown;
}

export interface UnenrollWordResponse {
    removed: boolean;
}
