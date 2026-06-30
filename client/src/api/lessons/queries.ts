import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { lessonsApi } from './index';
import type { CompleteLessonPayload, ReportLessonIssuePayload } from './types';
import { showAchievementToasts } from '../../utils/achievementToast';

export const useLessonsQuery = (enabled = true) =>
    useQuery({
        queryKey: queryKeys.lessons.list,
        queryFn: () => unwrapApiData(lessonsApi.list()),
        enabled,
    });

export const useLessonDetailQuery = (lessonId: string, enabled = true) =>
    useQuery({
        queryKey: queryKeys.lessons.detail(lessonId),
        queryFn: () => unwrapApiData(lessonsApi.detail(lessonId)),
        enabled: enabled && Boolean(lessonId),
    });

export const useCompleteLessonMutation = (lessonId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CompleteLessonPayload) =>
            unwrapApiData(lessonsApi.complete(lessonId, payload)),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.list });
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.detail(lessonId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.srs.due() });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.todayPlan });
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
