import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { practiceApi } from './index';
import type { ShadowingScorePayload } from './types';

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

export const useShadowingPromptsQuery = () =>
    useQuery({
        queryKey: queryKeys.practice.shadowingPrompts,
        queryFn: () => unwrapApiData(practiceApi.shadowingPrompts()),
    });

export const useScoreShadowingMutation = () =>
    useMutation({
        mutationFn: (payload: ShadowingScorePayload) =>
            unwrapApiData(practiceApi.scoreShadowing(payload)),
    });

export const useHanziStrokesQuery = () =>
    useQuery({
        queryKey: queryKeys.practice.hanziStrokes,
        queryFn: () => unwrapApiData(practiceApi.hanziStrokes()),
    });
