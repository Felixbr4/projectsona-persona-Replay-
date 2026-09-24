"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  KeyRound,
  ShieldCheck,
  Copy,
  Check,
  Lock,
  ArrowLeft,
  Monitor,
  AlertCircle,
  Clock,
} from "lucide-react";

interface OrderDetail {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  notes?: string | null;
  user: { name: string; email: string };
  payment?: {
    method: string;
    status: string;
    paidAt?: string | null;
    transactionRef?: string | null;
  } | null;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    product: {
      id: string;
      name: string;
      platform: string;
      edition: string;
      image?: string | null;
      game: { name: string; slug: string; theme: string };
    };
    digitalKey?: {
      id: string;
      status: string;
      viewedAt?: string | null;
    } | null;
  }>;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Armazenamento de chaves descriptografadas por itemId
  const [revealedKeys, setRevealedKeys] = useState<Record<string, string>>({});
  const [revealingId, setRevealingId] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (res.ok) {
          setOrder(data.order);
        } else {
          setError(data.error || "Não foi possível carregar o pedido.");
        }
      } catch {
        setError("Erro de rede ao carregar pedido.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleRevealKey = async (orderItemId: string) => {
    setRevealingId(orderItemId);
    try {
      const res = await fetch("/api/orders/reveal-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderItemId }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRevealedKeys((prev) => ({
          ...prev,
          [orderItemId]: data.keyData.steamKey,
        }));
      } else {
        alert(data.error || "Erro ao descriptografar chave.");
      }
    } catch {
      alert("Erro ao conectar com o servidor.");
    } finally {
      setRevealingId(null);
    }
  };

  const handleCopyKey = (key: string, itemId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(itemId);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-theme-muted font-mono text-xs">
        Carregando detalhes do pedido...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">Pedido não encontrado</h2>
        <p className="text-xs text-neutral-400">{error || "Verifique o link informado."}</p>
        <Link href="/conta/pedidos">
          <Button variant="secondary">Voltar para Meus Pedidos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs
        items={[
          { label: "Minha Conta", href: "/conta/perfil" },
          { label: "Pedidos", href: "/conta/pedidos" },
          { label: order.orderNumber },
        ]}
      />

      {/* Top Order Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-theme-surface/80 border border-theme-border/80 backdrop-blur-md shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-display">
              {order.orderNumber}
            </h1>
            {order.status === "COMPLETED" || order.status === "PAID" ? (
              <Badge variant="success">Pago & Concluído</Badge>
            ) : (
              <Badge variant="warning">{order.status}</Badge>
            )}
          </div>
          <p className="text-xs font-mono text-neutral-400">
            Realizado em {new Date(order.createdAt).toLocaleDateString("pt-BR")} às{" "}
            {new Date(order.createdAt).toLocaleTimeString("pt-BR")}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-mono uppercase text-theme-muted block">Valor Total</span>
          <span className="text-3xl font-black text-theme-primary font-mono">
            R$ {order.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Chaves Steam Compradas - Protected Reveal Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-theme-primary" />
          <h2 className="text-xl font-black uppercase italic tracking-tight text-white font-display">
            Chaves Digitais Steam Adquiridas
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {order.items.map((item) => {
            const isRevealed = Boolean(revealedKeys[item.id]);
            const revealedCode = revealedKeys[item.id];
            const isCopying = copiedKey === item.id;

            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl bg-black/60 border-2 border-theme-border/80 hover:border-theme-primary/50 transition-all space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-theme-primary block">
                      {item.product.game.name} • {item.product.platform}
                    </span>
                    <h3 className="text-lg font-black text-white">{item.product.name}</h3>
                  </div>

                  <span className="text-xs font-mono text-neutral-400">
                    Preço pago: R$ {item.unitPrice.toFixed(2)}
                  </span>
                </div>

                {/* Secure Key Vault Box */}
                <div className="p-4 rounded-xl bg-neutral-950 border border-theme-border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="p-2.5 bg-theme-primary/10 rounded-lg text-theme-primary flex-shrink-0">
                      <Lock className="w-5 h-5" />
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-theme-muted block">
                        Código Steam (AES-256 Criptografado):
                      </span>
                      {isRevealed ? (
                        <span className="text-lg sm:text-xl font-mono font-black text-emerald-400 tracking-wider select-all animate-fade-in">
                          {revealedCode}
                        </span>
                      ) : (
                        <span className="text-lg font-mono text-neutral-600 tracking-widest">
                          ••••-••••-••••-••••
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reveal & Copy Buttons */}
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {isRevealed ? (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleCopyKey(revealedCode, item.id)}
                        className="gap-1.5 w-full sm:w-auto text-xs"
                      >
                        {isCopying ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopying ? "Copiado!" : "Copiar Chave"}</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="persona"
                        isLoading={revealingId === item.id}
                        onClick={() => handleRevealKey(item.id)}
                        className="gap-1.5 w-full sm:w-auto text-xs"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Revelar Chave Steam</span>
                      </Button>
                    )}
                  </div>
                </div>

                {item.digitalKey?.viewedAt && (
                  <p className="text-[10px] font-mono text-neutral-500">
                    👁️ Registro de auditoria: chave descriptografada e visualizada em{" "}
                    {new Date(item.digitalKey.viewedAt).toLocaleDateString("pt-BR")}.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Steam Activation Tutorial Box */}
      <div className="p-6 rounded-2xl bg-theme-surface/50 border border-theme-border/80 space-y-3">
        <h3 className="text-sm font-black uppercase text-white tracking-wide flex items-center gap-2">
          <Monitor className="w-4 h-4 text-theme-primary" />
          Como Ativar na Sua Conta Steam
        </h3>
        <p className="text-xs text-neutral-300 leading-relaxed">
          1. Copie o código revelado acima • 2. No menu superior da Steam clique em <strong>Jogos ➔ Ativar um produto no Steam...</strong> • 3. Cole a chave e confirme. O jogo será ativado instantaneamente.
        </p>
      </div>

      <div className="pt-2">
        <Link href="/conta/pedidos">
          <Button variant="ghost" className="gap-2 text-xs text-neutral-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Histórico de Pedidos
          </Button>
        </Link>
      </div>
    </div>
  );
}
