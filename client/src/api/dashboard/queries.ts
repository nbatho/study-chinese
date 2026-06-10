import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { useAppDispatch } from '../../store/hooks';
import { setDailyContent } from '../../store/modules/dashboardSlice';
import { dashboardApi } from './index';

export const useDailyContentQuery = () => {
    const dispatch = useAppDispatch();
    const query = useQuery({
        queryKey: queryKeys.dashboard.dailyContent,
        queryFn: () => unwrapApiData(dashboardApi.dailyContent()),
        staleTime: 1000 * 60 * 60,
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setDailyContent(query.data));
        }
    }, [dispatch, query.data]);

    return query;
};
