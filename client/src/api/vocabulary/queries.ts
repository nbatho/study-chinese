import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { vocabularyApi } from './index';
import type { VocabularySearchParams } from './types';

export const useVocabularyQuery = (params?: VocabularySearchParams) =>
    useQuery({
        queryKey: queryKeys.vocabulary.search(params),
        queryFn: () => unwrapApiData(vocabularyApi.search(params)),
    });
