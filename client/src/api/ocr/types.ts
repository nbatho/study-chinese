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
    sampleId?: string;
}

export interface OcrScanResponse {
    boxes: OcrBox[];
    regions?: OcrRegion[];
    segments?: OcrSegment[];
    detectedText?: string;
    provider?: string;
}

export interface OcrSample {
    id: string;
    label: string;
    marker: string;
    image: string;
}

export interface OcrSamplesResponse {
    samples: OcrSample[];
}
