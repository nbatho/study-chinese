import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { isLanguage } from "../../i18n/languages";
import type { Language } from "../../i18n/languages";

export type AppAppearance = "light" | "dark" | "system";
export type AppLanguage = Language;

/**
 * The HSK level picked on the Learn screen, or null to follow the level
 * recommended by the learner's CEFR level. Navbar shows progress for the same
 * level as Learn's roadmap, so the selection cannot live in Learn's local state.
 *
 * Keyed by the placement date it was made against: retaking the placement test
 * re-derives the recommendation instead of keeping a stale manual pick.
 */
export interface HskSelection {
  placementAt: string | null;
  level: number;
}

interface AppState {
  initialized: boolean;
  appAppearance: AppAppearance;
  hasCompletedOnboarding: boolean;
  language: AppLanguage;
  hskSelection: HskSelection | null;
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

// Only these fields survive a reload; `hskSelection` is deliberately excluded so
// a stale pick cannot outlive the session that made it.
const persistAppState = (state: AppState) => {
  try {
    localStorage.setItem(
      APP_STATE_KEY,
      JSON.stringify({
        appAppearance: state.appAppearance,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        language: state.language,
      }),
    );
  } catch {
    // Persistence is a convenience only; server profile remains the source of truth.
  }
};

const persistedState = loadPersistedAppState();

const initialState: AppState = {
  initialized: true,
  appAppearance: persistedState.appAppearance ?? "light",
  hasCompletedOnboarding: persistedState.hasCompletedOnboarding ?? false,
  language: isLanguage(persistedState.language) ? persistedState.language : "en",
  hskSelection: null,
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
    setHskSelection: (state, action: PayloadAction<HskSelection>) => {
      state.hskSelection = action.payload;
    },
  },
});

export const { setAppearance, setHskSelection, setLanguage, setOnboardingCompleted } = appSlice.actions;

export default appSlice.reducer;
