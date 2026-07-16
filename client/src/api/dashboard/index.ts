import beApi from '../callApi';
import { apiRequest } from '../shared';
import type { DailyContentResponse } from './types';

export const dashboardApi = {
    dailyContent: (locale = 'en') =>
        apiRequest<DailyContentResponse>(beApi.get('dashboard/daily-content', { params: { locale } })),
};

export * from './types';
