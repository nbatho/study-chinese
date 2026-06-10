import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CustomList, ListWordsResponse } from '../../api/lists';

interface ListState {
    lists: CustomList[];
}

const initialState: ListState = {
    lists: [],
};

const listSlice = createSlice({
    name: 'lists',
    initialState,
    reducers: {
        setLists: (state, action: PayloadAction<CustomList[]>) => {
            state.lists = action.payload;
        },
        addList: (state, action: PayloadAction<CustomList>) => {
            state.lists.push(action.payload);
        },
        removeList: (state, action: PayloadAction<string>) => {
            state.lists = state.lists.filter((list) => list.id !== action.payload);
        },
        setListWords: (state, action: PayloadAction<ListWordsResponse>) => {
            const list = state.lists.find((item) => item.id === action.payload.listId);

            if (list) {
                list.wordIds = action.payload.wordIds;
            }
        },
    },
});

export const { addList, removeList, setLists, setListWords } = listSlice.actions;

export default listSlice.reducer;
