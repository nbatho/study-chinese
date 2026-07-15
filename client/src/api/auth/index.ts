import beApi from '../callApi';
import { apiRequest, emptyRequest } from '../shared';
import type {
    AuthResponse,
    ChangePasswordPayload,
    ForgotPasswordResponse,
    GoogleAuthResponse,
    GoogleLoginPayload,
    LoginPayload,
    OtpSentResponse,
    RegisterPayload,
    RegisterPendingResponse,
    ResendVerificationResponse,
    ResetPasswordPayload,
    VerifyEmailResponse,
    VerifyRegistrationPayload,
} from './types';

export const authApi = {
    register: (payload: RegisterPayload) => apiRequest<RegisterPendingResponse>(beApi.post('auth/register', payload)),

    verifyRegistration: (payload: VerifyRegistrationPayload) => apiRequest<AuthResponse>(beApi.post('auth/register/verify', payload)),

    resendRegistrationOtp: (email: string) => apiRequest<OtpSentResponse>(beApi.post('auth/register/resend', { email })),

    login: (payload: LoginPayload) => apiRequest<AuthResponse>(beApi.post('auth/login', payload)),

    googleLogin: (payload: GoogleLoginPayload) => apiRequest<GoogleAuthResponse>(beApi.post('auth/google', payload)),

    refresh: () => apiRequest<AuthResponse>(beApi.post('auth/refresh')),

    logout: () => emptyRequest(beApi.post('auth/logout')),

    verifyEmail: (token: string) => apiRequest<VerifyEmailResponse>(beApi.post('auth/verify-email', { token })),

    resendVerification: () => apiRequest<ResendVerificationResponse>(beApi.post('auth/resend-verification')),

    forgotPassword: (email: string) => apiRequest<ForgotPasswordResponse>(beApi.post('auth/forgot-password', { email })),

    resetPassword: (payload: ResetPasswordPayload) => emptyRequest(beApi.post('auth/reset-password', payload)),

    changePasswordOtp: () => apiRequest<OtpSentResponse>(beApi.post('auth/change-password/otp')),

    changePassword: (payload: ChangePasswordPayload) => apiRequest<AuthResponse>(beApi.post('auth/change-password', payload)),

    deleteAccountOtp: () => apiRequest<OtpSentResponse>(beApi.post('auth/account/otp')),

    deleteAccount: (otp: string) => emptyRequest(beApi.delete('auth/account', { data: { otp } })),
};

export * from './types';
