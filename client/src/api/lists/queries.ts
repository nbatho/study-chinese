import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { listsApi } from './index';
import type { AddWordToListPayload, CreateListPayload } from './types';

export const useListsQuery = () =>
    useQuery({
        queryKey: queryKeys.lists.all,
        queryFn: () => unwrapApiData(listsApi.list()),
    });

export const useListDetailQuery = (listId: string, enabled = true) =>
    useQuery({
        queryKey: queryKeys.lists.detail(listId),
        queryFn: () => unwrapApiData(listsApi.detail(listId)),
        enabled: enabled && Boolean(listId),
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
        onSuccess: (listId) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.detail(listId) });
        },
    });
};

export const useAddWordToListMutation = (listId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: string | AddWordToListPayload) =>
            unwrapApiData(listsApi.addWord(listId, typeof payload === 'string' ? { wordId: payload } : payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.detail(listId) });
        },
    });
};

export const useRemoveWordFromListMutation = (listId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (wordId: string) => unwrapApiData(listsApi.removeWord(listId, wordId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.detail(listId) });
        },
    });
};
