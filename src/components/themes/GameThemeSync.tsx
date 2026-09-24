"use client";

import { useEffect } from "react";
import { useTheme, PersonaTheme } from "@/components/themes/ThemeProvider";

export function GameThemeSync({ targetTheme }: { targetTheme: PersonaTheme }) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (targetTheme && theme !== targetTheme) {
      setTheme(targetTheme);
    }
  }, [targetTheme, theme, setTheme]);

  return null;
}
