import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    AllCardsResponse,
    DueCardsResponse,
    EnrollWordPayload,
    EnrollWordResponse,
    ReviewCardPayload,
    ReviewCardResponse,
    UnenrollWordResponse,
} from './types';

export const srsApi = {
    due: (params?: { limit?: number; locale?: string }) => apiRequest<DueCardsResponse>(beApi.get('srs/due', { params })),

    cards: (params?: { locale?: string }) => apiRequest<AllCardsResponse>(beApi.get('srs/cards', { params })),

    review: (payload: ReviewCardPayload) => apiRequest<ReviewCardResponse>(beApi.post('srs/review', payload)),

    enroll: (payload: EnrollWordPayload) => apiRequest<EnrollWordResponse>(beApi.post('srs/enroll', payload)),

    unenroll: (wordId: string) => apiRequest<UnenrollWordResponse>(beApi.delete(`srs/cards/${wordId}`)),
};

export * from './types';
