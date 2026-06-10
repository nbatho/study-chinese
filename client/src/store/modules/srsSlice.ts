import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SrsCard, SrsDueCard } from '../../api/srs';

interface SrsState {
    dueCards: SrsDueCard[];
    lastReviewedCard: SrsCard | null;
}

const initialState: SrsState = {
    dueCards: [],
    lastReviewedCard: null,
};

const srsSlice = createSlice({
    name: 'srs',
    initialState,
    reducers: {
        setDueCards: (state, action: PayloadAction<SrsDueCard[]>) => {
            state.dueCards = action.payload;
        },
        setReviewedCard: (state, action: PayloadAction<SrsCard>) => {
            state.lastReviewedCard = action.payload;
            state.dueCards = state.dueCards.filter((card) => card.wordId !== action.payload.wordId);
        },
    },
});

export const { setDueCards, setReviewedCard } = srsSlice.actions;

export default srsSlice.reducer;
