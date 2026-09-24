"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, CartProduct } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ShoppingBag, Zap, CheckCircle2, AlertCircle, Plus, Minus } from "lucide-react";

interface ProductAddToCartSectionProps {
  product: {
    id: string;
    name: string;
    slug: string;
    edition: string;
    price: number;
    originalPrice?: number | null;
    platform: string;
    image?: string | null;
    game?: {
      name: string;
      slug: string;
      theme: string;
    };
  };
  availableStock: number;
}

export const ProductAddToCartSection: React.FC<ProductAddToCartSectionProps> = ({
  product,
  availableStock,
}) => {
  const router = useRouter();
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const isOutOfStock = availableStock <= 0;

  const handleAddToCart = () => {
    const cartProd: CartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      edition: product.edition,
      price: product.price,
      originalPrice: product.originalPrice,
      platform: product.platform,
      image: product.image,
      availableStock,
      game: product.game,
    };

    const res = addItem(cartProd, quantity);
    if (res.success) {
      setFeedback({ message: "Produto adicionado ao carrinho com sucesso!", type: "success" });
    } else {
      setFeedback({ message: res.message || "Não foi possível adicionar.", type: "error" });
    }

    setTimeout(() => setFeedback(null), 3000);
  };

  const handleBuyNow = () => {
    const cartProd: CartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      edition: product.edition,
      price: product.price,
      originalPrice: product.originalPrice,
      platform: product.platform,
      image: product.image,
      availableStock,
      game: product.game,
    };

    const res = addItem(cartProd, quantity);
    if (res.success) {
      router.push("/checkout");
    } else {
      setFeedback({ message: res.message || "Produto indisponível.", type: "error" });
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-theme-border/60">
      {/* Stock Status Indicator */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase text-theme-muted">Disponibilidade:</span>
        {isOutOfStock ? (
          <Badge variant="danger">Esgotado</Badge>
        ) : availableStock <= 3 ? (
          <Badge variant="warning">Últimas {availableStock} unidades</Badge>
        ) : (
          <Badge variant="success">Em Estoque ({availableStock} chaves)</Badge>
        )}
      </div>

      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono uppercase text-theme-muted">Quantidade:</span>
          <div className="flex items-center border border-theme-border rounded-xl bg-black/40 overflow-hidden">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-1 text-sm font-mono font-bold text-white">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(availableStock, q + 1))}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              : "bg-red-500/20 text-red-300 border border-red-500/40"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <Button
          size="lg"
          variant="secondary"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="gap-2 text-sm"
        >
          <ShoppingBag className="w-4 h-4 text-theme-primary" />
          Adicionar ao Carrinho
        </Button>

        <Button
          size="lg"
          variant="persona"
          disabled={isOutOfStock}
          onClick={handleBuyNow}
          className="gap-2 text-sm"
        >
          <Zap className="w-4 h-4" />
          Comprar Agora
        </Button>
      </div>
    </div>
  );
};
