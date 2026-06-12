import { createBrowserRouter } from "react-router";
import { authRoutes } from "@features/auth/auth.routes";
import { AuthLayout } from "@features/auth/layouts/AuthLayout";
import { AppLayout } from "./AppLayout";
export const router = createBrowserRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      {
        path: "auth",
        Component: AuthLayout,
        children: [...authRoutes],
      },
    ],
  },
]);
