import React from "react";
import { GameService } from "@/services/games/GameService";
import { OfferService } from "@/services/offers/OfferService";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PriceComparison } from "@/components/products/PriceComparison";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export const metadata = {
  title: "Comparador de Preços Persona | ProjecSona Marketplace",
  description: "Compare preços de Persona 3 Reload, Persona 4 Revival e Persona 5 Royal entre todas as lojas digitais autorizadas.",
};

export default async function OffersHubPage() {
  const games = await GameService.getAllGames();
  const comparisons = await Promise.all(
    games.map((g) => OfferService.getComparisonForGame(g.id))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: "Comparador de Preços" }]} />

      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Monitoramento de Ofertas em Tempo Real</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-white font-display">
          Central de Comparação de Preços
        </h1>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          Comparamos os valores de ativação digital em lojas oficiais e parceiros autorizados (Steam, Nuuvem, Green Man Gaming, Epic Games) com os preços da nossa própria loja para garantir sempre a máxima economia.
        </p>
      </div>

      {/* Comparisons for Each Game */}
      <div className="space-y-16">
        {comparisons.map((comp) => {
          if (!comp) return null;
          return (
            <div key={comp.game.id} className="space-y-4">
              <PriceComparison
                gameName={comp.game.name}
                offers={comp.offers}
                lowestPrice={comp.lowestPrice}
              />
              <div className="text-right">
                <Link
                  href={`/jogos/${comp.game.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-theme-primary hover:underline font-mono uppercase"
                >
                  <span>Ver página completa de {comp.game.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
