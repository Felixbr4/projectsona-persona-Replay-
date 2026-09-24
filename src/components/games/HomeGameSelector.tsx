"use client";

import React from "react";
import { useGameTransition } from "@/components/transitions/TransitionManager";
import { PersonaTheme } from "@/components/themes/ThemeProvider";
import { Sparkles, ArrowRight, Play } from "lucide-react";

interface GameItem {
  id: string;
  name: string;
  slug: string;
  theme: string;
  genre: string;
  image: string;
  bannerImage?: string | null;
  description: string;
}

export const HomeGameSelector: React.FC<{ games: GameItem[] }> = ({ games }) => {
  const { navigateToGame, isTransitioning } = useGameTransition();

  const themeStyles: Record<string, { border: string; glow: string; badge: string; accent: string }> = {
    persona3: {
      border: "hover:border-cyan-400 group-hover:shadow-[0_0_35px_rgba(0,210,255,0.4)]",
      glow: "from-cyan-950/60 to-transparent",
      badge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40",
      accent: "text-cyan-400",
    },
    persona4: {
      border: "hover:border-yellow-400 group-hover:shadow-[0_0_35px_rgba(250,204,21,0.4)]",
      glow: "from-yellow-950/60 to-transparent",
      badge: "bg-yellow-500/20 text-yellow-300 border-yellow-400/40",
      accent: "text-yellow-400",
    },
    persona5: {
      border: "hover:border-red-500 group-hover:shadow-[0_0_35px_rgba(239,68,68,0.5)]",
      glow: "from-red-950/60 to-transparent",
      badge: "bg-red-600/20 text-red-300 border-red-500/40",
      accent: "text-red-400",
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {games.map((game) => {
        const style = themeStyles[game.theme] || themeStyles.persona5;
        const targetTheme = (game.theme as PersonaTheme) || "default";

        return (
          <div
            key={game.id}
            onClick={() => !isTransitioning && navigateToGame(game.slug, targetTheme)}
            className={`group relative rounded-3xl bg-theme-surface/70 border-2 border-theme-border p-6 cursor-pointer overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between ${style.border}`}
          >
            {/* Ambient background image */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-35 group-hover:scale-110 transition-all duration-700 pointer-events-none"
              style={{ backgroundImage: `url(${game.image})` }}
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${style.glow} pointer-events-none`} />

            {/* Card Content */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${style.badge}`}>
                  {game.genre}
                </span>
                <span className="text-xs font-mono text-neutral-400 flex items-center gap-1 group-hover:text-white transition-colors">
                  <span>Transição Cinemática</span>
                  <Sparkles className="w-3 h-3 text-theme-primary" />
                </span>
              </div>

              <div className="pt-8">
                <h3 className="text-2xl font-black italic uppercase tracking-tight text-white font-display group-hover:text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                  {game.name}
                </h3>
                <p className="text-xs text-neutral-300 line-clamp-3 mt-2 leading-relaxed font-normal">
                  {game.description}
                </p>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="relative z-10 pt-6 mt-4 border-t border-white/10 flex items-center justify-between">
              <span className={`text-xs font-black uppercase tracking-wider ${style.accent} flex items-center gap-1.5`}>
                <Play className="w-3.5 h-3.5 fill-current" />
                Acessar Página
              </span>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-theme-primary group-hover:text-black transition-all">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
