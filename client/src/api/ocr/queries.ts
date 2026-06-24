import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { ocrApi } from './index';
import type { OcrScanPayload } from './types';

export const useOcrScanMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: OcrScanPayload) => unwrapApiData(ocrApi.scan(payload)),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ocr', 'history'] });
        },
    });
};

export const useOcrHistoryQuery = (limit = 20) =>
    useQuery({
        queryKey: queryKeys.ocr.history(limit),
        queryFn: () => unwrapApiData(ocrApi.history({ limit })),
    });
