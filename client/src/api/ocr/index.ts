import beApi from '../callApi';
import { apiRequest } from '../shared';
import type { OcrScanPayload, OcrScanResponse } from './types';

export const ocrApi = {
    scan: (payload: OcrScanPayload) => apiRequest<OcrScanResponse>(beApi.post('ocr/scan', payload)),
};

export * from './types';
