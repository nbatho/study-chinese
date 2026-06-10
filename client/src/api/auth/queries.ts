import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { useAppDispatch } from '../../store/hooks';
import { clearCredentials, setCredentials } from '../../store/modules/authSlice';
import { authApi } from './index';
import type { LoginPayload, RegisterPayload } from './types';

export const useRefreshAuthQuery = (enabled = true) => {
    const dispatch = useAppDispatch();
    const query = useQuery({
        queryKey: queryKeys.auth.refresh,
        queryFn: () => unwrapApiData(authApi.refresh()),
        enabled,
        retry: false,
    });

    useEffect(() => {
        if (enabled && query.data) {
            dispatch(setCredentials(query.data));
        }
    }, [dispatch, enabled, query.data]);

    useEffect(() => {
        if (enabled && query.isError) {
            dispatch(clearCredentials());
        }
    }, [dispatch, enabled, query.isError]);

    return query;
};

export const useLoginMutation = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: LoginPayload) => unwrapApiData(authApi.login(payload)),
        onSuccess: (data) => {
            queryClient.removeQueries({ queryKey: queryKeys.auth.refresh });
            dispatch(setCredentials(data));
        },
    });
};

export const useRegisterMutation = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: RegisterPayload) => unwrapApiData(authApi.register(payload)),
        onSuccess: (data) => {
            queryClient.removeQueries({ queryKey: queryKeys.auth.refresh });
            dispatch(setCredentials(data));
        },
    });
};

export const useLogoutMutation = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => authApi.logout(),
        onSuccess: () => {
            dispatch(clearCredentials());
            queryClient.clear();
        },
    });
};
