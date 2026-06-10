import beApi from '../callApi';
import { apiRequest, emptyRequest } from '../shared';
import type { AuthResponse, LoginPayload, RegisterPayload } from './types';

export const authApi = {
    register: (payload: RegisterPayload) => apiRequest<AuthResponse>(beApi.post('auth/register', payload)),

    login: (payload: LoginPayload) => apiRequest<AuthResponse>(beApi.post('auth/login', payload)),

    logout: () => emptyRequest(beApi.post('auth/logout')),
};

export * from './types';
