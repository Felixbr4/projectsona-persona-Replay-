"use client";

import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShoppingBag, CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const json = await res.json();
      setOrders(json.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black uppercase text-white font-display">
          Gerenciamento de Pedidos
        </h1>
        <p className="text-xs text-neutral-400 font-mono">
          Consulte o histórico de vendas, dados dos compradores e altere status de pedidos.
        </p>
      </div>

      {isLoading ? (
        <div className="p-16 text-center text-neutral-400 font-mono text-xs">
          Carregando pedidos...
        </div>
      ) : orders.length === 0 ? (
        <div className="p-16 text-center rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono text-xs">
          Nenhum pedido registrado no sistema até o momento.
        </div>
      ) : (
        <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-neutral-800 bg-neutral-950/60 text-[10px] uppercase text-neutral-400">
                  <th className="py-4 px-6">Nº Pedido / Data</th>
                  <th className="py-4 px-4">Comprador</th>
                  <th className="py-4 px-4">Itens</th>
                  <th className="py-4 px-4">Valor Total</th>
                  <th className="py-4 px-4">Pagamento</th>
                  <th className="py-4 px-4">Status do Pedido</th>
                  <th className="py-4 px-6 text-right">Alterar Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-bold text-white text-sm block font-sans">
                        {ord.orderNumber}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {new Date(ord.createdAt).toLocaleDateString("pt-BR")} às{" "}
                        {new Date(ord.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-bold text-neutral-200 block font-sans">
                        {ord.user?.name}
                      </span>
                      <span className="text-[10px] text-neutral-500">{ord.user?.email}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="max-w-[200px] truncate text-neutral-300">
                        {ord.items.map((i: any) => i.product.name).join(", ")}
                      </div>
                      <span className="text-[10px] text-neutral-500">
                        {ord.items.length} item(s)
                      </span>
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-400 text-sm">
                      R$ {ord.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-neutral-300 block">{ord.payment?.method || "PIX"}</span>
                      <span
                        className={`text-[10px] ${
                          ord.payment?.status === "APPROVED" ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {ord.payment?.status || "PENDING"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.status === "COMPLETED"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : ord.status === "CANCELLED"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={ord.status}
                        disabled={updatingId === ord.id}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        className="px-2.5 py-1 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:ring-1 focus:ring-red-500 focus:outline-none"
                      >
                        <option value="COMPLETED">COMPLETED (Concluído)</option>
                        <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="CANCELLED">CANCELLED (Cancelado)</option>
                        <option value="REFUNDED">REFUNDED (Reembolsado)</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
