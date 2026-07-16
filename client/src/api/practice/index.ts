import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    HanziStrokesResponse,
    MinimalPairsResponse,
    PracticeCatalogResponse,
    PronunciationCheckPayload,
    PronunciationCheckResponse,
    ShadowingPromptsResponse,
    ShadowingScorePayload,
    ShadowingScoreResponse,
} from './types';

export const practiceApi = {
    catalog: () => apiRequest<PracticeCatalogResponse>(beApi.get('practice')),

    minimalPairs: () => apiRequest<MinimalPairsResponse>(beApi.get('practice/minimal-pairs')),

    shadowingPrompts: (params?: { locale?: string }) =>
        apiRequest<ShadowingPromptsResponse>(beApi.get('practice/shadowing-prompts', { params })),

    scoreShadowing: (payload: ShadowingScorePayload) =>
        apiRequest<ShadowingScoreResponse>(beApi.post('practice/shadowing/score', payload)),

    pronunciationCheck: (payload: PronunciationCheckPayload) =>
        apiRequest<PronunciationCheckResponse>(beApi.post('practice/pronunciation/check', payload)),

    hanziStrokes: () => apiRequest<HanziStrokesResponse>(beApi.get('practice/hanzi-strokes')),
};

export * from './types';

