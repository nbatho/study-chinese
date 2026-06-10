export interface OcrBox {
    id: string;
    wordId: string;
    text: string;
    pinyin: string;
    english: string;
    top: number;
    left: number;
    width: number;
    height: number;
}

export interface OcrScanPayload {
    image?: string;
    text?: string;
    detectedText?: string;
    sampleId?: string;
}

export interface OcrScanResponse {
    boxes: OcrBox[];
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
