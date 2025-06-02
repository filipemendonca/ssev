"use client";

import { ReactNode, createContext, useContext } from "react";

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
  return (
    <ThemeContext.Provider value={{ theme: DEFAULT_THEME }}>
      {children}
    </ThemeContext.Provider>
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
