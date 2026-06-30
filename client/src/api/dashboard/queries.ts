import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { dashboardApi } from './index';

export const useDailyContentQuery = (enabled = true) =>
    useQuery({
        queryKey: queryKeys.dashboard.dailyContent,
        queryFn: () => unwrapApiData(dashboardApi.dailyContent()),
        enabled,
        staleTime: 1000 * 60 * 60,
    });
