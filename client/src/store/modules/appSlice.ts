import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type AppAppearance = "light" | "dark" | "system";
export type AppLanguage = "en" | "vi";

interface AppState {
  initialized: boolean;
  appAppearance: AppAppearance;
  hasCompletedOnboarding: boolean;
  language: AppLanguage;
}

const APP_STATE_KEY = "study_chinese_app_state";

const loadPersistedAppState = (): Partial<AppState> => {
  try {
    const raw = localStorage.getItem(APP_STATE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const persistAppState = (state: Pick<AppState, "appAppearance" | "hasCompletedOnboarding" | "language">) => {
  try {
    localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
  } catch {
    // Persistence is a convenience only; server profile remains the source of truth.
  }
};

const persistedState = loadPersistedAppState();

const initialState: AppState = {
  initialized: true,
  appAppearance: persistedState.appAppearance ?? "light",
  hasCompletedOnboarding: persistedState.hasCompletedOnboarding ?? false,
  language: persistedState.language ?? "en",
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppearance: (state, action: PayloadAction<AppAppearance>) => {
      state.appAppearance = action.payload;
      persistAppState(state);
    },
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.hasCompletedOnboarding = action.payload;
      persistAppState(state);
    },
    setLanguage: (state, action: PayloadAction<AppLanguage>) => {
      state.language = action.payload;
      persistAppState(state);
    },
  },
});

export const { setAppearance, setLanguage, setOnboardingCompleted } = appSlice.actions;

export default appSlice.reducer;
