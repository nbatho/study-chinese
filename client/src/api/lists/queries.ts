import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { listsApi } from './index';
import type { CreateListPayload } from './types';

export const useListsQuery = () =>
    useQuery({
        queryKey: queryKeys.lists.all,
        queryFn: () => unwrapApiData(listsApi.list()),
    });

export const useCreateListMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateListPayload) => unwrapApiData(listsApi.create(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
        },
    });
};

export const useDeleteListMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (listId: string) => listsApi.remove(listId).then(() => listId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
        },
    });
};

export const useAddWordToListMutation = (listId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (wordId: string) => unwrapApiData(listsApi.addWord(listId, { wordId })),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
        },
    });
};

export const useRemoveWordFromListMutation = (listId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (wordId: string) => unwrapApiData(listsApi.removeWord(listId, wordId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
        },
    });
};
