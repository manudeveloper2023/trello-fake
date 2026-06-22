import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useUIStoreActions,
  useUIStoreTheme,
} from "@/features/shared/stores/useUIStore";
import { Outlet } from "react-router";

export const AppLayout = () => {
  const { toggleTheme } = useUIStoreActions();
  const theme = useUIStoreTheme();

  return (
    <div className="relative min-h-screen">
      <div className="fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme} 
          className="cursor-pointer hover:scale-105"
          aria-label={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </div>
      <Outlet />
    </div>
  );
};
