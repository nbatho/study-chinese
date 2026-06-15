import { useMutation } from '@tanstack/react-query';
import { unwrapApiData } from '../shared';
import { ocrApi } from './index';
import type { OcrScanPayload } from './types';

export const useOcrScanMutation = () =>
    useMutation({
        mutationFn: (payload: OcrScanPayload) => unwrapApiData(ocrApi.scan(payload)),
    });
