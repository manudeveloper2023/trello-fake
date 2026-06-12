import type { RouteObject } from "react-router";
import { Register } from "./pages/Register";

export const authRoutes: RouteObject[] = [
  {
    path: "login",
    element: <h1>Login</h1>,
  },
  {
    path: "register",
    Component: Register,
  },
];
