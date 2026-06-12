import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface UIStoreState {
  theme: Theme;
}

interface UIStoreActions {
  toggleTheme: () => void;
}

interface UIStore extends UIStoreState {
  actions: UIStoreActions;
}

const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      theme: "light", // It's possible to initialize this based on the user's system preference or a saved value in localStorage
      actions: {
        toggleTheme: () =>
          set((state) => {
            const nextTheme = state.theme === "light" ? "dark" : "light";

            if (typeof window !== "undefined") {
              const root = window.document.documentElement;
              if (nextTheme === "dark") {
                root.classList.add("dark");
              } else {
                root.classList.remove("dark");
              }
            }

            return { theme: nextTheme };
          }),
      },
    }),
    {
      name: "ui-storage",

      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);

export const useUIStoreActions = () => useUIStore((state) => state.actions);
export const useUIStoreTheme = () => useUIStore((state) => state.theme);
