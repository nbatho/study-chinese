import type { Achievement } from '../achievements';

export interface SrsDueCard {
    wordId: string;
    simplified: string;
    pinyin: string;
    english: string;
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

export interface ReviewCardPayload {
    wordId: string;
    quality: ReviewQuality;
}

export interface ReviewCardResponse {
    card: SrsCard;
    xpEarned: number;
    todayWordsReviewed: number;
    unlockedAchievements?: Achievement[];
}

export interface EnrollWordPayload {
    wordId: string;
}

export interface EnrollWordResponse {
    enrolled: boolean;
}
