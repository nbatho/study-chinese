import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    VocabularyRadicalsResponse,
    VocabularyResponse,
    VocabularySearchParams,
    VocabularyStatsResponse,
    VocabularyTopicsResponse,
} from './types';

export const vocabularyApi = {
    search: (params?: VocabularySearchParams) => apiRequest<VocabularyResponse>(beApi.get('vocabulary/search', { params })),
    topics: () => apiRequest<VocabularyTopicsResponse>(beApi.get('vocabulary/topics')),
    radicals: () => apiRequest<VocabularyRadicalsResponse>(beApi.get('vocabulary/radicals')),
    stats: () => apiRequest<VocabularyStatsResponse>(beApi.get('vocabulary/stats')),
};

export * from './types';
