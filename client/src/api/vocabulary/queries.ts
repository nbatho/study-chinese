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

export const useVocabularyTopicsQuery = () =>
    useQuery({
        queryKey: queryKeys.vocabulary.topics,
        queryFn: () => unwrapApiData(vocabularyApi.topics()),
    });

export const useVocabularyRadicalsQuery = () =>
    useQuery({
        queryKey: queryKeys.vocabulary.radicals,
        queryFn: () => unwrapApiData(vocabularyApi.radicals()),
    });

export const useVocabularyStatsQuery = () =>
    useQuery({
        queryKey: queryKeys.vocabulary.stats,
        queryFn: () => unwrapApiData(vocabularyApi.stats()),
    });
