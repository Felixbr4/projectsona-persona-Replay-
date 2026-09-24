import React from "react";
import { notFound } from "next/navigation";
import { ProductService } from "@/services/products/ProductService";
import { OfferService } from "@/services/offers/OfferService";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { PriceComparison } from "@/components/products/PriceComparison";
import { ProductAddToCartSection } from "@/components/products/ProductAddToCartSection";
import { ShieldCheck, Zap, KeyRound, Monitor, Globe } from "lucide-react";

export const revalidate = 0;

interface ProductDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProductDetailPageProps) {
  const product = await ProductService.getProductBySlug(params.slug);
  if (!product) return { title: "Produto não encontrado | ProjecSona" };

  return {
    title: `${product.name} - Chave Steam Oficial | ProjecSona`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await ProductService.getProductBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const comparisonData = await OfferService.getComparisonForGame(product.gameId);

  const available = product.availableStock !== undefined ? product.availableStock : product.stockQuantity;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs
        items={[
          { label: "Catálogo", href: "/catalogo" },
          { label: product.game.name, href: `/jogos/${product.game.slug}` },
          { label: product.name },
        ]}
      />

      {/* Main Product Showcase Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-theme-surface/70 border border-theme-border/80 rounded-3xl p-6 sm:p-10 backdrop-blur-md shadow-2xl">
        {/* Left Artwork */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-[16/9] sm:aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-950 border border-theme-border/80 shadow-2xl">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-sm text-theme-muted">
                [PROJECSONA KEY ART]
              </div>
            )}

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg text-xs font-mono font-bold text-white border border-white/20">
                {product.platform}
              </span>
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="px-3 py-1 bg-red-600 text-white font-black text-xs rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                  -{product.discountPercentage}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-black/40 border border-theme-border/60 rounded-xl text-center">
              <KeyRound className="w-5 h-5 text-theme-primary mx-auto mb-1" />
              <p className="text-[11px] font-mono text-neutral-300">Chave Oficial</p>
            </div>
            <div className="p-3 bg-black/40 border border-theme-border/60 rounded-xl text-center">
              <Zap className="w-5 h-5 text-theme-primary mx-auto mb-1" />
              <p className="text-[11px] font-mono text-neutral-300">Envio Imediato</p>
            </div>
            <div className="p-3 bg-black/40 border border-theme-border/60 rounded-xl text-center">
              <Globe className="w-5 h-5 text-theme-primary mx-auto mb-1" />
              <p className="text-[11px] font-mono text-neutral-300">Global / Brasil</p>
            </div>
          </div>
        </div>

        {/* Right Details & Buy Box */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="primary" className="text-xs">
                {product.game.name}
              </Badge>
              <span className="text-xs font-mono text-neutral-400">
                Edição: {product.edition}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black uppercase italic tracking-tight text-white font-display leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-neutral-300 leading-relaxed">
              {product.description}
            </p>

            {/* Price Box */}
            <div className="p-5 bg-black/50 border border-theme-border/80 rounded-2xl space-y-2">
              <div className="flex items-baseline gap-3">
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-neutral-500 line-through font-mono">
                    R$ {product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-3xl sm:text-4xl font-black text-theme-primary font-mono tracking-tight">
                  R$ {product.price.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono">
                Pagamento único via PIX ou Cartão com ativação imediata.
              </p>
            </div>
          </div>

          {/* Interactive Add to Cart & Buy Now Action Section */}
          <ProductAddToCartSection product={product} availableStock={available} />
        </div>
      </div>

      {/* Activation Instructions Section */}
      <section className="p-8 rounded-3xl bg-theme-surface/50 border border-theme-border/80 space-y-4">
        <h3 className="text-lg font-black uppercase text-white tracking-tight flex items-center gap-2">
          <Monitor className="w-5 h-5 text-theme-primary" />
          Como Ativar Sua Chave na Steam
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
          <li>Após a confirmação do pagamento, acesse a aba <strong>Meus Pedidos</strong> na sua conta ProjecSona.</li>
          <li>Clique no botão <strong>Revelar Chave</strong> para descriptografar o seu código Steam exclusivo.</li>
          <li>Abra o aplicativo da <strong>Steam</strong> no seu computador e clique em <strong>Jogos</strong> no menu superior.</li>
          <li>Selecione <strong>Ativar um produto no Steam...</strong> e cole o seu código alfanumérico.</li>
          <li>O jogo será permanentemente adicionado à sua biblioteca Steam para download ilimitado.</li>
        </ol>
      </section>

      {/* Price Comparison for this Game */}
      {comparisonData && (
        <PriceComparison
          gameName={product.game.name}
          offers={comparisonData.offers}
          lowestPrice={comparisonData.lowestPrice}
        />
      )}
    </div>
  );
}
