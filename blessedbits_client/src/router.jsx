import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import AppPage from "./pages/main/AppPage";
import App from "./App";
import WatchPage from "./pages/watch/WatchPage";
import UploadPage from "./pages/upload/UploadPage";
import RewardsPage from "./pages/rewards/RewardsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import SettingsPage from "./pages/settings/SettingsPage";
import ExplorePage from "./pages/explore/ExplorePage";
import OnboardingPage from "./pages/onboarding/OnboardingPage";
import ProtectedRoutes from "./components/ProtectedRoute";
import AdminPage from "./pages/admin/AdminPage";
import TransactionsPage from "./pages/transactions/TransactionsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/app",
    Component: App,
    children: [
      {
        element: <ProtectedRoutes />, // This wraps all protected routes
        children: [
          {
            index: true,
            Component: AppPage,
          },
          {
            path: "explore",
            Component: ExplorePage,
          },
          {
            path: "video/:videoId",
            Component: WatchPage,
          },
          {
            path: "upload",
            Component: UploadPage,
          },
          {
            path: "rewards",
            Component: RewardsPage,
          },
          {
            path: "transactions",
            Component: TransactionsPage,
          },
          {
            path: "profile",
            Component: ProfilePage,
          },
          {
            path: "admin",
            Component: AdminPage,
          },
          {
            path: "settings",
            Component: SettingsPage,
          },
        ],
      },
      {
        path: "register",
        Component: OnboardingPage,
      },
    ],
  },
]);
