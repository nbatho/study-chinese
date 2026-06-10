import beApi from '../callApi';
import { apiRequest } from '../shared';
import type { ToggleFavoritePayload, ToggleFavoriteResponse } from './types';

export const favoritesApi = {
    toggle: (payload: ToggleFavoritePayload) =>
        apiRequest<ToggleFavoriteResponse>(beApi.post('favorites/toggle', payload)),
};

export * from './types';
