import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { useAppDispatch } from '../../store/hooks';
import { setDueCards, setReviewedCard } from '../../store/modules/srsSlice';
import { srsApi } from './index';
import type { EnrollWordPayload, ReviewCardPayload } from './types';

export const useDueSrsCardsQuery = (limit = 20) => {
    const dispatch = useAppDispatch();
    const query = useQuery({
        queryKey: queryKeys.srs.due(limit),
        queryFn: () => unwrapApiData(srsApi.due({ limit })),
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setDueCards(query.data.cards));
        }
    }, [dispatch, query.data]);

    return query;
};

export const useReviewSrsMutation = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ReviewCardPayload) => unwrapApiData(srsApi.review(payload)),
        onSuccess: (data) => {
            dispatch(setReviewedCard(data.card));
            queryClient.invalidateQueries({ queryKey: ['srs', 'due'] });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};

export const useEnrollWordMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: EnrollWordPayload) => unwrapApiData(srsApi.enroll(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['srs', 'due'] });
        },
    });
};
