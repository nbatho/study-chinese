import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { useAppSelector } from '../../store/hooks';
import { favoritesApi } from './index';
import type { ToggleFavoritePayload } from './types';

export const useFavoriteWordsQuery = (enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: queryKeys.favorites.list(locale),
        queryFn: () => unwrapApiData(favoritesApi.list(locale)),
        enabled,
    });
};

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
