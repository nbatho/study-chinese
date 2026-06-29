import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { adminApi } from './index';
import type { AdminLessonPayload, AdminListParams, AdminWordPayload } from './types';

export const useAdminSummaryQuery = (enabled = true) =>
    useQuery({
        queryKey: queryKeys.admin.summary,
        queryFn: () => unwrapApiData(adminApi.summary()),
        enabled,
    });

export const useAdminLessonsQuery = (params?: AdminListParams, enabled = true) =>
    useQuery({
        queryKey: queryKeys.admin.lessons(params),
        queryFn: () => unwrapApiData(adminApi.lessons(params)),
        enabled,
    });

export const useAdminWordsQuery = (params?: AdminListParams, enabled = true) =>
    useQuery({
        queryKey: queryKeys.admin.words(params),
        queryFn: () => unwrapApiData(adminApi.words(params)),
        enabled,
    });

export const useAdminUsersQuery = (params?: AdminListParams, enabled = true) =>
    useQuery({
        queryKey: queryKeys.admin.users(params),
        queryFn: () => unwrapApiData(adminApi.users(params)),
        enabled,
    });

export const useAdminAiLogsQuery = (params?: AdminListParams, enabled = true) =>
    useQuery({
        queryKey: queryKeys.admin.aiLogs(params),
        queryFn: () => unwrapApiData(adminApi.aiLogs(params)),
        enabled,
    });

export const useAdminReportsQuery = (params?: AdminListParams, enabled = true) =>
    useQuery({
        queryKey: queryKeys.admin.reports(params),
        queryFn: () => unwrapApiData(adminApi.reports(params)),
        enabled,
    });

export const useAdminLessonMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id?: string; payload: AdminLessonPayload }) =>
            id ? unwrapApiData(adminApi.updateLesson(id, payload)) : unwrapApiData(adminApi.createLesson(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'lessons'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.list });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.summary });
        },
    });
};

export const useDeleteAdminLessonMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (lessonId: string) => unwrapApiData(adminApi.deleteLesson(lessonId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'lessons'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.list });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.summary });
        },
    });
};

export const useAdminWordMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: { id?: string; payload: AdminWordPayload }) =>
            id ? unwrapApiData(adminApi.updateWord(id, payload)) : unwrapApiData(adminApi.createWord(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.vocabulary.search() });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.summary });
        },
    });
};

export const useDeleteAdminWordMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (wordId: string) => unwrapApiData(adminApi.deleteWord(wordId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'words'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.summary });
        },
    });
};

export const useUpdateAdminUserMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, payload }: Parameters<typeof adminApi.updateUser>[0] extends never ? never : { userId: string; payload: Parameters<typeof adminApi.updateUser>[1] }) =>
            unwrapApiData(adminApi.updateUser(userId, payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.summary });
        },
    });
};

export const useUpdateAdminReportMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ reportId, payload }: { reportId: string; payload: Parameters<typeof adminApi.updateReport>[1] }) =>
            unwrapApiData(adminApi.updateReport(reportId, payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'reports'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.summary });
        },
    });
};
