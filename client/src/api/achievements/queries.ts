import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { achievementsApi } from './index';
import { showAchievementToasts } from '../../utils/achievementToast';

export const useAchievementsQuery = (enabled = true) =>
    useQuery({
        queryKey: queryKeys.achievements.all,
        queryFn: () => unwrapApiData(achievementsApi.list()),
        enabled,
    });

export const useUnlockAchievementMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (achievementId: string) => unwrapApiData(achievementsApi.unlock(achievementId)),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
            if (data.unlocked) {
                showAchievementToasts([data.achievement]);
            }
        },
    });
};
