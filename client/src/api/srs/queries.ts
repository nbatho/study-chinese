import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { srsApi } from './index';
import type { EnrollWordPayload, ReviewCardPayload } from './types';
import { showAchievementToasts } from '../../utils/achievementToast';

export const useDueSrsCardsQuery = (limit = 20) =>
    useQuery({
        queryKey: queryKeys.srs.due(limit),
        queryFn: () => unwrapApiData(srsApi.due({ limit })),
    });

export const useReviewSrsMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ReviewCardPayload) => unwrapApiData(srsApi.review(payload)),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['srs', 'due'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
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
            queryClient.invalidateQueries({ queryKey: ['srs', 'due'] });
        },
    });
};
