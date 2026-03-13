import { createBrowserRouter } from "react-router";
import { Layout } from "../components/Layout";
import { Landing } from "../pages/Landing";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { Dashboard } from "../pages/Dashboard";
import { Inventory } from "../pages/Inventory";
import { Restock } from "../pages/Restock";
import { Settings } from "../pages/Settings";
import { NotFound } from "../pages/NotFound";
import { RouteErrorBoundary } from "../components/RouteErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: "/login",
    Component: Login,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    path: "/signup",
    Component: Signup,
    ErrorBoundary: RouteErrorBoundary,
  },
  {
    Component: Layout,
    ErrorBoundary: RouteErrorBoundary,
    children: [
      { path: "/dashboard", Component: Dashboard },
      { path: "inventory", Component: Inventory },
      { path: "restock", Component: Restock },
      { path: "settings", Component: Settings },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
