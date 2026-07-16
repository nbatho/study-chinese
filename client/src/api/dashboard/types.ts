export interface GrammarLibraryEntry {
    id: string;
    title: string;
    titleVi?: string | null;
    pattern: string;
    summary: string;
    summaryVi?: string | null;
    examples: Array<{
        simplified: string;
        pinyin: string;
        english: string;
    }>;
}

export interface DailyPhrase {
    simplified: string;
    pinyin: string;
    /** Source text; always English. */
    english: string;
    /** Meaning in the requested locale, falling back to `english`. */
    gloss: string;
    /** Usage tip in the requested locale, falling back to its English source. */
    note: string | null;
}

export interface DailyContentResponse {
    phrase: DailyPhrase | null;
    grammarLibrary: GrammarLibraryEntry[];
}
