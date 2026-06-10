import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { favoritesApi } from './index';
import type { ToggleFavoritePayload } from './types';

export const useToggleFavoriteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ToggleFavoritePayload) => unwrapApiData(favoritesApi.toggle(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.favorites.all });
            queryClient.invalidateQueries({ queryKey: ['vocabulary'] });
        },
    });
};
