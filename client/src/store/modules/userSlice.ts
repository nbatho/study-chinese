import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
    AddActivityResponse,
    DailyStat,
    UserProfile,
    UserProfileResponse,
    UserStreak,
    UserStatsResponse,
} from '../../api/users';

interface UserState {
    profile: UserProfile | null;
    streak: UserStreak | null;
    stats: DailyStat[];
}

const initialState: UserState = {
    profile: null,
    streak: null,
    stats: [],
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserProfile: (state, action: PayloadAction<UserProfileResponse>) => {
            state.profile = action.payload.profile;
            state.streak = action.payload.streak;
        },
        setUserStats: (state, action: PayloadAction<UserStatsResponse>) => {
            state.stats = action.payload.stats;
        },
        setActivityResult: (state, action: PayloadAction<AddActivityResponse>) => {
            state.streak = action.payload.streak;
            const index = state.stats.findIndex(
                (stat) => stat.dateKey === action.payload.todayStats.dateKey,
            );

            if (index >= 0) {
                state.stats[index] = action.payload.todayStats;
            } else {
                state.stats.push(action.payload.todayStats);
            }
        },
    },
});

export const { setActivityResult, setUserProfile, setUserStats } = userSlice.actions;

export default userSlice.reducer;
