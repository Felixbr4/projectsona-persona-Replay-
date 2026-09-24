"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  CreditCard,
  QrCode,
  ShieldCheck,
  Zap,
  Lock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart, itemsCount } = useCart();
  const { user, login } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<"PIX" | "CREDIT_CARD" | "MOCK">("PIX");
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardHolder, setCardHolder] = useState("REN AMAMIYA");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("777");
  const [customerNotes, setCustomerNotes] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick login state if user is not logged in
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const res = await login(authEmail, authPass);
    if (!res.success) {
      setAuthError(res.message || "Erro no login.");
    }
  };

  const handleFillDemoUser = async () => {
    setAuthEmail("ren.amamiya@projecsona.com");
    setAuthPass("userpassword123");
    await login("ren.amamiya@projecsona.com", "userpassword123");
  };

  const handleProcessOrder = async () => {
    if (!user) {
      setError("Você precisa estar conectado à sua conta para finalizar.");
      return;
    }

    if (items.length === 0) {
      setError("Seu carrinho está vazio.");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
        payment: {
          paymentMethod,
          cardNumber: paymentMethod === "CREDIT_CARD" ? cardNumber : undefined,
          cardHolder: paymentMethod === "CREDIT_CARD" ? cardHolder : undefined,
          cardExpiry: paymentMethod === "CREDIT_CARD" ? cardExpiry : undefined,
          cardCvv: paymentMethod === "CREDIT_CARD" ? cardCvv : undefined,
          customerNotes,
        },
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok && data.success) {
        clearCart();
        // Redireciona para o detalhe do pedido para ver a chave Steam imediatamente
        router.push(`/conta/pedidos/${data.order.id}`);
      } else {
        setError(data.error || "Falha ao processar pagamento.");
      }
    } catch {
      setIsLoading(false);
      setError("Erro de rede ao processar pedido.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Carrinho Vazio</h1>
        <p className="text-xs text-neutral-400">Adicione produtos antes de ir para o checkout.</p>
        <Link href="/catalogo">
          <Button variant="persona">Ir para o Catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Carrinho", href: "/carrinho" },
          { label: "Finalizar Compra" },
        ]}
      />

      <div className="space-y-1">
        <h1 className="text-3xl font-black uppercase italic tracking-tight text-white font-display">
          Checkout & Pagamento Seguro
        </h1>
        <p className="text-xs text-theme-muted font-mono">
          Ambiente criptografado com liberação de chave Steam pós-confirmação.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-2xl text-xs font-bold text-red-300 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Auth & Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Identificação do Usuário */}
          <div className="p-6 rounded-2xl bg-theme-surface/70 border border-theme-border/80 backdrop-blur-md space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-theme-border/60 pb-3">
              <h2 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-theme-primary text-black font-mono text-xs flex items-center justify-center font-bold">
                  1
                </span>
                Identificação do Comprador
              </h2>
              {user && (
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  Conectado
                </span>
              )}
            </div>

            {user ? (
              <div className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-theme-border/60 text-xs">
                <div>
                  <p className="font-bold text-white">{user.name}</p>
                  <p className="font-mono text-neutral-400">{user.email}</p>
                </div>
                <span className="px-2 py-1 bg-white/5 border border-theme-border rounded text-[10px] font-mono text-theme-primary">
                  Sessão Ativa
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Para vincular a chave Steam à sua biblioteca, entre com sua conta ou utilize a conta de demonstração rápida:
                </p>

                {authError && (
                  <p className="text-xs text-red-400 font-bold">{authError}</p>
                )}

                <form onSubmit={handleQuickLogin} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="E-mail"
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    required
                  />
                  <Input
                    label="Senha"
                    type="password"
                    value={authPass}
                    onChange={(e) => setAuthPass(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <div className="sm:col-span-2 flex gap-2 pt-1">
                    <Button type="submit" size="sm" variant="primary">
                      Entrar e Prosseguir
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={handleFillDemoUser}
                    >
                      Autenticar como Usuário Demo (Ren Amamiya)
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* 2. Método de Pagamento */}
          <div className="p-6 rounded-2xl bg-theme-surface/70 border border-theme-border/80 backdrop-blur-md space-y-6 shadow-xl">
            <div className="border-b border-theme-border/60 pb-3">
              <h2 className="text-base font-black uppercase text-white tracking-wide flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-theme-primary text-black font-mono text-xs flex items-center justify-center font-bold">
                  2
                </span>
                Método de Pagamento
              </h2>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("PIX")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentMethod === "PIX"
                    ? "bg-theme-primary/15 border-theme-primary shadow-[0_0_20px_var(--theme-glow)] text-white"
                    : "bg-black/30 border-theme-border text-neutral-400 hover:text-white"
                }`}
              >
                <QrCode className="w-6 h-6 text-emerald-400" />
                <span className="font-bold text-xs uppercase">PIX (Imediato)</span>
                <span className="text-[10px] font-mono text-emerald-400">Ativação instantânea</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("CREDIT_CARD")}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                  paymentMethod === "CREDIT_CARD"
                    ? "bg-theme-primary/15 border-theme-primary shadow-[0_0_20px_var(--theme-glow)] text-white"
                    : "bg-black/30 border-theme-border text-neutral-400 hover:text-white"
                }`}
              >
                <CreditCard className="w-6 h-6 text-theme-primary" />
                <span className="font-bold text-xs uppercase">Cartão de Crédito</span>
                <span className="text-[10px] font-mono text-neutral-400">Até 12x sem juros</span>
              </button>
            </div>

            {/* Selected Method Details */}
            {paymentMethod === "PIX" && (
              <div className="p-5 rounded-xl bg-black/50 border border-theme-border/80 space-y-3 animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-white">Chave PIX Dinâmica Instantânea</p>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      O código QR será validado pelo gateway e a chave Steam é entregue em segundos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "CREDIT_CARD" && (
              <div className="space-y-3 p-5 rounded-xl bg-black/50 border border-theme-border/80 animate-fade-in">
                <Input
                  label="Número do Cartão"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="0000 0000 0000 0000"
                />
                <Input
                  label="Nome Impresso no Cartão"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  placeholder="NOME COMPLETO"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Validade (MM/AA)"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="12/28"
                  />
                  <Input
                    label="CVV"
                    type="password"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    placeholder="123"
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <Input
              label="Observações do Pedido (Opcional)"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              placeholder="Instruções ou referências adicionais..."
            />
          </div>
        </div>

        {/* Right Summary Box */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-2xl bg-theme-surface/80 border border-theme-border/80 backdrop-blur-md space-y-6 shadow-2xl">
            <h2 className="text-base font-black uppercase text-white tracking-wide border-b border-theme-border/60 pb-3">
              Itens a Comprar ({itemsCount})
            </h2>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-theme-border/40">
              {items.map((item) => (
                <div key={item.product.id} className="pt-2 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white line-clamp-1">{item.product.name}</p>
                    <p className="text-[10px] font-mono text-neutral-400">
                      Qtd: {item.quantity} × R$ {item.product.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-mono font-bold text-theme-primary ml-2">
                    R$ {(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-theme-border/60 pt-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal:</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Entrega Digital:</span>
                <span>Grátis (Instantânea)</span>
              </div>
              <div className="flex justify-between text-white font-sans font-black text-lg pt-2 border-t border-theme-border/40">
                <span>Total a Pagar:</span>
                <span className="text-theme-primary font-mono text-2xl">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              variant="persona"
              isLoading={isLoading}
              disabled={!user}
              onClick={handleProcessOrder}
              className="w-full text-base py-4"
            >
              <Lock className="w-4 h-4 mr-2" />
              Pagar e Liberar Chaves
            </Button>

            {!user && (
              <p className="text-[11px] text-amber-400 text-center font-mono">
                ⚠ Faça login no passo 1 acima para liberar o botão de pagamento.
              </p>
            )}

            <div className="pt-2 text-center text-[10px] text-neutral-500 font-mono">
              🔒 Transação criptografada com proteção anti-duplicação e estorno garantido.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
