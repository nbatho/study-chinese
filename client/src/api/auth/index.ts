import beApi from '../callApi';
import { apiRequest, emptyRequest } from '../shared';
import type {
    AuthResponse,
    ChangePasswordPayload,
    ForgotPasswordResponse,
    LoginPayload,
    OtpSentResponse,
    RegisterPayload,
    ResendVerificationResponse,
    ResetPasswordPayload,
    VerifyEmailResponse,
} from './types';

export const authApi = {
    register: (payload: RegisterPayload) => apiRequest<AuthResponse>(beApi.post('auth/register', payload)),

    login: (payload: LoginPayload) => apiRequest<AuthResponse>(beApi.post('auth/login', payload)),

    refresh: () => apiRequest<AuthResponse>(beApi.post('auth/refresh')),

    logout: () => emptyRequest(beApi.post('auth/logout')),

    verifyEmail: (token: string) => apiRequest<VerifyEmailResponse>(beApi.post('auth/verify-email', { token })),

    resendVerification: () => apiRequest<ResendVerificationResponse>(beApi.post('auth/resend-verification')),

    forgotPassword: (email: string) => apiRequest<ForgotPasswordResponse>(beApi.post('auth/forgot-password', { email })),

    resetPassword: (payload: ResetPasswordPayload) => emptyRequest(beApi.post('auth/reset-password', payload)),

    changePasswordOtp: () => apiRequest<OtpSentResponse>(beApi.post('auth/change-password/otp')),

    changePassword: (payload: ChangePasswordPayload) => apiRequest<AuthResponse>(beApi.post('auth/change-password', payload)),

    deleteAccount: (password: string) => emptyRequest(beApi.delete('auth/account', { data: { password } })),
};

export * from './types';
