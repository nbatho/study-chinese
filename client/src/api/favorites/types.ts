export interface ToggleFavoritePayload {
    wordId: string;
}

export interface ToggleFavoriteResponse {
    wordId: string;
    isFavorite: boolean;
}
