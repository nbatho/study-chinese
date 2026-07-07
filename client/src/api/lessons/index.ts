import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    CompleteLessonPayload,
    CompleteLessonResponse,
    LessonDetailResponse,
    LessonGrammarIndexResponse,
    LessonsResponse,
    ReportLessonIssuePayload,
    ReportLessonIssueResponse,
} from './types';

export const lessonsApi = {
    list: (locale = 'en') => apiRequest<LessonsResponse>(beApi.get('lessons', { params: { locale } })),

    grammarIndex: (locale = 'en') =>
        apiRequest<LessonGrammarIndexResponse>(beApi.get('lessons/grammar', { params: { locale } })),

    detail: (lessonId: string, locale = 'en') =>
        apiRequest<LessonDetailResponse>(beApi.get(`lessons/${lessonId}`, { params: { locale } })),

    complete: (lessonId: string, payload: CompleteLessonPayload) =>
        apiRequest<CompleteLessonResponse>(beApi.post(`lessons/${lessonId}/complete`, payload)),

    reportIssue: (lessonId: string, payload: ReportLessonIssuePayload) =>
        apiRequest<ReportLessonIssueResponse>(beApi.post(`lessons/${lessonId}/reports`, payload)),
};

export * from './types';
