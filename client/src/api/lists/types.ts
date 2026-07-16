export interface CustomList {
    id: string;
    name: string;
    emoji: string;
    wordIds: string[];
}

export interface CustomListWord {
    id: string;
    simplified: string;
    traditional: string;
    pinyin: string;
    tones: number[];
    english: string;
    partOfSpeech: string;
    hskLevel: number;
    category: string;
    gloss: string;
}

export interface CustomListDetail extends CustomList {
    words: CustomListWord[];
}

export interface ListsResponse {
    lists: CustomList[];
}

export interface CreateListPayload {
    name: string;
    emoji?: string;
}

export interface CreateListResponse {
    list: CustomList;
}

export interface ListDetailResponse {
    list: CustomListDetail;
}

export interface ListWordsResponse {
    listId: string;
    wordIds: string[];
}

export interface AddWordToListPayload {
    wordId?: string;
    simplified?: string;
    traditional?: string;
    text?: string;
    pinyin?: string;
    english?: string;
}
