# ✈️ Travel Planner

A comprehensive travel planning web application that helps users discover, plan, and manage their trips with integrated flight and hotel search capabilities powered by Amadeus API.

## 📸 Screenshots

|                                          1 View                                          |                                          2 View                                           |
| :--------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------: |
| <img src="/src/assets/images/travel-planner-screen-1.png" alt="Mobile View" width="400"> | <img src="/src/assets/images/travel-planner-screen-2.png" alt="Desktop View" width="400"> |

## 📖 Overview

Travel Planner is a modern, responsive web application designed to streamline the travel planning process. Users can search for flight and hotel combinations, save trips, track price changes, and manage their travel plans all in one place. The application integrates with the Amadeus Travel API to provide real-time flight and hotel offers.

## 🌐 Live at: <https://travel-planner.doumbiasoft.com>

### 🔗 The Backend Repository URL:

<https://github.com/doumbiasoft/travel-planner-backend>

## ✨ Features

### 🔐 Authentication & User Management

- Email/password registration with account activation
- OAuth 2.0 authentication via Google
- Secure token-based authentication with JWT
- Automatic token refresh mechanism
- Password reset and recovery
- Profile management and updates
- Account deletion

### 🗺️ Trip Management

- Create, edit, and delete trips
- Advanced trip filtering (by name, origin, destination, dates, budget)
- Trip validation status tracking
- Price drop notifications
- Email notifications for trip updates
- Export trip details to PDF
- Interactive map markers for destinations

### 🔎 Search & Discovery

- Real-time flight search using Amadeus API
- Hotel availability search
- Smart recommendation engine for flight + hotel packages
- Budget-based filtering
- Multi-traveler support (adults, children, infants)
- Travel class selection (Economy, Premium Economy, Business, First)
- Date range selection with validation

### 🎨 User Interface

- Responsive design for desktop and mobile
- Real-time loading states and error handling
- Empty state illustrations
- Toast notifications for user feedback
- Interactive forms with validation
- Advanced filtering capabilities

### 🚀 Additional Features

- Contact form for user support
- Google Maps integration for location visualization
- Automatic session management
- HTTP request logging and monitoring
- Retry logic for failed API calls

## 🛠️ Tech Stack

### ⚛️ Frontend Framework & Libraries

- **React 19.1.1** - UI library with latest features
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.1.10** - Fast build tool and dev server
- **React Router DOM 7.9.4** - Client-side routing

### 📦 State Management & Data Fetching

- **TanStack Query 5.90.3** - Server state management with caching
- **React Context API** - Global state (auth, notifications)
- **React Hook Form 7.65.0** - Form state management
- **Zod 4.1.12** - Schema validation

### 🎨 UI Components & Styling

- **Ant Design 5.27.5** - Enterprise-grade UI components
- **Tailwind CSS 4.1.14** - Utility-first CSS framework
- **Lucide React 0.545.0** - Icon library
- **date-fns 4.1.0** - Date manipulation

### 🔌 API & Authentication

- **Axios 1.12.2** - HTTP client with interceptors
- **React OAuth Google 0.12.2** - Google authentication
- **React Cookie 8.0.1** - Cookie management
- **JWT Decode 4.0.0** - Token decoding

### 🗺️ Maps Integration

- **React Google Maps API 2.20.7** - Google Maps integration

### 🔧 Development Tools

- **TypeScript ESLint 8.45.0** - TypeScript-specific linting
- **Vite React Plugin 5.0.4** - React support for Vite

## 📁 Project Structure

