import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { achievementsApi } from './index';

export const useAchievementsQuery = () =>
    useQuery({
        queryKey: queryKeys.achievements.all,
        queryFn: () => unwrapApiData(achievementsApi.list()),
    });

export const useUnlockAchievementMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (achievementId: string) => unwrapApiData(achievementsApi.unlock(achievementId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
        },
    });
};
