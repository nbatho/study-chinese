import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useRefreshAuthQuery } from "../api/auth/queries";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCredentials, setAuthLoading } from "../store/modules/authSlice";
import { hasAuthSession } from "../utils/authSession";

interface RouteGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

interface PublicRouteProps extends RouteGuardProps {
  redirectAuthenticatedTo?: string;
}

const RouteLoading = () => (
  <div className="flex min-h-screen items-center justify-center text-muted-foreground">
    Loading...
  </div>
);

const useAutoLogin = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  useRefreshAuthQuery(status === "loading" && hasAuthSession());

  useEffect(() => {
    if (status !== "idle") {
      return;
    }

    if (hasAuthSession()) {
      dispatch(setAuthLoading());
      return;
    }

    dispatch(clearCredentials());
  }, [dispatch, status]);

  return status;
};

export const PrivateRoute = ({ children, redirectTo = "/" }: RouteGuardProps) => {
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

export const OptionalAuthRoute = ({ children }: RouteGuardProps) => {
  const status = useAutoLogin();

  if (status === "idle" || status === "loading") {
    return <RouteLoading />;
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
