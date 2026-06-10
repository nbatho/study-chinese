export interface Word {
    id: string;
    simplified: string;
    traditional: string;
    pinyin: string;
    tones: number[];
    english: string;
    partOfSpeech: string;
    hskLevel: number;
    category: string;
}

export interface VocabularySearchParams {
    q?: string;
    hsk?: number;
    category?: string;
}

export interface VocabularyResponse {
    vocab: Word[];
}
