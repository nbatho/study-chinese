import type { CefrLevel } from '../users';

export interface Word {
    id: string;
    simplified: string;
    traditional: string;
    pinyin: string;
    hanViet?: string | null;
    tones: number[];
    english: string;
    englishVi?: string | null;
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

export interface WordLookupEntry {
    id: string | null;
    wordId?: string | null;
    simplified: string;
    traditional: string;
    pinyin: string | null;
    hanViet: string | null;
    english: string | null;
    hskLevel: number | null;
    source: 'words' | 'dictionary' | 'none';
}

export interface WordLookupResponse {
    entry: WordLookupEntry;
}

export interface VocabularyStatsResponse {
    hsk: Array<{ level: number; count: number }>;
    cefr: Array<{ level: CefrLevel; count: number }>;
    topics: Array<{ id: string; nameEn: string; count: number }>;
}
