import { type RouteObject, createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LandingPage from "../pages/LandingPage";
import Dashboard from "../pages/Dashboard";
import NotFoundPage from "../pages/NotFoundPage";
import SearchPage from "../pages/SearchPage";
import SignInPage from "../pages/auth/SignInPage";
import SignUpPage from "../pages/auth/SignUpPage";
import SettingsPage from "../pages/SettingsPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <NotFoundPage />,
  },
  {
    element: <MainLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "/signin",
    element: <SignInPage />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
];

export const router = createBrowserRouter(routes);
