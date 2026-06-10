import beApi from '../callApi';
import { apiRequest } from '../shared';
import type { AchievementsResponse, UnlockAchievementResponse } from './types';

export const achievementsApi = {
    list: () => apiRequest<AchievementsResponse>(beApi.get('achievements')),

    unlock: (achievementId: string) =>
        apiRequest<UnlockAchievementResponse>(beApi.post(`achievements/${achievementId}/unlock`)),
};

export * from './types';
