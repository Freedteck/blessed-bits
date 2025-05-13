import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/landing/LandingPage";
import AppPage from "./pages/main/AppPage";
import App from "./App";
import WatchPage from "./pages/watch/WatchPage";

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
        path: ":videoId",
        Component: WatchPage,
      },
    ],
  },
]);
