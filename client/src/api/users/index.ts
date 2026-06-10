import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    AddActivityPayload,
    AddActivityResponse,
    UserProfile,
    UserProfileResponse,
    UserStatsResponse,
} from './types';

export const usersApi = {
    getProfile: () => apiRequest<UserProfileResponse>(beApi.get('users/profile')),

    updateProfile: (payload: Partial<UserProfile>) =>
        apiRequest<UserProfileResponse>(beApi.put('users/profile', payload)),

    getStats: (params?: { days?: number }) => apiRequest<UserStatsResponse>(beApi.get('users/stats', { params })),

    addActivity: (payload: AddActivityPayload) =>
        apiRequest<AddActivityResponse>(beApi.post('users/activity', payload)),
};

export * from './types';
