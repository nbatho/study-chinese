import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    AdminAiLogsResponse,
    AdminLesson,
    AdminLessonPayload,
    AdminLessonsResponse,
    AdminListParams,
    AdminReport,
    AdminReportsResponse,
    AdminSummaryResponse,
    AdminUser,
    AdminUsersResponse,
    AdminWord,
    AdminWordPayload,
    AdminWordsResponse,
} from './types';

export const adminApi = {
    summary: () => apiRequest<AdminSummaryResponse>(beApi.get('admin/summary')),

    lessons: (params?: AdminListParams) =>
        apiRequest<AdminLessonsResponse>(beApi.get('admin/lessons', { params })),

    createLesson: (payload: AdminLessonPayload) =>
        apiRequest<{ lesson: AdminLesson }>(beApi.post('admin/lessons', payload)),

    updateLesson: (lessonId: string, payload: AdminLessonPayload) =>
        apiRequest<{ lesson: AdminLesson }>(beApi.patch(`admin/lessons/${lessonId}`, payload)),

    deleteLesson: (lessonId: string) =>
        apiRequest<{ lesson: AdminLesson }>(beApi.delete(`admin/lessons/${lessonId}`)),

    words: (params?: AdminListParams) =>
        apiRequest<AdminWordsResponse>(beApi.get('admin/words', { params })),

    createWord: (payload: AdminWordPayload) =>
        apiRequest<{ word: AdminWord }>(beApi.post('admin/words', payload)),

    updateWord: (wordId: string, payload: AdminWordPayload) =>
        apiRequest<{ word: AdminWord }>(beApi.patch(`admin/words/${wordId}`, payload)),

    deleteWord: (wordId: string) =>
        apiRequest<{ word: AdminWord }>(beApi.delete(`admin/words/${wordId}`)),

    users: (params?: AdminListParams) =>
        apiRequest<AdminUsersResponse>(beApi.get('admin/users', { params })),

    updateUser: (userId: string, payload: Partial<Pick<AdminUser, 'role' | 'isActive' | 'name'>>) =>
        apiRequest<{ user: AdminUser }>(beApi.patch(`admin/users/${userId}`, payload)),

    aiLogs: (params?: AdminListParams) =>
        apiRequest<AdminAiLogsResponse>(beApi.get('admin/ai-logs', { params })),

    reports: (params?: AdminListParams) =>
        apiRequest<AdminReportsResponse>(beApi.get('admin/reports', { params })),

    updateReport: (reportId: string, payload: Partial<Pick<AdminReport, 'status' | 'adminNote'>>) =>
        apiRequest<{ report: AdminReport }>(beApi.patch(`admin/reports/${reportId}`, payload)),
};

export * from './types';
