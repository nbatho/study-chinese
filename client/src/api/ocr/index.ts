import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    ClearOcrHistoryResponse,
    DeleteOcrHistoryResponse,
    OcrHistoryDetailResponse,
    OcrHistoryResponse,
    OcrScanPayload,
    OcrScanResponse,
    TranslateTargetLang,
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
    translate: (payload: { text: string; targetLang?: TranslateTargetLang }) =>
        apiRequest<OcrScanResponse>(beApi.post('ocr/translate', payload)),
    history: (params?: OcrHistoryParams) => apiRequest<OcrHistoryResponse>(beApi.get('ocr/history', { params })),
    detail: (eventId: string) => apiRequest<OcrHistoryDetailResponse>(beApi.get(`ocr/history/${eventId}`)),
    update: (eventId: string, payload: UpdateOcrHistoryPayload) =>
        apiRequest<UpdateOcrHistoryResponse>(beApi.patch(`ocr/history/${eventId}`, payload)),
    delete: (eventId: string) => apiRequest<DeleteOcrHistoryResponse>(beApi.delete(`ocr/history/${eventId}`)),
    clearHistory: () => apiRequest<ClearOcrHistoryResponse>(beApi.delete('ocr/history')),
};

export * from './types';
