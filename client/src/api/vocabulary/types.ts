import type { CefrLevel } from '../users';

export interface Word {
    id: string;
    simplified: string;
    traditional: string;
    pinyin: string;
    tones: number[];
    english: string;
    partOfSpeech: string;
    hskLevel: number;
    cefrLevel: CefrLevel;
    category: string;
    radical: string | null;
    frequency: number | null;
    topics: VocabularyTopic[];
}

export interface VocabularyTopic {
    id: string;
    nameEn: string;
    nameZh?: string | null;
    emoji?: string | null;
    displayOrder?: number;
    wordCount?: number;
}

export interface VocabularyRadical {
    radical: string;
    count: number;
}

export type VocabularySort = 'frequency' | 'alphabetical' | 'hsk';

export interface VocabularySearchParams {
    q?: string;
    hsk?: number;
    category?: string;
    cefr?: CefrLevel;
    radical?: string;
    topic?: string;
    sort?: VocabularySort;
    page?: number;
    limit?: number;
}

export interface VocabularyResponse {
    vocab: Word[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

export interface VocabularyTopicsResponse {
    topics: VocabularyTopic[];
}

export interface VocabularyRadicalsResponse {
    radicals: VocabularyRadical[];
}

export interface VocabularyStatsResponse {
    hsk: Array<{ level: number; count: number }>;
    cefr: Array<{ level: CefrLevel; count: number }>;
    topics: Array<{ id: string; nameEn: string; count: number }>;
}
