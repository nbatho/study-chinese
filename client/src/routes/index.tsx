import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import type { RouteConfig } from "../types/app";
import App from "../App";
import { PrivateRoute, PublicRoute } from "./AuthRoute";

// Lazy loaded page components
const Home = lazy(() => import("../pages/Home"));
const Learn = lazy(() => import("../pages/Learn"));
const Practice = lazy(() => import("../pages/Practice"));
const Review = lazy(() => import("../pages/Review"));
const Profile = lazy(() => import("../pages/Profile"));
const Achievements = lazy(() => import("../pages/Achievements"));
const Onboarding = lazy(() => import("../pages/Onboarding"));
const Auth = lazy(() => import("../pages/Auth"));
const AITutor = lazy(() => import("../pages/AITutor"));
const CameraTranslator = lazy(() => import("../pages/CameraTranslator"));
const NotFound = lazy(() => import("../pages/NotFound"));

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ), // App serves as the global layout component
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />
      },
      {
        path: "home",
        element: <Home />
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
        element: <CameraTranslator />
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
