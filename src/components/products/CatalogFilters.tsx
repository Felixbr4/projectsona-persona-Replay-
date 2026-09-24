"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CatalogFiltersProps {
  games: Array<{ id: string; name: string; slug: string; theme: string }>;
  currentFilters: {
    gameSlug?: string;
    platform?: string;
    search?: string;
    sortBy?: string;
    onlyAvailable?: boolean;
  };
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({ games, currentFilters }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentFilters.search || "");
  const [game, setGame] = useState(currentFilters.gameSlug || "all");
  const [platform, setPlatform] = useState(currentFilters.platform || "all");
  const [sortBy, setSortBy] = useState(currentFilters.sortBy || "recent");
  const [onlyAvailable, setOnlyAvailable] = useState(currentFilters.onlyAvailable || false);

  const applyFilters = (overrides: Record<string, any> = {}) => {
    const params = new URLSearchParams(searchParams.toString());

    const activeFilters = {
      search,
      game,
      platform,
      sortBy,
      onlyAvailable,
      ...overrides,
    };

    if (activeFilters.search) params.set("search", activeFilters.search);
    else params.delete("search");

    if (activeFilters.game && activeFilters.game !== "all") params.set("game", activeFilters.game);
    else params.delete("game");

    if (activeFilters.platform && activeFilters.platform !== "all") params.set("platform", activeFilters.platform);
    else params.delete("platform");

    if (activeFilters.sortBy) params.set("sortBy", activeFilters.sortBy);
    else params.delete("sortBy");

    if (activeFilters.onlyAvailable) params.set("onlyAvailable", "true");
    else params.delete("onlyAvailable");

    router.push(`/catalogo?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    setGame("all");
    setPlatform("all");
    setSortBy("recent");
    setOnlyAvailable(false);
    router.push("/catalogo");
  };

  return (
    <div className="p-5 rounded-2xl bg-theme-surface/70 border border-theme-border/80 backdrop-blur-md space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Search Field */}
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Buscar por edição, DLC ou nome..."
            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-theme-border rounded-xl text-sm text-theme-text placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all"
          />
        </div>

        {/* Filter Game */}
        <div>
          <select
            value={game}
            onChange={(e) => {
              setGame(e.target.value);
              applyFilters({ game: e.target.value });
            }}
            className="w-full px-3 py-2.5 bg-black/40 border border-theme-border rounded-xl text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all"
          >
            <option value="all">Todos os Jogos</option>
            {games.map((g) => (
              <option key={g.slug} value={g.slug}>
                {g.name}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              applyFilters({ sortBy: e.target.value });
            }}
            className="w-full px-3 py-2.5 bg-black/40 border border-theme-border rounded-xl text-sm text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all"
          >
            <option value="recent">Mais Recentes</option>
            <option value="price-asc">Menor Preço</option>
            <option value="price-desc">Maior Preço</option>
            <option value="discount">Maior Desconto</option>
            <option value="name">Nome (A-Z)</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="md"
            variant="primary"
            onClick={() => applyFilters()}
            className="flex-1 gap-1.5"
          >
            <Filter className="w-4 h-4" />
            Filtrar
          </Button>
          <Button
            size="md"
            variant="ghost"
            onClick={handleReset}
            title="Limpar filtros"
            className="p-2.5 text-theme-muted hover:text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Quick Checkbox and Tags */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-theme-border/40 text-xs">
        <label className="flex items-center gap-2 cursor-pointer select-none text-neutral-300 hover:text-white">
          <input
            type="checkbox"
            checked={onlyAvailable}
            onChange={(e) => {
              setOnlyAvailable(e.target.checked);
              applyFilters({ onlyAvailable: e.target.checked });
            }}
            className="w-4 h-4 rounded border-theme-border bg-black text-theme-primary focus:ring-theme-primary"
          />
          <span>Exibir apenas produtos com chaves em estoque</span>
        </label>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-theme-muted uppercase">Plataforma:</span>
          {["all", "Steam", "PlayStation", "Xbox", "Switch"].map((p) => (
            <button
              key={p}
              onClick={() => {
                setPlatform(p);
                applyFilters({ platform: p });
              }}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors ${
                platform === p
                  ? "bg-theme-primary text-black font-black"
                  : "bg-white/5 text-neutral-400 hover:text-white"
              }`}
            >
              {p === "all" ? "Todas" : p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
