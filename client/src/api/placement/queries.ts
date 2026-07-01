import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { placementApi } from './index';
import type { PlacementSubmitPayload } from './types';

export const usePlacementQuestionsQuery = (enabled = true) =>
    useQuery({
        queryKey: queryKeys.placement.questions,
        queryFn: () => unwrapApiData(placementApi.getQuestions()),
        enabled,
    });

export const useSubmitPlacementMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: PlacementSubmitPayload) => unwrapApiData(placementApi.submitResult(payload)),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.users.profile, data);
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.list });
            queryClient.invalidateQueries({ queryKey: queryKeys.users.todayPlan });
        },
    });
};
