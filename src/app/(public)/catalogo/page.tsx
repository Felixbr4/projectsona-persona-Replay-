import React from "react";
import { ProductService, ProductFilterOptions } from "@/services/products/ProductService";
import { GameService } from "@/services/games/GameService";
import { ProductCard } from "@/components/products/ProductCard";
import { CatalogFilters } from "@/components/products/CatalogFilters";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ShoppingBag } from "lucide-react";

export const revalidate = 0;

interface CatalogPageProps {
  searchParams: {
    game?: string;
    platform?: string;
    search?: string;
    sortBy?: string;
    onlyAvailable?: string;
  };
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const filters: ProductFilterOptions = {
    gameSlug: searchParams.game || undefined,
    platform: searchParams.platform || undefined,
    search: searchParams.search || undefined,
    sortBy: (searchParams.sortBy as any) || "recent",
    onlyAvailable: searchParams.onlyAvailable === "true",
  };

  const [products, games] = await Promise.all([
    ProductService.getCatalog(filters),
    GameService.getAllGames(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: "Catálogo de Produtos" }]} />

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-theme-primary/10 rounded-xl text-theme-primary">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-white font-display">
            Catálogo de Chaves Digitais
          </h1>
        </div>
        <p className="text-sm text-neutral-300">
          Explore todas as edições, passes de expansão e pacotes da franquia Persona com ativação digital na Steam.
        </p>
      </div>

      {/* Interactive Filters Bar (Client Component) */}
      <CatalogFilters games={games} currentFilters={filters} />

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl bg-theme-surface/40 border border-theme-border/80 space-y-3">
          <p className="text-lg font-bold text-white">Nenhum produto encontrado com os filtros selecionados.</p>
          <p className="text-xs text-theme-muted font-mono">Tente ajustar a busca ou limpar os filtros de jogo e plataforma.</p>
        </div>
      )}
    </div>
  );
}
