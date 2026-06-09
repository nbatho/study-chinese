import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import type { RouteConfig } from "../types/app";
import App from "../App";

// Lazy loaded page components
const Home = lazy(() => import("../pages/Home"));
const Learn = lazy(() => import("../pages/Learn"));
const Practice = lazy(() => import("../pages/Practice"));
const Review = lazy(() => import("../pages/Review"));
const Profile = lazy(() => import("../pages/Profile"));
const Onboarding = lazy(() => import("../pages/Onboarding"));
const AITutor = lazy(() => import("../pages/AITutor"));
const CameraTranslator = lazy(() => import("../pages/CameraTranslator"));

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: <App />, // App serves as the global layout component
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
        path: "ai-tutor",
        element: <AITutor />
      },
      {
        path: "camera-translator",
        element: <CameraTranslator />
      }
    ]
  },
  {
    path: "/onboarding",
    element: <Onboarding />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
];

export const router = createBrowserRouter(routes);
