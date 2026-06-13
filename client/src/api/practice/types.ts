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
    promptId: string;
    audio?: string;
    audioMimeType?: string;
}

export interface ShadowingScore {
    accuracy: number;
    tones: number;
    fluency: number;
    overall: number;
    tip: string;
}

export interface ShadowingScoreResponse {
    score: ShadowingScore;
}
