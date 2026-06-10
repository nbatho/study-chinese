import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Achievement, UnlockAchievementResponse } from '../../api/achievements';

interface AchievementState {
    achievements: Achievement[];
    lastUnlocked: UnlockAchievementResponse['achievement'] | null;
}

const initialState: AchievementState = {
    achievements: [],
    lastUnlocked: null,
};

const achievementSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {
        setAchievements: (state, action: PayloadAction<Achievement[]>) => {
            state.achievements = action.payload;
        },
        setUnlockedAchievement: (state, action: PayloadAction<UnlockAchievementResponse>) => {
            state.lastUnlocked = action.payload.achievement;
        },
    },
});

export const { setAchievements, setUnlockedAchievement } = achievementSlice.actions;

export default achievementSlice.reducer;
