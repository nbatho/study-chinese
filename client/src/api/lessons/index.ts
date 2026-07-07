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
    list: () => apiRequest<LessonsResponse>(beApi.get('lessons')),

    grammarIndex: () => apiRequest<LessonGrammarIndexResponse>(beApi.get('lessons/grammar')),

    detail: (lessonId: string) => apiRequest<LessonDetailResponse>(beApi.get(`lessons/${lessonId}`)),

    complete: (lessonId: string, payload: CompleteLessonPayload) =>
        apiRequest<CompleteLessonResponse>(beApi.post(`lessons/${lessonId}/complete`, payload)),

    reportIssue: (lessonId: string, payload: ReportLessonIssuePayload) =>
        apiRequest<ReportLessonIssueResponse>(beApi.post(`lessons/${lessonId}/reports`, payload)),
};

export * from './types';
