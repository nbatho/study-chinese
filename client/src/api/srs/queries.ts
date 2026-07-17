import { useMutation, useQuery, useQueryClient, type QueryClient } from '@tanstack/react-query';
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

export const useSrsCardsQuery = (enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: queryKeys.srs.cards(locale),
        queryFn: () => unwrapApiData(srsApi.cards({ locale })),
        enabled,
    });
};

/**
 * Refresh everything a review session touches (deck, due cards, user stats,
 * today plan, achievements). Called once when a session ends — invalidating
 * per graded card refetched all of these for every single answer.
 */
export const invalidateSrsSessionQueries = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.srs.dueAll });
    queryClient.invalidateQueries({ queryKey: queryKeys.srs.cardsAll });
    queryClient.invalidateQueries({ queryKey: ['users'] });
    queryClient.invalidateQueries({ queryKey: queryKeys.users.todayPlanAll });
    queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
};

export const useReviewSrsMutation = () =>
    useMutation({
        mutationFn: (payload: ReviewCardPayload) => unwrapApiData(srsApi.review(payload)),
        onSuccess: (data) => {
            showAchievementToasts(data.unlockedAchievements);
        },
    });

export const useEnrollWordMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: EnrollWordPayload) => unwrapApiData(srsApi.enroll(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.srs.dueAll });
            queryClient.invalidateQueries({ queryKey: queryKeys.srs.cardsAll });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.todayPlanAll });
        },
    });
};
