"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Sparkles, Star, Tag } from "lucide-react";

interface GameHeroProps {
  game: {
    id: string;
    name: string;
    slug: string;
    description: string;
    theme: string;
    genre: string;
    developer: string;
    releaseDate: string;
    metacriticScore?: number | null;
    image: string;
    bannerImage?: string | null;
    lowestPrice?: number | null;
  };
  onScrollToOffers?: () => void;
  onScrollToProducts?: () => void;
}

export const GameHero: React.FC<GameHeroProps> = ({
  game,
  onScrollToOffers,
  onScrollToProducts,
}) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-theme-border/80 bg-theme-surface/50 shadow-2xl mb-12">
      {/* Background Banner with Dynamic Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 scale-105 transition-transform duration-1000"
          style={{ backgroundImage: `url(${game.bannerImage || game.image})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-theme-bg via-theme-bg/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-theme-bg via-theme-bg/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Content */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="primary" className="text-xs py-1 px-3">
              {game.genre}
            </Badge>
            {game.metacriticScore && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-300 font-mono text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                <span>Metacritic: {game.metacriticScore}/100</span>
              </div>
            )}
            <span className="text-xs font-mono text-neutral-400">
              Lançamento: {game.releaseDate}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white font-display leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            {game.name}
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
            {game.description}
          </p>

          {/* Menor Preço Encontrado Highlight */}
          {game.lowestPrice && (
            <div className="inline-flex items-center gap-3 p-3.5 rounded-2xl bg-black/60 border border-theme-primary/40 backdrop-blur-md">
              <div className="p-2 bg-theme-primary/20 rounded-xl text-theme-primary">
                <Tag className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-mono uppercase text-theme-muted">
                  Menor Preço Encontrado
                </p>
                <p className="text-xl font-black text-theme-primary font-mono">
                  R$ {game.lowestPrice.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Button
              size="lg"
              variant="persona"
              onClick={onScrollToProducts}
              className="gap-2 text-base"
            >
              <ShoppingBag className="w-5 h-5" />
              Ver Edições Disponíveis
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={onScrollToOffers}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4 text-theme-primary" />
              Comparar com Outras Lojas
            </Button>
          </div>
        </div>

        {/* Right Cover Preview */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="relative group w-64 sm:w-72 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-theme-border/80 shadow-[0_0_40px_rgba(0,0,0,0.8)] group-hover:border-theme-primary transition-all duration-300">
            <img
              src={game.image}
              alt={game.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <div className="w-full text-center">
                <span className="text-[11px] font-mono uppercase font-bold text-white bg-theme-primary/30 px-3 py-1 rounded-full border border-theme-primary/40 backdrop-blur-sm">
                  {game.developer}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
