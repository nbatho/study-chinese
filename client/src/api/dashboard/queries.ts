import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { dashboardApi } from './index';

export const useDailyContentQuery = () =>
    useQuery({
        queryKey: queryKeys.dashboard.dailyContent,
        queryFn: () => unwrapApiData(dashboardApi.dailyContent()),
        staleTime: 1000 * 60 * 60,
    });
