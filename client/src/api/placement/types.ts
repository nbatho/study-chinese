import type { CefrLevel, UserProfileResponse } from '../users';

export type PlacementSection = 'vocabulary' | 'grammar' | 'reading';

export interface PlacementQuestion {
    id: string;
    section: PlacementSection;
    cefrLevel: CefrLevel;
    prompt: string;
    promptHanzi?: string | null;
    promptPinyin?: string | null;
    options: string[];
    correctIndex: number;
    correctText: string;
    explanation?: string | null;
    difficulty: number;
    order: number;
}

export interface PlacementQuestionsResponse {
    questions: PlacementQuestion[];
}

export interface PlacementSectionBreakdown {
    section: PlacementSection;
    correct: number;
    total: number;
    score: number;
}

export interface PlacementResult {
    cefrLevel: CefrLevel;
    startLevel: 'beginner' | 'elementary' | 'intermediate' | 'upper_intermediate' | 'advanced' | 'mastery';
    score: number;
    correct: number;
    total: number;
    breakdown: PlacementSectionBreakdown[];
}

export interface PlacementSubmitPayload {
    cefrLevel: CefrLevel;
    score: number;
    completedAt?: string;
}

export type PlacementSubmitResponse = UserProfileResponse;
