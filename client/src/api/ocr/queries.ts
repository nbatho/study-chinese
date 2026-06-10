import { useMutation, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { unwrapApiData } from '../shared';
import { ocrApi } from './index';
import type { OcrScanPayload } from './types';

export const useOcrSamplesQuery = () =>
    useQuery({
        queryKey: queryKeys.ocr.samples,
        queryFn: () => unwrapApiData(ocrApi.samples()),
    });

export const useOcrScanMutation = () =>
    useMutation({
        mutationFn: (payload: OcrScanPayload) => unwrapApiData(ocrApi.scan(payload)),
    });
