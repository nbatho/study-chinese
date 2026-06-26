export interface MinimalPair {
    id: string;
    wordA: string;
    wordB: string;
    charA: string;
    charB: string;
    toneA: number;
    toneB: number;
    label: string;
}

export interface ShadowingPrompt {
    id: string;
    hanzi: string;
    pinyin: string;
    english: string;
}

export interface HanziStrokeCharacter {
    id: string;
    character: string;
    strokes: string[];
}

export interface PracticeCatalogResponse {
    minimalPairs: MinimalPair[];
    shadowingPrompts: ShadowingPrompt[];
    hanziStrokes: HanziStrokeCharacter[];
}

export interface MinimalPairsResponse {
    pairs: MinimalPair[];
}

export interface ShadowingPromptsResponse {
    prompts: ShadowingPrompt[];
}

export interface HanziStrokesResponse {
    characters: HanziStrokeCharacter[];
}

export interface ShadowingScorePayload {
    expectedText: string;
    audio?: string;
    audioMimeType?: string;
}

export interface CharDiffEntry {
    char: string;
    got: string;
    status: 'correct' | 'wrong' | 'missing' | 'extra';
}

export interface ShadowingScoreDetails {
    expected: string;
    got: string;
    charDiff: CharDiffEntry[];
}

export interface ShadowingScore {
    accuracy: number;
    tones: number;
    fluency: number;
    overall: number;
    tip: string;
    transcribedText?: string;
    details?: ShadowingScoreDetails;
}

export interface ShadowingScoreResponse {
    score: ShadowingScore;
}

export interface PronunciationCheckPayload {
    audio?: string;
    audioMimeType?: string;
    expectedText: string;
}

export interface PronunciationCheckResponse {
    transcribedText: string | null;
    score: ShadowingScore;
}