```
travel-planner-frontend/
├── src/
│   ├── api/                    # API integration layer
│   │   ├── amadeus/           # Amadeus travel API integration
│   │   ├── auth/              # Authentication API
│   │   ├── mailbox/           # Email/contact API
│   │   ├── pdf/               # PDF export API
│   │   ├── trip/              # Trip management API
│   │   ├── api-base-config.tsx # Axios instance configuration
│   │   └── unit-of-work.tsx   # API aggregator (repository pattern)
│   │
│   ├── assets/                 # Static assets
│   │   └── images/            # Images and illustrations
│   │
│   ├── components/             # Reusable components
│   │   ├── FlightOfferCard.tsx
│   │   ├── HotelOfferCard.tsx
│   │   ├── HotelMap.tsx
│   │   ├── TripCard.tsx
│   │   ├── TripFormModal.tsx
│   │   └── GoogleIcon.tsx
│   │
│   ├── config/                 # Configuration files
│   │   └── env.tsx            # Environment variables
│   │
│   ├── helpers/                # Utility functions
│   │   └── http-status-codes.tsx
│   │
│   ├── hooks/                  # Custom React hooks
│   │   ├── AuthProvider.tsx   # Authentication context & hook
│   │   ├── AlertNotification.tsx # Notification system
│   │   ├── useGoogleOauth.tsx # Google OAuth integration
│   │   └── useMediaQuery.tsx  # Responsive design hook
│   │
│   ├── layouts/                # Layout components
│   │   └── MainLayout.tsx     # Main app layout with navigation
│   │
│   ├── pages/                  # Page components
│   │   ├── auth/              # Authentication pages
│   │   │   ├── SignInPage.tsx
│   │   │   ├── SignUpPage.tsx
│   │   │   ├── ActivateAccountPage.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── ChangeAccountPassword.tsx
│   │   │   └── RegisteredAccountActivationInfo.tsx
│   │   ├── ContactPage.tsx
│   │   ├── Dashboard.tsx      # Trip management dashboard
│   │   ├── LandingPage.tsx    # Public landing page
│   │   ├── NotFoundPage.tsx   # 404 page
│   │   ├── SearchPage.tsx     # Flight/hotel search
│   │   ├── SettingsPage.tsx   # User settings
│   │   └── TripDetailPage.tsx # Individual trip details
│   │
│   ├── router/                 # Routing configuration
│   │   ├── router.tsx         # Route definitions
│   │   ├── ProtectedRoute.tsx # Auth-required routes
│   │   └── PublicRoute.tsx    # Public-only routes
│   │
│   ├── styles/                 # Global styles
│   │   ├── style.css          # Global CSS
│   │   └── theme-Antd.tsx     # Ant Design theme config
│   │
│   ├── types/                  # TypeScript type definitions
│   │   └── index.tsx          # Shared interfaces
│   │
│   ├── utils/                  # Utility functions
│   │
│   ├── App.tsx                 # Root App component
│   └── main.tsx                # Application entry point
│
├── public/                     # Public static files
├── .env.local                  # Environment variables (not in git)
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── eslint.config.js            # ESLint configuration
```

## 🚀 Getting Started

### 📋 Prerequisites

- 🟢 Node.js (v18 or higher)
- 📦 npm or yarn
- 🖥️ Backend API server running (see backend repository)
- 🔑 Google OAuth credentials
- 🗺️ Google Maps API key
- ✈️ Amadeus API access (configured on backend)

### 💻 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd travel-planner-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

