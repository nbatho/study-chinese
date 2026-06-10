export interface CustomList {
    id: string;
    name: string;
    emoji: string;
    wordIds: string[];
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

export interface ListWordsResponse {
    listId: string;
    wordIds: string[];
}
