import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    OcrHistoryDetailResponse,
    OcrHistoryResponse,
    OcrScanPayload,
    OcrScanResponse,
    UpdateOcrHistoryPayload,
    UpdateOcrHistoryResponse,
} from './types';

export interface OcrHistoryParams {
    limit?: number;
    keyword?: string;
    date?: string;
    from?: string;
    to?: string;
    favorite?: boolean;
}

export const ocrApi = {
    scan: (payload: OcrScanPayload) => apiRequest<OcrScanResponse>(beApi.post('ocr/scan', payload)),
    history: (params?: OcrHistoryParams) => apiRequest<OcrHistoryResponse>(beApi.get('ocr/history', { params })),
    detail: (eventId: string) => apiRequest<OcrHistoryDetailResponse>(beApi.get(`ocr/history/${eventId}`)),
    update: (eventId: string, payload: UpdateOcrHistoryPayload) =>
        apiRequest<UpdateOcrHistoryResponse>(beApi.patch(`ocr/history/${eventId}`, payload)),
};

export * from './types';
