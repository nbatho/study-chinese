import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '../../store/hooks';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { dashboardApi } from './index';

export const useDailyContentQuery = (enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: queryKeys.dashboard.dailyContent(locale),
        queryFn: () => unwrapApiData(dashboardApi.dailyContent(locale)),
        enabled,
        staleTime: 1000 * 60 * 60,
    });
};
