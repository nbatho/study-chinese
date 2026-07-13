export interface AuthUser {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    role?: 'student' | 'admin';
}

export interface AuthResponse {
    accessToken: string;
    user: AuthUser;
}

export interface RegisterPayload {
    email: string;
    password: string;
    name?: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ChangePasswordPayload {
    currentPassword: string;
    newPassword: string;
}

export interface ResetPasswordPayload {
    token: string;
    password: string;
}

export interface VerifyEmailResponse {
    verified: boolean;
}

export interface ResendVerificationResponse {
    sent?: boolean;
    alreadyVerified?: boolean;
}

export interface ForgotPasswordResponse {
    sent: boolean;
}
