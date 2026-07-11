import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../../api/auth";
import { getAccessToken, removeAccessToken, setAccessToken } from "../../utils/authSession";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;
}

interface AuthCredentials {
  accessToken: string;
  user: AuthUser;
}

const initialState: AuthState = {
  user: null,
  accessToken: getAccessToken(),
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthLoading: (state) => {
      state.status = "loading";
    },
    setCredentials: (state, action: PayloadAction<AuthCredentials>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = "authenticated";
      setAccessToken(action.payload.accessToken);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = "unauthenticated";
      removeAccessToken();
    },
  },
});

export const { clearCredentials, setAuthLoading, setCredentials } = authSlice.actions;

export default authSlice.reducer;
