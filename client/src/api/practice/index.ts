import beApi from '../callApi';
import { apiRequest } from '../shared';
import type {
    HanziStrokesResponse,
    MinimalPairsResponse,
    PracticeCatalogResponse,
    ShadowingPromptsResponse,
    ShadowingScorePayload,
    ShadowingScoreResponse,
} from './types';

export const practiceApi = {
    catalog: () => apiRequest<PracticeCatalogResponse>(beApi.get('practice')),

    minimalPairs: () => apiRequest<MinimalPairsResponse>(beApi.get('practice/minimal-pairs')),

    shadowingPrompts: () =>
        apiRequest<ShadowingPromptsResponse>(beApi.get('practice/shadowing-prompts')),

    scoreShadowing: (payload: ShadowingScorePayload) =>
        apiRequest<ShadowingScoreResponse>(beApi.post('practice/shadowing/score', payload)),

    hanziStrokes: () => apiRequest<HanziStrokesResponse>(beApi.get('practice/hanzi-strokes')),
};

export * from './types';
