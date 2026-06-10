import beApi from '../callApi';
import { apiRequest } from '../shared';
import type { OcrSamplesResponse, OcrScanPayload, OcrScanResponse } from './types';

export const ocrApi = {
    samples: () => apiRequest<OcrSamplesResponse>(beApi.get('ocr/samples')),

    scan: (payload: OcrScanPayload) => apiRequest<OcrScanResponse>(beApi.post('ocr/scan', payload)),
};

export * from './types';
