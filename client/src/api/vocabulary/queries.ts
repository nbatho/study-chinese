import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { vocabularyApi } from './index';
import type { VocabularySearchParams } from './types';

export const useVocabularyQuery = (params?: VocabularySearchParams, enabled = true) =>
    useQuery({
        queryKey: queryKeys.vocabulary.search(params),
        queryFn: () => unwrapApiData(vocabularyApi.search(params)),
        enabled,
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

export const useWordLookupQuery = (text: string, enabled = true) =>
    useQuery({
        queryKey: queryKeys.vocabulary.lookup(text),
        queryFn: () => unwrapApiData(vocabularyApi.lookup(text)),
        enabled: enabled && text.length > 0,
        staleTime: 1000 * 60 * 60,
    });
