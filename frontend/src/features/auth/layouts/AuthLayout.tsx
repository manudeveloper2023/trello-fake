import { useUIStoreTheme } from "@/features/shared/stores/useUIStore";
import { Outlet } from "react-router";

export const AuthLayout = () => {
  const theme = useUIStoreTheme();

  const dotColor =
    theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)";

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-white text-black dark:bg-black dark:text-white transition-colors duration-300">
      <div
        className="absolute inset-0 opacity-100 transition-all duration-300"
        style={{
          backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
};
