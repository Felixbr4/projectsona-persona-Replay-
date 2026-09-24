import React from "react";
import Link from "next/link";
import { GameService } from "@/services/games/GameService";
import { ProductService } from "@/services/products/ProductService";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { HomeGameSelector } from "@/components/games/HomeGameSelector";
import { Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Zap, TrendingUp } from "lucide-react";

export const revalidate = 0; // Dynamic server component

export default async function HomePage() {
  const [games, featuredProducts] = await Promise.all([
    GameService.getAllGames(),
    ProductService.getCatalog({ sortBy: "discount" }),
  ]);

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Background Aura Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-theme-primary/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[450px] h-[450px] bg-theme-secondary/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-theme-surface/80 border border-theme-primary/30 backdrop-blur-md shadow-[0_0_15px_var(--theme-glow)] animate-pulse">
            <Sparkles className="w-4 h-4 text-theme-primary" />
            <span className="text-xs font-mono font-bold tracking-widest text-theme-text uppercase">
              Chaves Oficiais Steam • Entrega Imediata
            </span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase italic tracking-tight text-white font-display leading-tight">
              A LOJA DEFINITIVA DA FRANQUIA{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-primary via-cyan-300 to-theme-accent drop-shadow-[0_0_25px_var(--theme-glow)]">
                PERSONA
              </span>
            </h1>
            <p className="text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Encontre as melhores edições de <strong>Persona 3 Reload</strong>, <strong>Persona 4 Revival</strong> e <strong>Persona 5 Royal</strong>. Compare preços em tempo real com lojas autorizadas e ative instantaneamente na sua Steam.
            </p>
          </div>

          {/* Quick CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/catalogo">
              <Button size="lg" variant="persona" className="gap-2 text-base px-8 py-4">
                <ShoppingBag className="w-5 h-5" />
                Explorar Catálogo Completo
              </Button>
            </Link>
            <Link href="/ofertas">
              <Button size="lg" variant="secondary" className="gap-2 text-base px-8 py-4">
                <TrendingUp className="w-5 h-5 text-theme-primary" />
                Ver Comparador de Ofertas
              </Button>
            </Link>
          </div>

          {/* 2. Client Game Selector with Interactive Cinematic Transitions */}
          <div className="pt-12">
            <div className="mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-theme-muted">
                ESCOLHA SEU JOGO PARA UMA EXPERIÊNCIA TEMÁTICA IMERSIVA
              </span>
            </div>
            <HomeGameSelector games={games} />
          </div>
        </div>
      </section>

      {/* 3. Destaques e Melhores Descontos do Catálogo */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" className="text-xs">
                Chaves Pronta Entrega
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight text-white font-display">
              Edições em Destaque & Promoções
            </h2>
          </div>

          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 text-sm font-bold text-theme-primary hover:text-theme-primary-hover transition-colors"
          >
            <span>Ver todas as edições</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. Por que Comprar na ProjecSona */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-theme-surface via-theme-surface/80 to-theme-surface border border-theme-border/80 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-theme-primary/10 flex items-center justify-center text-theme-primary">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Chaves Digitais Criptografadas
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Nossos códigos Steam são protegidos por criptografia de ponta a ponta (AES-256) e entregues no painel da sua conta imediatamente após o checkout.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-theme-primary/10 flex items-center justify-center text-theme-primary">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Garantia de Autenticidade
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Estoque verificado com controle transacional que previne conflitos de chaves duplicadas ou problemas de ativação regional na Steam.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-theme-primary/10 flex items-center justify-center text-theme-primary">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">
                Comparador Transparente
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Acompanhe os preços praticados por lojas parceiras e tenha sempre a certeza de garantir a melhor oportunidade para jogar o seu Persona favorito.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
