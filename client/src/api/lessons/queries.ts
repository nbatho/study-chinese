import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { lessonsApi } from './index';
import type { CompleteLessonPayload, ReportLessonIssuePayload } from './types';
import { showAchievementToasts } from '../../utils/achievementToast';
import { useAppSelector } from '../../store/hooks';

export const useLessonsQuery = (enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: queryKeys.lessons.list(locale),
        queryFn: () => unwrapApiData(lessonsApi.list(locale)),
        enabled,
    });
};

export const useLessonGrammarIndexQuery = (enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: queryKeys.lessons.grammar(locale),
        queryFn: () => unwrapApiData(lessonsApi.grammarIndex(locale)),
        enabled,
    });
};

export const useLessonDetailQuery = (lessonId: string, enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: queryKeys.lessons.detail(lessonId, locale),
        queryFn: () => unwrapApiData(lessonsApi.detail(lessonId, locale)),
        enabled: enabled && Boolean(lessonId),
    });
};

// Public HSK1 trial for guests (no account needed, no progress saved).
export const useSampleLessonsQuery = (enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: queryKeys.lessons.list(`sample:${locale}`),
        queryFn: () => unwrapApiData(lessonsApi.sampleList(locale)),
        enabled,
    });
};

export const usePublicLessonDetailQuery = (lessonId: string, enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: queryKeys.lessons.detail(`public:${lessonId}`, locale),
        queryFn: () => unwrapApiData(lessonsApi.publicDetail(lessonId, locale)),
        enabled: enabled && Boolean(lessonId),
    });
};

export const useCompleteLessonMutation = (lessonId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CompleteLessonPayload) =>
            unwrapApiData(lessonsApi.complete(lessonId, payload)),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['lessons'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.srs.dueAll });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.todayPlanAll });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.shop });
            queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
            showAchievementToasts(data.unlockedAchievements);
        },
    });
};

// Completes a lesson chosen at call time (e.g. foundation stages), rather than one
// bound at hook-creation time. Same cache invalidation as useCompleteLessonMutation.
export const useCompleteLessonByIdMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ lessonId, ...payload }: CompleteLessonPayload & { lessonId: string }) =>
            unwrapApiData(lessonsApi.complete(lessonId, payload)),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['lessons'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.srs.dueAll });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.todayPlanAll });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.shop });
            queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
            showAchievementToasts(data.unlockedAchievements);
        },
    });
};

export const useReportLessonIssueMutation = (lessonId: string) =>
    useMutation({
        mutationFn: (payload: ReportLessonIssuePayload) =>
            unwrapApiData(lessonsApi.reportIssue(lessonId, payload)),
    });
