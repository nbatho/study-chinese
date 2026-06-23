import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import type { RouteConfig } from "../types/app";
import App from "../App";
import { OptionalAuthRoute, PublicRoute } from "./AuthRoute";

// Lazy loaded page components
const Home = lazy(() => import("../pages/Home"));
const Guide = lazy(() => import("../pages/Guide"));
const Learn = lazy(() => import("../pages/Learn"));
const Practice = lazy(() => import("../pages/Practice"));
const Review = lazy(() => import("../pages/Review"));
const Dictionary = lazy(() => import("../pages/Dictionary"));
const Translate = lazy(() => import("../pages/Translate"));
const Profile = lazy(() => import("../pages/Profile"));
const Achievements = lazy(() => import("../pages/Achievements"));
const Onboarding = lazy(() => import("../pages/Onboarding"));
const Auth = lazy(() => import("../pages/Auth"));
const AITutor = lazy(() => import("../pages/AITutor"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: (
      <OptionalAuthRoute>
        <App />
      </OptionalAuthRoute>
    ), // App serves as the global layout component
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "home",
        element: <Navigate to="/" replace />
      },
      {
        path: "guide",
        element: <Guide />
      },
      {
        path: "learn",
        element: <Learn />
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
        path: "achievements",
        element: <Achievements />
      },
      {
        path: "ai-tutor",
        element: <AITutor />
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
      <PublicRoute redirectAuthenticatedTo="/">
        <Auth />
      </PublicRoute>
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
    path: "*",
    element: <NotFound />
  }
];

export const router = createBrowserRouter(routes);
