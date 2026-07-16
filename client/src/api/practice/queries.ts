import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { practiceApi } from './index';
import type { PronunciationCheckPayload, ShadowingScorePayload } from './types';
import { useAppSelector } from '../../store/hooks';

export const usePracticeCatalogQuery = () =>
    useQuery({
        queryKey: queryKeys.practice.catalog,
        queryFn: () => unwrapApiData(practiceApi.catalog()),
    });

export const useMinimalPairsQuery = () =>
    useQuery({
        queryKey: queryKeys.practice.minimalPairs,
        queryFn: () => unwrapApiData(practiceApi.minimalPairs()),
    });

export const useShadowingPromptsQuery = () => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: queryKeys.practice.shadowingPrompts(locale),
        queryFn: () => unwrapApiData(practiceApi.shadowingPrompts({ locale })),
    });
};

export const useScoreShadowingMutation = () =>
    useMutation({
        mutationFn: (payload: ShadowingScorePayload) =>
            unwrapApiData(practiceApi.scoreShadowing(payload)),
    });

export const usePronunciationCheckMutation = () =>
    useMutation({
        mutationFn: (payload: PronunciationCheckPayload) =>
            unwrapApiData(practiceApi.pronunciationCheck(payload)),
    });

export const useHanziStrokesQuery = () =>
    useQuery({
        queryKey: queryKeys.practice.hanziStrokes,
        queryFn: () => unwrapApiData(practiceApi.hanziStrokes()),
    });

