import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    PlacementQuestionsResponse,
    PlacementSubmitPayload,
    PlacementSubmitResponse,
} from './types';

export const placementApi = {
    getQuestions: () => apiRequest<PlacementQuestionsResponse>(beApi.get('placement/questions')),

    submitResult: (payload: PlacementSubmitPayload) =>
        apiRequest<PlacementSubmitResponse>(beApi.post('placement/submit', payload)),
};

export * from './types';
