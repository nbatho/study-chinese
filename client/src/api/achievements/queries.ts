import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { useAppDispatch } from '../../store/hooks';
import {
    setAchievements,
    setUnlockedAchievement,
} from '../../store/modules/achievementSlice';
import { achievementsApi } from './index';

export const useAchievementsQuery = () => {
    const dispatch = useAppDispatch();
    const query = useQuery({
        queryKey: queryKeys.achievements.all,
        queryFn: () => unwrapApiData(achievementsApi.list()),
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setAchievements(query.data.achievements));
        }
    }, [dispatch, query.data]);

    return query;
};

export const useUnlockAchievementMutation = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (achievementId: string) => unwrapApiData(achievementsApi.unlock(achievementId)),
        onSuccess: (data) => {
            dispatch(setUnlockedAchievement(data));
            queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
        },
    });
};
