import beApi from '../callApi';
import { apiRequest } from '../shared';
import type { VocabularyResponse, VocabularySearchParams } from './types';

export const vocabularyApi = {
    search: (params?: VocabularySearchParams) => apiRequest<VocabularyResponse>(beApi.get('vocab', { params })),
};

export * from './types';
