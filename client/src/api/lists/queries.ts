import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { useAppSelector } from '../../store/hooks';
import { listsApi } from './index';
import type { AddWordToListPayload, CreateListPayload } from './types';

export const useListsQuery = () =>
    useQuery({
        queryKey: queryKeys.lists.all,
        queryFn: () => unwrapApiData(listsApi.list()),
    });

export const useListDetailQuery = (listId: string, enabled = true) => {
    const locale = useAppSelector((state) => state.app.language);

    return useQuery({
        queryKey: [...queryKeys.lists.detail(listId), locale],
        queryFn: () => unwrapApiData(listsApi.detail(listId, locale)),
        enabled: enabled && Boolean(listId),
    });
};

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

/** Add a word to any list, chosen per call — used by the list-picker popup. */
export const useAddWordToAnyListMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ listId, ...payload }: AddWordToListPayload & { listId: string }) =>
            unwrapApiData(listsApi.addWord(listId, payload)),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.detail(data.listId) });
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
