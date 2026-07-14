import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import type { RouteConfig } from "../types/app";
import App from "../App";
import { OptionalAuthRoute, PrivateRoute, PublicRoute } from "./AuthRoute";

// Lazy loaded page components
const Home = lazy(() => import("../pages/Home"));
const Landing = lazy(() => import("../pages/Landing"));
const Guide = lazy(() => import("../pages/Guide"));
const Foundation = lazy(() => import("../pages/Foundation"));
const Learn = lazy(() => import("../pages/Learn"));
const Grammar = lazy(() => import("../pages/Grammar"));
const Radicals = lazy(() => import("../pages/Radicals"));
const Practice = lazy(() => import("../pages/Practice"));
const Review = lazy(() => import("../pages/Review"));
const Dictionary = lazy(() => import("../pages/Dictionary"));
const Translate = lazy(() => import("../pages/Translate"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Profile/Settings"));
const Shop = lazy(() => import("../pages/Shop"));
const Onboarding = lazy(() => import("../pages/Onboarding"));
const PlacementTest = lazy(() => import("../pages/PlacementTest"));
const Auth = lazy(() => import("../pages/Auth"));
const VerifyEmail = lazy(() => import("../pages/Auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("../pages/Auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/Auth/ResetPassword"));
const AITutor = lazy(() => import("../pages/AITutor"));
const Admin = lazy(() => import("../pages/Admin"));
const Community = lazy(() => import("../pages/Community"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <Navigate to="/landing" replace />
  },
  {
    path: "/landing",
    element: (
      <OptionalAuthRoute>
        <Landing />
      </OptionalAuthRoute>
    )
  },
  {
    element: (
      <OptionalAuthRoute>
        <App />
      </OptionalAuthRoute>
    ), // App renders the global AppLayout.
    children: [
      {
        path: "home",
        element: <Home />
      },
      {
        path: "guide",
        element: <Guide />
      },
      {
        path: "foundation",
        element: <Foundation />
      },
      {
        path: "learn",
        element: <Learn />
      },
      {
        path: "grammar",
        element: <Grammar />
      },
      {
        path: "radicals",
        element: <Radicals />
      },
      {
        path: "practice",
        element: <Practice />
      },
      {
        path: "review",
        element: <Review />
      },
      {
        path: "dictionary",
        element: <Dictionary />
      },
      {
        path: "translate",
        element: <Translate />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path: "settings",
        element: <Settings />
      },
      {
        path: "achievements",
        element: <Navigate to="/profile#achievements" replace />
      },
      {
        path: "shop",
        element: <Shop />
      },
      {
        path: "community",
        element: <Community />
      },
      {
        path: "ai-tutor",
        element: <AITutor />
      },
      {
        path: "admin",
        element: <Admin />
      },
      {
        path: "camera-translator",
        element: <Navigate to="/translate" replace />
      },
      {
        path: "*",
        element: <NotFound />
      }
    ]
  },
  {
    path: "/auth",
    element: (
      <PublicRoute redirectAuthenticatedTo="/home">
        <Auth />
      </PublicRoute>
    )
  },
  {
    // Reached from an email link — works with or without a session.
    path: "/verify-email",
    element: (
      <OptionalAuthRoute>
        <VerifyEmail />
      </OptionalAuthRoute>
    )
  },
  {
    path: "/forgot-password",
    element: (
      <PublicRoute redirectAuthenticatedTo="/settings">
        <ForgotPassword />
      </PublicRoute>
    )
  },
  {
    path: "/reset-password",
    element: (
      <OptionalAuthRoute>
        <ResetPassword />
      </OptionalAuthRoute>
    )
  },
  {
    path: "/onboarding",
    element: (
      <PublicRoute>
        <Onboarding />
      </PublicRoute>
    )
  },
  {
    path: "/placement-test",
    element: (
      <PrivateRoute redirectTo="/auth">
        <PlacementTest />
      </PrivateRoute>
    )
  },
  {
    path: "*",
    element: <NotFound />
  }
];

export const router = createBrowserRouter(routes);
