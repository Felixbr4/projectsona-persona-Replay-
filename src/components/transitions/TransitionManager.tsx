"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme, PersonaTheme } from "@/components/themes/ThemeProvider";
import { Persona3Transition } from "./Persona3Transition";
import { Persona4Transition } from "./Persona4Transition";
import { Persona5Transition } from "./Persona5Transition";

interface TransitionContextType {
  navigateToGame: (gameSlug: string, targetTheme: PersonaTheme) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const { setTheme } = useTheme();
  const [activeTransition, setActiveTransition] = useState<PersonaTheme | null>(null);
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const navigateToGame = useCallback(
    (gameSlug: string, targetTheme: PersonaTheme) => {
      // Verificar prefers-reduced-motion para acessibilidade
      const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const targetPath = `/jogos/${gameSlug}`;

      if (prefersReducedMotion) {
        // Fallback imediato sem animações longas
        setTheme(targetTheme);
        router.push(targetPath);
        return;
      }

      setPendingRoute(targetPath);
      setActiveTransition(targetTheme);
    },
    [router, setTheme]
  );

  const handleTransitionComplete = useCallback(() => {
    if (activeTransition) {
      setTheme(activeTransition);
    }
    if (pendingRoute) {
      router.push(pendingRoute);
    }
    setActiveTransition(null);
    setPendingRoute(null);
  }, [activeTransition, pendingRoute, router, setTheme]);

  return (
    <TransitionContext.Provider
      value={{
        navigateToGame,
        isTransitioning: activeTransition !== null,
      }}
    >
      {children}

      {/* Renderização Condicional da Animação Modular */}
      {activeTransition === "persona3" && (
        <Persona3Transition onComplete={handleTransitionComplete} />
      )}
      {activeTransition === "persona4" && (
        <Persona4Transition onComplete={handleTransitionComplete} />
      )}
      {activeTransition === "persona5" && (
        <Persona5Transition onComplete={handleTransitionComplete} />
      )}
    </TransitionContext.Provider>
  );
};

export function useGameTransition() {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error("useGameTransition deve ser utilizado dentro de TransitionManager");
  }
  return context;
}
