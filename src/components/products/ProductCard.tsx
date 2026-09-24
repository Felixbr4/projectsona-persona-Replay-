"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart, CartProduct } from "@/context/CartContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, Eye, CheckCircle2, AlertCircle } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    edition: string;
    price: number;
    originalPrice?: number | null;
    platform: string;
    stockQuantity: number;
    availableStock?: number;
    discountPercentage?: number;
    inStock?: boolean;
    image?: string | null;
    game?: {
      name: string;
      slug: string;
      theme: string;
    };
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const available = product.availableStock !== undefined ? product.availableStock : product.stockQuantity;
  const isOutOfStock = available <= 0;
  const isLowStock = available > 0 && available <= 3;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const cartProd: CartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      edition: product.edition,
      price: product.price,
      originalPrice: product.originalPrice,
      platform: product.platform,
      image: product.image,
      availableStock: available,
      game: product.game,
    };

    const res = addItem(cartProd, 1);
    if (res.success) {
      setFeedback({ message: "Adicionado ao carrinho!", type: "success" });
    } else {
      setFeedback({ message: res.message || "Erro ao adicionar", type: "error" });
    }

    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div className="group relative rounded-2xl bg-theme-surface/80 border border-theme-border/80 overflow-hidden hover:border-theme-primary/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_35px_rgba(0,0,0,0.6)] flex flex-col justify-between">
      {/* Product Image and Overlay */}
      <Link href={`/produtos/${product.slug}`} className="block relative aspect-[16/9] overflow-hidden bg-neutral-950">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-900 text-theme-muted font-mono text-xs">
            [PROJECSONA KEY]
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-theme-surface via-transparent to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="px-2 py-0.5 bg-black/80 backdrop-blur-md rounded text-[10px] font-mono font-bold text-white border border-white/20">
            {product.platform}
          </span>
          {product.discountPercentage && product.discountPercentage > 0 ? (
            <span className="px-2 py-0.5 bg-red-600 text-white font-black text-[11px] rounded shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              -{product.discountPercentage}%
            </span>
          ) : null}
        </div>

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          {isOutOfStock ? (
            <Badge variant="danger" className="text-[10px] shadow">
              Esgotado
            </Badge>
          ) : isLowStock ? (
            <Badge variant="warning" className="text-[10px]">
              Últimas {available} un.
            </Badge>
          ) : (
            <Badge variant="success" className="text-[10px]">
              Em Estoque
            </Badge>
          )}
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {product.game && (
            <span className="text-[11px] font-mono uppercase tracking-widest text-theme-muted block mb-1">
              {product.game.name}
            </span>
          )}
          <Link href={`/produtos/${product.slug}`}>
            <h3 className="text-base font-black tracking-tight text-white group-hover:text-theme-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-neutral-400 mt-1 font-mono">
            Edição: {product.edition}
          </p>
        </div>

        {/* Price & Actions */}
        <div className="pt-3 border-t border-theme-border/60">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-neutral-500 line-through mr-2 font-mono">
                  R$ {product.originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-black text-theme-primary font-mono tracking-tight">
                R$ {product.price.toFixed(2)}
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
              Chave Oficial
            </span>
          </div>

          {/* Feedback Message */}
          {feedback && (
            <div
              className={`p-2 mb-2 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-fade-in ${
                feedback.type === "success"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-red-500/20 text-red-300 border border-red-500/40"
              }`}
            >
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/produtos/${product.slug}`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-theme-surface hover:bg-white/5 text-neutral-300 hover:text-white border border-theme-border rounded-lg text-xs font-bold transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Detalhes
            </Link>

            <Button
              size="sm"
              variant="primary"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className="gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Comprar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