4. Configure environment variables (see [Environment Variables](#environment-variables))

5. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## ⚙️ Environment Variables

Create a `.env.local` file with the following variables:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000

# Google OAuth Client ID
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Application Mode (development/production)
VITE_MODE=development

# Google Maps API Key
VITE_GOOGLE_MAP_API_KEY=your-google-maps-api-key
```

### 🔑 Obtaining API Keys

**Google OAuth Client ID:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs

**Google Maps API Key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create an API key
4. Restrict the key (optional but recommended)

## 🏗️ Application Architecture

### High-Level Architecture

The application follows a layered architecture pattern:

```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│  (Pages, Components, Layouts)           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        State Management Layer           │
│  (React Query, Context, Hooks)          │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│           API Layer                     │
│  (Unit of Work, Repositories)           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│        HTTP Client Layer                │
│  (Axios Interceptors)                   │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Backend API                     │
│  (REST API, Amadeus Integration)        │
└─────────────────────────────────────────┘
```

### 🎯 Design Patterns

**📚 Repository Pattern:**

- API calls are organized using the Unit of Work pattern
- Each domain (auth, trip, amadeus, pdf, mailbox) has its own repository
- Located in `src/api/unit-of-work.tsx:7`

**🔌 Provider Pattern:**

- Authentication state via `AuthProvider` (`src/hooks/AuthProvider.tsx:32`)
- Notification system via `AlertNotificationProvider` (`src/hooks/AlertNotification.tsx:14`)
- React Query for server state caching

**🛡️ Higher-Order Component Pattern:**

- `ProtectedRoute` for authenticated routes (`src/router/ProtectedRoute.tsx`)
- `PublicRoute` for non-authenticated routes (`src/router/PublicRoute.tsx`)

## 🔌 API Integration

### API Base Configuration

The application uses two Axios instances (`src/api/api-base-config.tsx:17`):

1. **Internal API Instance** - For backend communication

   - Base URL: `VITE_API_BASE_URL`
   - Includes authentication headers
   - Cookie support enabled
   - 10-second timeout
   - Request/response logging in development

2. **External API Instance** - For third-party APIs
   - No authentication headers
   - Retry logic built-in
   - Error handling

### API Wrapper Class

The `Api` class provides:

- Automatic retry logic (configurable)
- Request/response interceptors
- Error handling with standardized format
- Support for all HTTP methods
- Blob download for PDFs
- Request duration tracking

### Unit of Work Pattern

Located at `src/api/unit-of-work.tsx:6`, this aggregates all API repositories:

```typescript
const unitOfWork = {
  auth: Auth, // Authentication operations
  trip: Trip, // Trip CRUD operations
  amadeus: Amadeus, // Flight/hotel search
  pdf: PDF, // PDF export
  mailbox: MailBox, // Contact/email
};
```

### 🛣️ API Endpoints

**🔐 Authentication API** (`src/api/auth/auth.tsx:8`):

- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `PATCH /api/v1/auth/activate` - Activate account
- `POST /api/v1/auth/forgot-password` - Request password reset
- `PATCH /api/v1/auth/change-password` - Change password
- `PATCH /api/v1/auth/update-profile` - Update user profile
- `PATCH /api/v1/auth/update-password` - Update password
- `DELETE /api/v1/auth/delete-account` - Delete account
- `POST /api/v1/auth/oauth-google` - Google OAuth login

**🗺️ Trip API** (`src/api/trip/trip.tsx:4`):

- `GET /api/v1/trips` - Get all user trips
- `GET /api/v1/trips/:id` - Get single trip
- `POST /api/v1/trips` - Create trip
- `PATCH /api/v1/trips/:id` - Update trip
- `DELETE /api/v1/trips/:id` - Delete trip

**✈️ Amadeus API** (`src/api/amadeus/amadeus.tsx:3`):

- `GET /api/v1/amadeus/city-code` - Search city codes
- `GET /api/v1/amadeus/search` - Search flight/hotel offers

**📄 PDF API** (`src/api/pdf/pdf.tsx:3`):

- `GET /api/v1/pdf/export/:tripId` - Export trip as PDF

**📧 Mailbox API** (`src/api/mailbox/mailbox.tsx:3`):

- `POST /api/v1/mailbox` - Send contact email

## 📊 State Management

### Global State

**Authentication State** (`src/hooks/AuthProvider.tsx:18`):

- User object
- Authentication status
- Loading states
- Error handling
- Token management

```typescript
interface AuthContextType {
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
```

**Notification State** (`src/hooks/AlertNotification.tsx:4`):

- Centralized notification system
- Toast messages for success/error/warning/info

### Server State

**React Query** is used for server state management:

- Automatic caching
- Background refetching
- Optimistic updates
- Loading and error states
- Query invalidation

Example usage in `src/pages/Dashboard.tsx:40`:

```typescript
const {
  data: trips,
  isLoading,
  isError,
} = useQuery({
  queryKey: ["trips"],
  queryFn: async () => {
    const response = await unitOfWork.trip.getTrips();
    return response.data || [];
  },
  refetchInterval: 30000, // Auto-refetch every 30 seconds
});
```

### Local Component State

- **React Hook Form** for form state (`src/pages/SearchPage.tsx:36`)
- **useState** for UI state (modals, filters, selections)
- **useMemo** for computed values and performance optimization

## 🔐 Authentication Flow

### 📝 Registration Flow

1.  User fills registration form (`src/pages/auth/SignUpPage.tsx`)
2.  Form validation using React Hook Form + Zod
3.  API call to `POST /api/v1/auth/register`
4.  Redirect to activation info page
5.  User receives activation email
6.  User clicks activation link
7.  Token validated at `ActivateAccountPage` (`src/pages/auth/ActivateAccountPage.tsx`)
8.  🎉 Account activated, user redirected to login

### 🔑 Login Flow

1.  User enters credentials or uses Google OAuth
2.  API call to `POST /api/v1/auth/login` or `POST /api/v1/auth/oauth-google`
3.  Backend returns access token and sets refresh token cookie
4.  Token stored in cookie via `AuthProvider.login()` (`src/hooks/AuthProvider.tsx:43`)
5.  User data fetched via `GET /api/v1/auth/me`
6.  User redirected to dashboard

### 🎫 Token Management

**Access Token:**

- Stored in cookie (7-day expiration)
- Sent in `Authorization: Bearer <token>` header
- Automatically added via request interceptor (`src/hooks/AuthProvider.tsx:86`)

**Refresh Token:**

- Stored in HTTP-only cookie (set by backend)
- Used automatically via response interceptor (`src/hooks/AuthProvider.tsx:101`)
- On 401 error, attempts token refresh
- On success, retries original request
- On failure, logs user out

### Session Management

- Automatic token refresh on 401 errors
- User data refetch on token change
- Logout clears all tokens and user data
- Google OAuth logout integration

## 🎯 Core Features

### 📊 Trip Dashboard

**📍 Location:** `src/pages/Dashboard.tsx`

**Features:**

- Display all user trips in card format
- Real-time filtering (name, origin, destination, dates, budget)
- Trip creation via modal form
- Trip editing with pre-filled data
- Trip deletion with confirmation
- Notification toggle for price alerts
- Empty states with illustrations
- Error handling with retry

### 🔎 Search Page

**📍 Location:** `src/pages/SearchPage.tsx`

**Features:**

- City autocomplete with IATA codes
- Date range picker with validation
- Budget and travel class selection
- Multi-traveler support
- Real-time offer search
- Tabbed results (Recommended, Flights, Hotels)
- Smart recommendation algorithm
- Save search as trip
- Budget fit indicators

**Search Form** (`src/pages/SearchPage.tsx:265`):

- Origin/destination autocomplete
- Date range validation (no past dates)
- Passenger count (adults, children, infants)
- Travel class selection
- Budget input with formatting

**Results Display:**

- Recommended package (flight + hotel)
- All available flights
- All available hotels
- Price breakdown
- Budget compatibility indicators

### 🗺️ Trip Detail Page

**📍 Location:** `src/pages/TripDetailPage.tsx`

**Features:**

- Full trip information display
- Google Maps integration with markers
- PDF export functionality
- Trip editing
- Trip deletion
- Validation status display

### ⚙️ Settings Page

**📍 Location:** `src/pages/SettingsPage.tsx`

**Features:**

- Profile information update
- Password change
- Account deletion
- OAuth account handling
- Form validation

### 📞 Contact Page

**📍 Location:** `src/pages/ContactPage.tsx`

**Features:**

- 📝 Contact form with subject and message
- 📧 Email submission to support
- 🔔 Success/error notifications

## 🧩 Components

### TripCard

**Location:** `src/components/TripCard.tsx`

A comprehensive card component displaying trip information:

- Trip name and dates
- Origin and destination
- Budget display
- Notification toggle
- Edit and delete actions
- Click to view details
- Validation status indicators

### FlightOfferCard

**Location:** `src/components/FlightOfferCard.tsx`

Displays flight offer details:

- Flight segments (outbound/return)
- Departure and arrival times
- Duration and stops
- Carrier information
- Price breakdown
- Cabin class and baggage
- Recommended badge

### HotelOfferCard

**Location:** `src/components/HotelOfferCard.tsx`

Displays hotel offer details:

- Hotel name and chain
- Location information
- Address display
- Recommended badge
- IATA code

### TripFormModal

**Location:** `src/components/TripFormModal.tsx`

Modal form for creating/editing trips:

- City autocomplete
- Date range picker
- Budget input
- Traveler preferences
- Google Maps marker placement
- Form validation
- Mode switching (add/edit)

### HotelMap

**Location:** `src/components/HotelMap.tsx`

Google Maps integration:

- Display hotel location
- Custom markers
- Interactive map controls

## 🛣️ Routing

### 🗺️ Route Structure

**📍 Location:** `src/router/router.tsx`

```typescript
const routes = [
  // Public routes
  { path: "/", element: <LandingPage /> },
  { path: "/signin", element: <SignInPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/account/activate/:token", element: <ActivateAccountPage /> },
  { path: "/account/forgot-password", element: <ForgotPassword /> },
  {
    path: "/account/change-password/:token",
    element: <ChangeAccountPassword />,
  },

  // Protected routes (require authentication)
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/dashboard/trips/:id", element: <TripDetailPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/settings", element: <SettingsPage /> },
  { path: "/contact", element: <ContactPage /> },

  // 404
  { path: "*", element: <NotFoundPage /> },
];
```

### 🛡️ Route Guards

**🔒 ProtectedRoute** (`src/router/ProtectedRoute.tsx`):

- Checks authentication status
- Shows loading spinner during auth check
- Redirects to signin if not authenticated
- Preserves intended destination in location state

**🌐 PublicRoute** (`src/router/PublicRoute.tsx`):

- Redirects authenticated users to dashboard
- Allows access to non-authenticated users

## 💻 Development

### 📜 Available Scripts

```bash
# Start development server (with hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Build and Deployment

### 📦 Production Build

```bash
npm run build
```

### ⚙️ Environment Configuration

For production deployment:

1. Set `VITE_MODE=production` in environment variables
2. Update `VITE_API_BASE_URL` to production API URL
3. Ensure Google OAuth redirect URIs include production domain
4. Configure CORS on backend for production domain

## 🔐 Security

### 🛡️ Authentication Security

- JWT-based authentication
- HTTP-only cookies for refresh tokens
- Automatic token refresh
- CORS enabled on backend
- Secure cookie flags in production

### ✅ Input Validation

- Client-side validation with Zod schemas
- Form validation with React Hook Form
- Server-side validation (backend)

## 🙏 Acknowledgments

- ✈️ Amadeus Travel API for flight and hotel data
- 🔑 Google for OAuth and Maps integration
- 🎨 Ant Design for UI components
- 🖼️ Storyset for illustrations
- 💙 Tailwind CSS
