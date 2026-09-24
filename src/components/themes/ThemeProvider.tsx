"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type PersonaTheme = "default" | "persona3" | "persona4" | "persona5";

interface ThemeContextType {
  theme: PersonaTheme;
  setTheme: (theme: PersonaTheme) => void;
  themeConfig: {
    name: string;
    primaryColor: string;
    accentColor: string;
    bgGradient: string;
    badgeStyle: string;
  };
}

const THEME_CONFIGS: Record<PersonaTheme, ThemeContextType["themeConfig"]> = {
  default: {
    name: "Velvet Room Standard",
    primaryColor: "#3b82f6",
    accentColor: "#00d2ff",
    bgGradient: "from-slate-950 via-slate-900 to-indigo-950",
    badgeStyle: "bg-blue-600/20 text-blue-400 border-blue-500/30",
  },
  persona3: {
    name: "Persona 3 Reload (Dark Hour)",
    primaryColor: "#00d2ff",
    accentColor: "#38bdf8",
    bgGradient: "from-[#040814] via-[#081229] to-[#040814]",
    badgeStyle: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(0,210,255,0.3)]",
  },
  persona4: {
    name: "Persona 4 Revival (TV World)",
    primaryColor: "#facc15",
    accentColor: "#fb923c",
    bgGradient: "from-[#0c0b08] via-[#1c190d] to-[#0c0b08]",
    badgeStyle: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40 shadow-[0_0_12px_rgba(250,204,21,0.3)]",
  },
  persona5: {
    name: "Persona 5 Royal (Phantom Thieves)",
    primaryColor: "#ef4444",
    accentColor: "#ffffff",
    bgGradient: "from-[#0a0303] via-[#1a0606] to-[#0a0303]",
    badgeStyle: "bg-red-600/20 text-red-300 border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.4)]",
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<PersonaTheme>("default");

  useEffect(() => {
    // Carregar preferência de tema salva ou restaurar
    const savedTheme = localStorage.getItem("projecsona_theme") as PersonaTheme;
    if (savedTheme && THEME_CONFIGS[savedTheme]) {
      setThemeState(savedTheme);
    }
  }, []);

  const setTheme = (newTheme: PersonaTheme) => {
    setThemeState(newTheme);
    localStorage.setItem("projecsona_theme", newTheme);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-persona3", "theme-persona4", "theme-persona5");
    if (theme !== "default") {
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        themeConfig: THEME_CONFIGS[theme] || THEME_CONFIGS.default,
      }}
    >
      <div className={`min-h-screen bg-theme-bg text-theme-text transition-colors duration-500`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser utilizado dentro de um ThemeProvider");
  }
  return context;
}
