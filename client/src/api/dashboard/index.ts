import beApi from '../callApi';
import { apiRequest } from '../shared';
import type { DailyContentResponse } from './types';

export const dashboardApi = {
    dailyContent: () => apiRequest<DailyContentResponse>(beApi.get('dashboard/daily-content')),
};

export * from './types';
