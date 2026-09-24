"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, total, itemsCount } = useCart();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: "Carrinho de Compras" }]} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-theme-primary/10 rounded-xl text-theme-primary">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tight text-white font-display">
              Meu Carrinho
            </h1>
            <p className="text-xs text-theme-muted font-mono">
              {itemsCount} {itemsCount === 1 ? "item selecionado" : "itens selecionados"}
            </p>
          </div>
        </div>

        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-neutral-400 hover:text-red-400 transition-colors font-mono"
          >
            Limpar Carrinho
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-theme-surface/50 border border-theme-border/80 space-y-4">
          <div className="w-16 h-16 rounded-full bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center text-theme-primary mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Seu carrinho está vazio</h2>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Explore os melhores jogos da franquia Persona e adicione suas edições favoritas para concluir a compra.
          </p>
          <div className="pt-2">
            <Link href="/catalogo">
              <Button size="lg" variant="persona" className="gap-2">
                Explorar Catálogo
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl border border-theme-border/80 bg-theme-surface/70 backdrop-blur-md overflow-hidden shadow-2xl">
              <div className="divide-y divide-theme-border/40">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
                  >
                    {/* Image & Title */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-20 sm:w-24 aspect-[16/9] rounded-xl overflow-hidden bg-neutral-900 border border-theme-border flex-shrink-0">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] font-mono text-neutral-500">
                            P-KEY
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase font-bold text-theme-primary">
                          {item.product.platform} • {item.product.edition}
                        </span>
                        <Link
                          href={`/produtos/${item.product.slug}`}
                          className="font-bold text-sm text-white hover:text-theme-primary transition-colors block line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs font-mono text-neutral-400">
                          R$ {item.product.price.toFixed(2)} un.
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Subtotal Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-theme-border/40">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-theme-border rounded-xl bg-black/50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-2 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right min-w-[90px]">
                        <span className="text-base font-black text-theme-primary font-mono block">
                          R$ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                        title="Remover do carrinho"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <Link
                href="/catalogo"
                className="text-theme-primary font-bold hover:underline font-mono uppercase flex items-center gap-1.5"
              >
                ← Continuar Comprando
              </Link>
              <span className="text-neutral-400 font-mono text-[11px]">
                Preços válidos por tempo limitado enquanto durarem os lotes de chaves.
              </span>
            </div>
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-6 rounded-2xl border border-theme-border/80 bg-theme-surface/70 backdrop-blur-md space-y-6 shadow-2xl">
              <h2 className="text-lg font-black uppercase text-white font-display tracking-tight border-b border-theme-border/60 pb-3">
                Resumo do Pedido
              </h2>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between text-neutral-300">
                  <span>Subtotal ({itemsCount} itens):</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Entrega Digital Imediata:</span>
                  <span>GRÁTIS</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Taxas & Criptografia:</span>
                  <span>R$ 0,00</span>
                </div>

                <div className="border-t border-theme-border/60 pt-4 flex justify-between items-baseline text-white font-sans">
                  <span className="text-base font-black uppercase">Total:</span>
                  <span className="text-2xl font-black text-theme-primary font-mono">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="block">
                <Button size="lg" variant="persona" className="w-full gap-2 text-sm">
                  <span>Finalizar Compra</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <div className="space-y-2 pt-2 text-[11px] text-neutral-400 font-mono">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-theme-primary" />
                  <span>Chaves liberadas no painel da conta</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-theme-primary" />
                  <span>Pagamento seguro via PIX ou Cartão</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
