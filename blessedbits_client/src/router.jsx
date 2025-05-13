import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import AppPage from "./pages/main/AppPage";
import App from "./App";
import WatchPage from "./pages/watch/WatchPage";
import UploadPage from "./pages/upload/UploadPage";
import RewardsPage from "./pages/rewards/RewardsPage";
import ProfilePage from "./pages/profile/ProfilePage";
import BadgesPage from "./pages/badges/BadgesPage";
import SettingsPage from "./pages/settings/SettingsPage";
import ExplorePage from "./pages/explore/ExplorePage";

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
        path: "profile",
        Component: ProfilePage,
      },
      {
        path: "badges",
        Component: BadgesPage,
      },
      {
        path: "settings",
        Component: SettingsPage,
      },
    ],
  },
]);
