import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { vocabularyApi } from './index';
import type { VocabularySearchParams } from './types';
import { useAppSelector } from '../../store/hooks';

// `locale` rides along in the search params, so it is part of the query key and
// switching the app language refetches instead of serving the old language.
export const useVocabularyQuery = (params?: VocabularySearchParams, enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);
    const searchParams = { ...params, locale };

    return useQuery({
        queryKey: queryKeys.vocabulary.search(searchParams),
        queryFn: () => unwrapApiData(vocabularyApi.search(searchParams)),
        enabled,
    });
};

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

export const useWordLookupQuery = (text: string, enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: queryKeys.vocabulary.lookup(text, locale),
        queryFn: () => unwrapApiData(vocabularyApi.lookup(text, locale)),
        enabled: enabled && text.length > 0,
        staleTime: 1000 * 60 * 60,
    });
};
