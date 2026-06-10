import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DailyContentResponse } from '../../api/dashboard';

interface DashboardState {
    dailyContent: DailyContentResponse | null;
}

const initialState: DashboardState = {
    dailyContent: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setDailyContent: (state, action: PayloadAction<DailyContentResponse>) => {
            state.dailyContent = action.payload;
        },
    },
});

export const { setDailyContent } = dashboardSlice.actions;

export default dashboardSlice.reducer;
