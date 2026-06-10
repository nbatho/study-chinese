import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    CompleteLessonPayload,
    CompleteLessonResponse,
    LessonDetailResponse,
    LessonsResponse,
} from './types';

export const lessonsApi = {
    list: () => apiRequest<LessonsResponse>(beApi.get('lessons')),

    detail: (lessonId: string) => apiRequest<LessonDetailResponse>(beApi.get(`lessons/${lessonId}`)),

    complete: (lessonId: string, payload: CompleteLessonPayload) =>
        apiRequest<CompleteLessonResponse>(beApi.post(`lessons/${lessonId}/complete`, payload)),
};

export * from './types';
