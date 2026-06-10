import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { useAppDispatch } from '../../store/hooks';
import { addList, removeList, setLists, setListWords } from '../../store/modules/listSlice';
import { listsApi } from './index';
import type { CreateListPayload } from './types';

export const useListsQuery = () => {
    const dispatch = useAppDispatch();
    const query = useQuery({
        queryKey: queryKeys.lists.all,
        queryFn: () => unwrapApiData(listsApi.list()),
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setLists(query.data.lists));
        }
    }, [dispatch, query.data]);

    return query;
};

export const useCreateListMutation = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateListPayload) => unwrapApiData(listsApi.create(payload)),
        onSuccess: (data) => {
            dispatch(addList(data.list));
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
        },
    });
};

export const useDeleteListMutation = () => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (listId: string) => listsApi.remove(listId).then(() => listId),
        onSuccess: (listId) => {
            dispatch(removeList(listId));
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
        },
    });
};

export const useAddWordToListMutation = (listId: string) => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (wordId: string) => unwrapApiData(listsApi.addWord(listId, { wordId })),
        onSuccess: (data) => {
            dispatch(setListWords(data));
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
        },
    });
};

export const useRemoveWordFromListMutation = (listId: string) => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (wordId: string) => unwrapApiData(listsApi.removeWord(listId, wordId)),
        onSuccess: (data) => {
            dispatch(setListWords(data));
            queryClient.invalidateQueries({ queryKey: queryKeys.lists.all });
        },
    });
};
