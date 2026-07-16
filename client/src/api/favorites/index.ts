import beApi from '../callApi';
import { apiRequest } from '../shared';
import type { FavoriteWordsResponse, ToggleFavoritePayload, ToggleFavoriteResponse } from './types';

export const favoritesApi = {
    list: (locale?: string) =>
        apiRequest<FavoriteWordsResponse>(beApi.get('favorites', { params: { locale } })),

    toggle: (payload: ToggleFavoritePayload) =>
        apiRequest<ToggleFavoriteResponse>(beApi.post('favorites/toggle', payload)),
};

export * from './types';
