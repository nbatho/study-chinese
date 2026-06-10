export interface GrammarLibraryEntry {
    id: string;
    title: string;
    pattern: string;
    summary: string;
    examples: Array<{
        simplified: string;
        pinyin: string;
        english: string;
    }>;
}

export interface DailyPhrase {
    simplified: string;
    pinyin: string;
    english: string;
    note: string;
}

export interface DailyContentResponse {
    phrase: DailyPhrase | null;
    grammarLibrary: GrammarLibraryEntry[];
}
