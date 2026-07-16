import type { Word } from '../vocabulary';

export interface ToggleFavoritePayload {
    wordId: string;
}

export interface ToggleFavoriteResponse {
    wordId: string;
    isFavorite: boolean;
}

export interface FavoriteWord extends Word {
    favoritedAt: string;
}

export interface FavoriteWordsResponse {
    words: FavoriteWord[];
}
