import { type RouteObject, createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LandingPage from "../pages/LandingPage";
import Dashboard from "../pages/Dashboard";
import NotFoundPage from "../pages/NotFoundPage";
import SearchPage from "../pages/SearchPage";
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";
import SettingsPage from "../pages/SettingsPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import ActivateAccountPage from "../pages/auth/ActivateAccountPage";
import RegisteredAccountActivationInfo from "../pages/auth/RegisteredAccountActivationInfo";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ChangeAccountPassword from "../pages/auth/ChangeAccountPassword";
import TripDetailPage from "../pages/TripDetailPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    ),
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard/trips/:id",
        element: (
          <ProtectedRoute>
            <TripDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/search",
        element: (
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/signin",
    element: (
      <PublicRoute>
        <SignInPage />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <SignUpPage />
      </PublicRoute>
    ),
  },
  {
    path: "/account/activate/:token",
    element: (
      <PublicRoute>
        <ActivateAccountPage />
      </PublicRoute>
    ),
  },
  {
    path: "/account/created",
    element: (
      <PublicRoute>
        <RegisteredAccountActivationInfo />
      </PublicRoute>
    ),
  },
  {
    path: "/account/forgot-password",
    element: (
      <PublicRoute>
        <ForgotPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/account/change-password/:token",
    element: (
      <PublicRoute>
        <ChangeAccountPassword />
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);
