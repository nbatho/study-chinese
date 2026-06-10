import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    ChatScenariosResponse,
    SendMessagePayload,
    SendMessageResponse,
    StartSessionPayload,
    StartSessionResponse,
} from './types';

export const aiTutorApi = {
    scenarios: () => apiRequest<ChatScenariosResponse>(beApi.get('ai-tutor/scenarios')),

    startSession: (payload: StartSessionPayload) =>
        apiRequest<StartSessionResponse>(beApi.post('ai-tutor/sessions', payload)),

    sendMessage: (sessionId: string, payload: SendMessagePayload) =>
        apiRequest<SendMessageResponse>(beApi.post(`ai-tutor/sessions/${sessionId}/messages`, payload)),
};

export * from './types';
