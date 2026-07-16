import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppSelector } from '../../store/hooks';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { usersApi } from './index';
import type { AddActivityPayload, MistakePayload, UserProfile } from './types';
import { showAchievementToasts } from '../../utils/achievementToast';

export const useUserProfileQuery = (enabled = true) =>
    useQuery({
        queryKey: queryKeys.users.profile,
        queryFn: () => unwrapApiData(usersApi.getProfile()),
        enabled,
    });

export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Partial<UserProfile>) => unwrapApiData(usersApi.updateProfile(payload)),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.users.profile, data);
        },
    });
};

export const useUserStatsQuery = (days = 7, enabled = true) =>
    useQuery({
        queryKey: queryKeys.users.stats(days),
        queryFn: () => unwrapApiData(usersApi.getStats({ days })),
        enabled,
    });

export const useTodayPlanQuery = (enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: queryKeys.users.todayPlan(locale),
        queryFn: () => unwrapApiData(usersApi.getTodayPlan(locale)),
        enabled,
    });
};

export const useShopQuery = (enabled = true) =>
    useQuery({
        queryKey: queryKeys.users.shop,
        queryFn: () => unwrapApiData(usersApi.getShop()),
        enabled,
    });

export const usePurchaseShopItemMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (itemId: string) => unwrapApiData(usersApi.purchaseShopItem(itemId)),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.users.shop, {
                wallet: data.wallet,
                premium: data.premium,
                cosmetics: data.cosmetics,
                items: data.items,
            });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.profile });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.todayPlanAll });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useUserMistakesQuery = (limit = 30, enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: queryKeys.users.mistakes(limit, locale),
        queryFn: () => unwrapApiData(usersApi.getMistakes({ limit, locale })),
        enabled,
    });
};

export const useAddActivityMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AddActivityPayload) => unwrapApiData(usersApi.addActivity(payload)),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.profile });
            queryClient.invalidateQueries({ queryKey: ['users', 'stats'] });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.todayPlanAll });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.mistakesAll });
            queryClient.invalidateQueries({ queryKey: queryKeys.achievements.all });
            showAchievementToasts(data.unlockedAchievements);
        },
    });
};

export const usePracticeMistakeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ mistakeId, correct }: { mistakeId: string; correct: boolean }) =>
            unwrapApiData(usersApi.practiceMistake(mistakeId, { correct })),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.mistakesAll });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.todayPlanAll });
        },
    });
};

export const useRecordMistakeMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: MistakePayload) => unwrapApiData(usersApi.recordMistake(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.users.mistakesAll });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.todayPlanAll });
        },
    });
};
