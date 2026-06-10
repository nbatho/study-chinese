import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    DueCardsResponse,
    EnrollWordPayload,
    EnrollWordResponse,
    ReviewCardPayload,
    ReviewCardResponse,
} from './types';

export const srsApi = {
    due: (params?: { limit?: number }) => apiRequest<DueCardsResponse>(beApi.get('srs/due', { params })),

    review: (payload: ReviewCardPayload) => apiRequest<ReviewCardResponse>(beApi.post('srs/review', payload)),

    enroll: (payload: EnrollWordPayload) => apiRequest<EnrollWordResponse>(beApi.post('srs/enroll', payload)),
};

export * from './types';
