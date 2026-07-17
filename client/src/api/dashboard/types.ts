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
}
