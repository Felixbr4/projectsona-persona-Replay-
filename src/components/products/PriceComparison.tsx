"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, ShoppingBag, Sparkles, Tag, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export interface OfferComparisonItem {
  source: "PROJECSONA" | "EXTERNAL";
  storeName: string;
  storeLogo?: string | null;
  isInternal: boolean;
  productName: string;
  platform: string;
  price: number;
  originalPrice?: number | null;
  inStock: boolean;
  stockCount?: number | null;
  url: string;
  lastUpdated?: string | Date;
}

interface PriceComparisonProps {
  gameName: string;
  offers: OfferComparisonItem[];
  lowestPrice?: number | null;
}

export const PriceComparison: React.FC<PriceComparisonProps> = ({
  gameName,
  offers,
  lowestPrice,
}) => {
  if (!offers || offers.length === 0) {
    return (
      <div className="p-8 text-center bg-theme-surface/40 rounded-2xl border border-theme-border text-theme-muted font-mono text-xs">
        Nenhuma oferta externa cadastrada no momento para {gameName}.
      </div>
    );
  }

  // Identificar o menor preço da lista
  const minPrice = lowestPrice || Math.min(...offers.map((o) => o.price));

  return (
    <section className="my-16" id="comparador-precos">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-theme-primary/10 rounded-xl text-theme-primary">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-theme-muted">
              Transparência & Economia
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white font-display">
              Comparador de Preços: {gameName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
          <Tag className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono text-neutral-300">Menor preço encontrado:</span>
          <strong className="text-base font-black text-emerald-400 font-mono">
            R$ {minPrice.toFixed(2)}
          </strong>
        </div>
      </div>

      {/* Tabela de Comparação Moderna */}
      <div className="overflow-x-auto rounded-2xl border border-theme-border/80 bg-theme-surface/70 backdrop-blur-md shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-theme-border/60 bg-black/40 text-[11px] font-mono uppercase tracking-wider text-theme-muted">
              <th className="py-4 px-6">Loja / Vendedor</th>
              <th className="py-4 px-4">Plataforma</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Preço Encontrado</th>
              <th className="py-4 px-6 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-border/40 text-sm">
            {offers.map((offer, idx) => {
              const isBestPrice = offer.price === minPrice;

              return (
                <tr
                  key={idx}
                  className={`transition-colors duration-200 ${
                    isBestPrice
                      ? "bg-theme-primary/5 hover:bg-theme-primary/10"
                      : "hover:bg-white/5"
                  }`}
                >
                  {/* Store Name & Source */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-theme-surface border border-theme-border flex items-center justify-center font-bold text-xs text-theme-primary">
                        {offer.isInternal ? "🎭" : offer.storeName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">
                            {offer.storeName}
                          </span>
                          {offer.isInternal && (
                            <span className="px-1.5 py-0.5 bg-theme-primary text-black text-[10px] font-black rounded uppercase">
                              Nossa Loja
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-theme-muted font-mono block">
                          {offer.productName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Platform */}
                  <td className="py-4 px-4 font-mono text-xs text-neutral-300">
                    <span className="px-2 py-0.5 bg-neutral-900 border border-neutral-700 rounded">
                      {offer.platform}
                    </span>
                  </td>

                  {/* Availability */}
                  <td className="py-4 px-4">
                    {offer.isInternal ? (
                      offer.inStock ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Pronta Entrega ({offer.stockCount} un.)
                        </span>
                      ) : (
                        <span className="text-xs text-red-400 font-bold">Esgotado</span>
                      )
                    ) : (
                      <span className="text-xs text-neutral-400 font-mono">Oferta Externa</span>
                    )}
                  </td>

                  {/* Price with Best Price Badge */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div>
                        {offer.originalPrice && offer.originalPrice > offer.price && (
                          <span className="text-xs text-neutral-500 line-through block font-mono">
                            R$ {offer.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span
                          className={`text-lg font-black font-mono tracking-tight ${
                            isBestPrice ? "text-emerald-400" : "text-white"
                          }`}
                        >
                          R$ {offer.price.toFixed(2)}
                        </span>
                      </div>

                      {isBestPrice && (
                        <Badge variant="success" className="text-[10px] whitespace-nowrap">
                          ★ Menor Preço
                        </Badge>
                      )}
                    </div>
                  </td>

                  {/* Action CTA */}
                  <td className="py-4 px-6 text-right">
                    {offer.isInternal ? (
                      <Link href={offer.url}>
                        <Button size="sm" variant="persona" className="gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Comprar Aqui
                        </Button>
                      </Link>
                    ) : (
                      <a
                        href={offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-theme-surface hover:bg-white/10 text-neutral-200 hover:text-white border border-theme-border text-xs font-bold transition-all"
                      >
                        <span>Acessar Oferta</span>
                        <ExternalLink className="w-3 h-3 text-theme-muted" />
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
