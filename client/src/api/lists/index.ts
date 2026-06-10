import beApi from '../callApi';
import { apiRequest, emptyRequest } from '../shared';
import type { CreateListPayload, CreateListResponse, ListsResponse, ListWordsResponse } from './types';

export const listsApi = {
    list: () => apiRequest<ListsResponse>(beApi.get('lists')),

    create: (payload: CreateListPayload) => apiRequest<CreateListResponse>(beApi.post('lists', payload)),

    remove: (listId: string) => emptyRequest(beApi.delete(`lists/${listId}`)),

    addWord: (listId: string, payload: { wordId: string }) =>
        apiRequest<ListWordsResponse>(beApi.post(`lists/${listId}/words`, payload)),

    removeWord: (listId: string, wordId: string) =>
        apiRequest<ListWordsResponse>(beApi.delete(`lists/${listId}/words/${wordId}`)),
};

export * from './types';
