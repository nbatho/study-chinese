import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { lessonsApi } from './index';
import type { CompleteLessonPayload } from './types';

export const useLessonsQuery = () =>
    useQuery({
        queryKey: queryKeys.lessons.list,
        queryFn: () => unwrapApiData(lessonsApi.list()),
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.list });
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.detail(lessonId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.srs.due() });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
