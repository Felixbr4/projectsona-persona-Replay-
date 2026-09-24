import React from "react";
import { notFound } from "next/navigation";
import { GameService } from "@/services/games/GameService";
import { OfferService } from "@/services/offers/OfferService";
import { GameHero } from "@/components/games/GameHero";
import { GameStory } from "@/components/games/GameStory";
import { GameCharacters } from "@/components/games/GameCharacters";
import { GameMechanics } from "@/components/games/GameMechanics";
import { ProductCard } from "@/components/products/ProductCard";
import { PriceComparison } from "@/components/products/PriceComparison";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { GameThemeSync } from "@/components/themes/GameThemeSync";
import { ShoppingBag } from "lucide-react";

export const revalidate = 0;

interface GamePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: GamePageProps) {
  const game = await GameService.getGameBySlug(params.slug);
  if (!game) return { title: "Jogo não encontrado | ProjecSona" };

  return {
    title: `${game.name} - Chaves Digitais & Comparador de Preços | ProjecSona`,
    description: game.description,
    openGraph: {
      title: `${game.name} | ProjecSona Store`,
      description: game.story.slice(0, 160),
      images: [game.image],
    },
  };
}

export default async function GameDetailPage({ params }: GamePageProps) {
  const game = await GameService.getGameBySlug(params.slug);
  if (!game) {
    notFound();
  }

  const comparisonData = await OfferService.getComparisonForGame(game.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      {/* Sincronizador de tema automático para a página temática */}
      <GameThemeSync targetTheme={game.theme as any} />

      <Breadcrumbs
        items={[
          { label: "Jogos", href: "/catalogo" },
          { label: game.name },
        ]}
      />

      {/* 1. Hero do Jogo */}
      <GameHero game={game} />

      {/* 2. Edições & Produtos Disponíveis */}
      <section className="my-16" id="produtos-edicoes">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-theme-primary/10 rounded-xl text-theme-primary">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-theme-muted">
              Loja Oficial ProjecSona
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white font-display">
              Edições de {game.name}
            </h2>
          </div>
        </div>

        {game.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {game.products.map((prod) => (
              <ProductCard key={prod.id} product={{ ...prod, game: { name: game.name, slug: game.slug, theme: game.theme } }} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-theme-surface/50 border border-theme-border rounded-2xl text-theme-muted font-mono text-xs">
            Novas edições e chaves Steam serão disponibilizadas em breve para {game.name}.
          </div>
        )}
      </section>

      {/* 3. Comparador de Preços em Tempo Real */}
      {comparisonData && (
        <PriceComparison
          gameName={game.name}
          offers={comparisonData.offers}
          lowestPrice={comparisonData.lowestPrice}
        />
      )}

      {/* 4. História do Jogo */}
      <GameStory gameName={game.name} story={game.story} />

      {/* 5. Personagens e Personas */}
      <GameCharacters characters={game.characters} />

      {/* 6. Mecânicas de Gameplay */}
      <GameMechanics theme={game.theme} />
    </div>
  );
}
