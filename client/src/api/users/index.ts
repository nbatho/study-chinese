import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    AddActivityPayload,
    AddActivityResponse,
    MistakesResponse,
    PracticeMistakePayload,
    PracticeMistakeResponse,
    RecordMistakeResponse,
    TodayPlanResponse,
    UserProfile,
    UserProfileResponse,
    UserStatsResponse,
    MistakePayload,
} from './types';

export const usersApi = {
    getProfile: () => apiRequest<UserProfileResponse>(beApi.get('users/profile')),

    updateProfile: (payload: Partial<UserProfile>) =>
        apiRequest<UserProfileResponse>(beApi.put('users/profile', payload)),

    getStats: (params?: { days?: number }) => apiRequest<UserStatsResponse>(beApi.get('users/stats', { params })),

    getTodayPlan: () => apiRequest<TodayPlanResponse>(beApi.get('users/today-plan')),

    getMistakes: (params?: { limit?: number }) =>
        apiRequest<MistakesResponse>(beApi.get('users/mistakes', { params })),

    recordMistake: (payload: MistakePayload) =>
        apiRequest<RecordMistakeResponse>(beApi.post('users/mistakes', payload)),

    practiceMistake: (mistakeId: string, payload: PracticeMistakePayload) =>
        apiRequest<PracticeMistakeResponse>(beApi.post(`users/mistakes/${mistakeId}/practice`, payload)),

    addActivity: (payload: AddActivityPayload) =>
        apiRequest<AddActivityResponse>(beApi.post('users/activity', payload)),
};

export * from './types';
