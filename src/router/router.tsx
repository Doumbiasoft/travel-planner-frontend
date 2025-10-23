import { type RouteObject, createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import PageLoader from "../components/PageLoader";
import RouteErrorFallback from "../components/RouteErrorFallback";
import { logError } from "../utils/errorLogging";

// Lazy load all page components
const MainLayout = lazy(() => import("../layouts/MainLayout"));
const LandingPage = lazy(() => import("../pages/LandingPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const SearchPage = lazy(() => import("../pages/SearchPage"));
const SignInPage = lazy(() => import("../pages/auth/SignInPage"));
const SignUpPage = lazy(() => import("../pages/auth/SignUpPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const ActivateAccountPage = lazy(
  () => import("../pages/auth/ActivateAccountPage")
);
const RegisteredAccountActivationInfo = lazy(
  () => import("../pages/auth/RegisteredAccountActivationInfo")
);
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ChangeAccountPassword = lazy(
  () => import("../pages/auth/ChangeAccountPassword")
);
const TripDetailPage = lazy(() => import("../pages/TripDetailPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));

// Helper to wrap routes with error boundary
const withErrorBoundary = (
  element: React.ReactNode,
  routeName: string
): React.ReactNode => (
  <ErrorBoundary
    FallbackComponent={RouteErrorFallback}
    onError={(error, errorInfo) => {
      logError({
        error,
        errorInfo,
        context: `Route: ${routeName}`,
      });
    }}
    onReset={() => {
      // Reset route state - reload the current page
      window.location.reload();
    }}
  >
    {element}
  </ErrorBoundary>
);

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicRoute>
          <LandingPage />
        </PublicRoute>
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
  {
    element: (
      <Suspense fallback={<PageLoader />}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        path: "/dashboard",
        element: withErrorBoundary(
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          </Suspense>,
          "Dashboard"
        ),
      },
      {
        path: "/dashboard/trips/:id",
        element: withErrorBoundary(
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <TripDetailPage />
            </ProtectedRoute>
          </Suspense>,
          "Trip Detail"
        ),
      },
      {
        path: "/search",
        element: withErrorBoundary(
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          </Suspense>,
          "Search"
        ),
      },
      {
        path: "/settings",
        element: withErrorBoundary(
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          </Suspense>,
          "Settings"
        ),
      },
      {
        path: "/contact",
        element: (
          <Suspense fallback={<PageLoader />}>
            <ProtectedRoute>
              <ContactPage />
            </ProtectedRoute>
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/signin",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicRoute>
          <SignInPage />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/signup",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicRoute>
          <SignUpPage />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/account/activate/:token",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicRoute>
          <ActivateAccountPage />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/account/created",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicRoute>
          <RegisteredAccountActivationInfo />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/account/forgot-password",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "/account/change-password/:token",
    element: (
      <Suspense fallback={<PageLoader />}>
        <PublicRoute>
          <ChangeAccountPassword />
        </PublicRoute>
      </Suspense>
    ),
  },
  {
    path: "*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <NotFoundPage />
      </Suspense>
    ),
  },
];

export const router = createBrowserRouter(routes);
