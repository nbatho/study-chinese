import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { useAppDispatch } from '../../store/hooks';
import {
    setActiveLesson,
    setLessonCompletion,
    setLessons,
} from '../../store/modules/lessonSlice';
import { lessonsApi } from './index';
import type { CompleteLessonPayload } from './types';

export const useLessonsQuery = () => {
    const dispatch = useAppDispatch();
    const query = useQuery({
        queryKey: queryKeys.lessons.list,
        queryFn: () => unwrapApiData(lessonsApi.list()),
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setLessons(query.data.lessons));
        }
    }, [dispatch, query.data]);

    return query;
};

export const useLessonDetailQuery = (lessonId: string, enabled = true) => {
    const dispatch = useAppDispatch();
    const query = useQuery({
        queryKey: queryKeys.lessons.detail(lessonId),
        queryFn: () => unwrapApiData(lessonsApi.detail(lessonId)),
        enabled: enabled && Boolean(lessonId),
    });

    useEffect(() => {
        if (query.data) {
            dispatch(setActiveLesson(query.data.lesson));
        }
    }, [dispatch, query.data]);

    return query;
};

export const useCompleteLessonMutation = (lessonId: string) => {
    const dispatch = useAppDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CompleteLessonPayload) =>
            unwrapApiData(lessonsApi.complete(lessonId, payload)),
        onSuccess: (data) => {
            dispatch(setLessonCompletion(data));
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.list });
            queryClient.invalidateQueries({ queryKey: queryKeys.lessons.detail(lessonId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.srs.due() });
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
};
