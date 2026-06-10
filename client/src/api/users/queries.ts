import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { useAppDispatch } from '../../store/hooks';
import {
    setActivityResult,
    setUserProfile,
    setUserStats,
} from '../../store/modules/userSlice';
import { usersApi } from './index';
import type { AddActivityPayload, UserProfile } from './types';

export const useUserProfileQuery = () => {
    const dispatch = useAppDispatch();
    const query = useQuery({
        queryKey: queryKeys.users.profile,
        queryFn: () => unwrapApiData(usersApi.getProfile()),
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setUserProfile(query.data));
        }
    }, [dispatch, query.data]);

    return query;
};

export const useUpdateProfileMutation = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: Partial<UserProfile>) => unwrapApiData(usersApi.updateProfile(payload)),
        onSuccess: (data) => {
            dispatch(setUserProfile(data));
            queryClient.setQueryData(queryKeys.users.profile, data);
        },
    });
};

export const useUserStatsQuery = (days = 7) => {
    const dispatch = useAppDispatch();
    const query = useQuery({
        queryKey: queryKeys.users.stats(days),
        queryFn: () => unwrapApiData(usersApi.getStats({ days })),
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setUserStats(query.data));
        }
    }, [dispatch, query.data]);

    return query;
};

export const useAddActivityMutation = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: AddActivityPayload) => unwrapApiData(usersApi.addActivity(payload)),
        onSuccess: (data) => {
            dispatch(setActivityResult(data));
            queryClient.invalidateQueries({ queryKey: queryKeys.users.profile });
            queryClient.invalidateQueries({ queryKey: ['users', 'stats'] });
        },
    });
};
