import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { srsApi } from './index';
import type { EnrollWordPayload, ReviewCardPayload } from './types';
import { showAchievementToasts } from '../../utils/achievementToast';
import { useAppSelector } from '../../store/hooks';

export const useDueSrsCardsQuery = (limit = 20, enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: queryKeys.srs.due(limit, locale),
        queryFn: () => unwrapApiData(srsApi.due({ limit, locale })),
        enabled,
    });
};

export const useReviewSrsMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ReviewCardPayload) => unwrapApiData(srsApi.review(payload)),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.srs.dueAll });
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.todayPlanAll });
            queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
            showAchievementToasts(data.unlockedAchievements);
        },
    });
};

export const useEnrollWordMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: EnrollWordPayload) => unwrapApiData(srsApi.enroll(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.srs.dueAll });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.todayPlanAll });
        },
    });
};
