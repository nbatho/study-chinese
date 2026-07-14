import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    VocabularyRadicalsResponse,
    VocabularyResponse,
    VocabularySearchParams,
    VocabularyStatsResponse,
    VocabularyTopicsResponse,
    WordLookupResponse,
} from './types';

export const vocabularyApi = {
    search: (params?: VocabularySearchParams) => apiRequest<VocabularyResponse>(beApi.get('vocabulary/search', { params })),
    topics: () => apiRequest<VocabularyTopicsResponse>(beApi.get('vocabulary/topics')),
    radicals: () => apiRequest<VocabularyRadicalsResponse>(beApi.get('vocabulary/radicals')),
    stats: () => apiRequest<VocabularyStatsResponse>(beApi.get('vocabulary/stats')),
    lookup: (text: string) => apiRequest<WordLookupResponse>(beApi.get('vocabulary/lookup', { params: { q: text } })),
};

export * from './types';
