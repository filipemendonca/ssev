"use client";

import { ReactNode, createContext, useContext, useMemo } from "react";

const DEFAULT_THEME = "green";

type ThemeContextType = {
  theme: string;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ActiveThemeProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const value = useMemo(() => ({ theme: DEFAULT_THEME }), []);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useThemeConfig must be used within an ActiveThemeProvider"
    );
  }
  return context;
}
