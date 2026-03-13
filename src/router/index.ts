import { createBrowserRouter } from "react-router";
import { Layout } from "../components/Layout";
import { Landing } from "../pages/Landing";
import { Login } from "../pages/Login";
import { Signup } from "../pages/Signup";
import { Dashboard } from "../pages/Dashboard";
import { Inventory } from "../pages/Inventory";
import { Restock } from "../pages/Restock";
import { Settings } from "../pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/app",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "inventory", Component: Inventory },
      { path: "restock", Component: Restock },
      { path: "settings", Component: Settings },
    ],
  },
]);
