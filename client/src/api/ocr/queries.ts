import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import type { OcrHistoryParams } from './index';
import { ocrApi } from './index';
import type { OcrScanPayload, UpdateOcrHistoryPayload } from './types';

export const useOcrScanMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: OcrScanPayload) => unwrapApiData(ocrApi.scan(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ocr', 'history'] });
        },
    });
};

export const useOcrHistoryQuery = (options: number | OcrHistoryParams = 20) => {
    const params = typeof options === 'number' ? { limit: options } : options;

    return useQuery({
        queryKey: queryKeys.ocr.history(params),
        queryFn: () => unwrapApiData(ocrApi.history(params)),
    });
};

export const useUpdateOcrHistoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ eventId, payload }: { eventId: string; payload: UpdateOcrHistoryPayload }) =>
            unwrapApiData(ocrApi.update(eventId, payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ocr', 'history'] });
        },
    });
};

export const useDeleteOcrHistoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (eventId: string) => unwrapApiData(ocrApi.delete(eventId)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ocr', 'history'] });
        },
    });
};

export const useClearOcrHistoryMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => unwrapApiData(ocrApi.clearHistory()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ocr', 'history'] });
        },
    });
};
