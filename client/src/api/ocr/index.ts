import beApi from '../callApi';
import { apiRequest } from '../shared';
import type { OcrHistoryResponse, OcrScanPayload, OcrScanResponse } from './types';

export const ocrApi = {
    scan: (payload: OcrScanPayload) => apiRequest<OcrScanResponse>(beApi.post('ocr/scan', payload)),
    history: (params?: { limit?: number }) => apiRequest<OcrHistoryResponse>(beApi.get('ocr/history', { params })),
};

export * from './types';
