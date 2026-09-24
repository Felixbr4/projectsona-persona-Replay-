"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Package, ArrowRight, CheckCircle2, Clock, XCircle, KeyRound } from "lucide-react";

interface OrderSummary {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      platform: string;
      image?: string | null;
      game?: { name: string; theme: string };
    };
    digitalKey?: {
      id: string;
      status: string;
      viewedAt?: string | null;
    } | null;
  }>;
  payment?: {
    method: string;
    status: string;
  } | null;
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (e) {
        console.error("Erro ao carregar pedidos:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "PAID":
        return <Badge variant="success">Concluído (Pago)</Badge>;
      case "PENDING_PAYMENT":
        return <Badge variant="warning">Aguardando Pagamento</Badge>;
      case "CANCELLED":
        return <Badge variant="danger">Cancelado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: "Minha Conta", href: "/conta/perfil" }, { label: "Meus Pedidos" }]} />

      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-theme-primary/10 rounded-xl text-theme-primary">
          <Package className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase italic tracking-tight text-white font-display">
            Histórico de Pedidos & Chaves
          </h1>
          <p className="text-xs text-theme-muted font-mono">
            Acesse suas compras para visualizar ou resgatar chaves Steam vinculadas.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-theme-muted font-mono text-xs">
          Carregando seus pedidos...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-theme-surface/50 border border-theme-border/80 space-y-4">
          <Package className="w-12 h-12 text-neutral-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">Nenhum pedido realizado ainda</h2>
          <p className="text-xs text-neutral-400">
            Você ainda não realizou compras na ProjecSona. Explore nosso catálogo de edições Persona.
          </p>
          <div className="pt-2">
            <Link href="/catalogo">
              <Button variant="persona">Explorar Catálogo</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-theme-border/80 bg-theme-surface/70 backdrop-blur-md p-6 space-y-4 hover:border-theme-primary/50 transition-all shadow-xl"
            >
              {/* Top Header of the Order */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-theme-border/60">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-white">
                    {order.orderNumber}
                  </span>
                  {getStatusBadge(order.status)}
                </div>
                <div className="text-xs font-mono text-neutral-400">
                  Data: {new Date(order.createdAt).toLocaleDateString("pt-BR")} às{" "}
                  {new Date(order.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              {/* Items Summary Preview */}
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-theme-border flex items-center justify-center font-mono text-[10px] text-theme-primary flex-shrink-0">
                        🔑
                      </div>
                      <div>
                        <p className="font-bold text-white">{item.product.name}</p>
                        <p className="text-[10px] font-mono text-neutral-400">
                          Plataforma: {item.product.platform}
                        </p>
                      </div>
                    </div>

                    {order.status === "COMPLETED" && (
                      <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 font-bold">
                        <KeyRound className="w-3.5 h-3.5" />
                        Chave Disponível
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Footer Action */}
              <div className="flex items-center justify-between pt-3 border-t border-theme-border/60">
                <div>
                  <span className="text-xs text-neutral-400 font-mono">Valor Total: </span>
                  <strong className="text-lg font-black text-theme-primary font-mono">
                    R$ {order.totalAmount.toFixed(2)}
                  </strong>
                </div>

                <Link href={`/conta/pedidos/${order.id}`}>
                  <Button size="sm" variant="persona" className="gap-1.5 text-xs">
                    <span>Ver Pedido & Chave Steam</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
