import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRefreshAuthQuery } from "../api/auth/queries";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setAuthLoading } from "../store/modules/authSlice";

interface RouteGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

interface PublicRouteProps extends RouteGuardProps {
  redirectAuthenticatedTo?: string;
}

const RouteLoading = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      fontFamily: "system-ui, sans-serif",
      color: "var(--text-muted)",
    }}
  >
    Loading...
  </div>
);

const useAutoLogin = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  useRefreshAuthQuery(status === "loading");

  useEffect(() => {
    if (status !== "idle") {
      return;
    }

    dispatch(setAuthLoading());
  }, [dispatch, status]);

  return status;
};

export const PrivateRoute = ({ children, redirectTo = "/auth" }: RouteGuardProps) => {
  const location = useLocation();
  const status = useAutoLogin();

  if (status === "idle" || status === "loading") {
    return <RouteLoading />;
  }

  if (status === "unauthenticated") {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return children;
};

export const PublicRoute = ({
  children,
  redirectAuthenticatedTo,
}: PublicRouteProps) => {
  const status = useAutoLogin();

  if (status === "idle" || status === "loading") {
    return <RouteLoading />;
  }

  if (status === "authenticated" && redirectAuthenticatedTo) {
    return <Navigate to={redirectAuthenticatedTo} replace />;
  }

  return children;
};
