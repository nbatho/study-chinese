import { useAppSelector } from "../store/hooks";

/**
 * For screens that show a sign-in prompt when there is no session.
 *
 * Auto-login starts as "idle"/"loading", so `status === "authenticated"` is
 * false on a hard reload before the session is rehydrated. Gating the prompt on
 * that alone flashes "sign in" — or strands the page there — at a signed-in
 * user. `isResolving` marks that window so callers can wait it out instead.
 */
export const useAuthGate = () => {
  const status = useAppSelector((state) => state.auth.status);

  return {
    isResolving: status === "idle" || status === "loading",
    isAuthenticated: status === "authenticated",
  };
};
