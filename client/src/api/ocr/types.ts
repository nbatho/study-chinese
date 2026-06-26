export interface OcrBox {
    id: string;
    wordId?: string;
    text: string;
    pinyin?: string;
    english?: string;
    top: number;
    left: number;
    width: number;
    height: number;
    confidence?: number | null;
    matched?: boolean;
    source?: string;
}

export type OcrRegion = OcrBox;

export interface OcrSegment {
    id: string;
    text: string;
    pinyin?: string;
    english?: string;
    source?: string;
    wordId?: string;
    confidence?: number | null;
    matched?: boolean;
}

export interface OcrScanPayload {
    image?: string;
    text?: string;
    detectedText?: string;
}

export interface OcrScanResponse {
    boxes: OcrBox[];
    regions?: OcrRegion[];
    segments?: OcrSegment[];
    detectedText?: string;
    provider?: string;
}

export interface OcrHistoryEvent {
    id: string;
    provider: string;
    title?: string | null;
    note?: string | null;
    isFavorite: boolean;
    detectedText: string;
    matchedWordIds: string[];
    metadata: Record<string, unknown>;
    createdAt: string;
}

export interface OcrHistoryResponse {
    events: OcrHistoryEvent[];
}

export interface OcrHistoryDetailResponse {
    event: OcrHistoryEvent;
}

export interface UpdateOcrHistoryPayload {
    title?: string | null;
    note?: string | null;
    isFavorite?: boolean;
}

export type UpdateOcrHistoryResponse = OcrHistoryDetailResponse;
