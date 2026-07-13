import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { useAppDispatch } from '../../store/hooks';
import { clearCredentials, setCredentials } from '../../store/modules/authSlice';
import { authApi } from './index';
import type {
    ChangePasswordPayload,
    GoogleLoginPayload,
    LoginPayload,
    RegisterPayload,
    ResetPasswordPayload,
    VerifyRegistrationPayload,
} from './types';

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

export const useGoogleLoginMutation = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: GoogleLoginPayload) => unwrapApiData(authApi.googleLogin(payload)),
        onSuccess: (data) => {
            queryClient.removeQueries({ queryKey: queryKeys.auth.refresh });
            dispatch(setCredentials(data));
        },
    });
};

// Registration no longer creates an account or signs the user in — it only sends the
// verification OTP. The account is created by useVerifyRegistrationMutation.
export const useRegisterMutation = () =>
    useMutation({
        mutationFn: (payload: RegisterPayload) => unwrapApiData(authApi.register(payload)),
    });

export const useVerifyRegistrationMutation = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: VerifyRegistrationPayload) => unwrapApiData(authApi.verifyRegistration(payload)),
        onSuccess: (data) => {
            queryClient.removeQueries({ queryKey: queryKeys.auth.refresh });
            dispatch(setCredentials(data));
        },
    });
};

export const useResendRegistrationOtpMutation = () =>
    useMutation({
        mutationFn: (email: string) => unwrapApiData(authApi.resendRegistrationOtp(email)),
    });

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

export const useVerifyEmailMutation = () =>
    useMutation({
        mutationFn: (token: string) => unwrapApiData(authApi.verifyEmail(token)),
    });

export const useResendVerificationMutation = () =>
    useMutation({
        mutationFn: () => unwrapApiData(authApi.resendVerification()),
    });

export const useForgotPasswordMutation = () =>
    useMutation({
        mutationFn: (email: string) => unwrapApiData(authApi.forgotPassword(email)),
    });

export const useResetPasswordMutation = () =>
    useMutation({
        mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload),
    });

export const useChangePasswordOtpMutation = () =>
    useMutation({
        mutationFn: () => unwrapApiData(authApi.changePasswordOtp()),
    });

export const useChangePasswordMutation = () => {
    const dispatch = useAppDispatch();

    return useMutation({
        mutationFn: (payload: ChangePasswordPayload) => unwrapApiData(authApi.changePassword(payload)),
        // The server rotates every session; keep this one signed in with the new pair.
        onSuccess: (data) => {
            dispatch(setCredentials(data));
        },
    });
};

export const useDeleteAccountOtpMutation = () =>
    useMutation({
        mutationFn: () => unwrapApiData(authApi.deleteAccountOtp()),
    });

export const useDeleteAccountMutation = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (otp: string) => authApi.deleteAccount(otp),
        onSuccess: () => {
            dispatch(clearCredentials());
            queryClient.clear();
        },
    });
};
