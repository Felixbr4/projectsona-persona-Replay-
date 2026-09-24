"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import {
  DollarSign,
  ShoppingBag,
  Package,
  KeyRound,
  Users,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Erro ao carregar métricas admin:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (isLoading || !data) {
    return (
      <div className="p-16 text-center text-neutral-400 font-mono text-xs">
        Carregando métricas administrativas...
      </div>
    );
  }

  const { stats, recentOrders, recentUsers } = data;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white font-display">
            Dashboard Geral
          </h1>
          <p className="text-xs text-neutral-400 font-mono">
            Visão consolidada de receitas, pedidos, usuários e estoque de chaves Steam.
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Receita Total */}
        <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Receita Aprovada</span>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">
            R$ {stats.totalRevenue.toFixed(2)}
          </p>
          <span className="text-[10px] text-neutral-500 font-mono">Pedidos com status Concluído</span>
        </div>

        {/* Total de Pedidos */}
        <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Total de Pedidos</span>
            <ShoppingBag className="w-5 h-5 text-theme-primary" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{stats.totalOrders}</p>
          <span className="text-[10px] text-neutral-500 font-mono">Transações registradas</span>
        </div>

        {/* Chaves no Estoque */}
        <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Chaves Steam</span>
            <KeyRound className="w-5 h-5 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-400 font-mono">
            {stats.keys.available} <span className="text-xs text-neutral-400 font-normal">disponíveis</span>
          </p>
          <span className="text-[10px] text-neutral-500 font-mono">{stats.keys.sold} chaves vendidas</span>
        </div>

        {/* Usuários Cadastrados */}
        <div className="p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-mono uppercase">Base de Usuários</span>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{stats.totalUsers}</p>
          <span className="text-[10px] text-neutral-500 font-mono">Contas ativas</span>
        </div>
      </div>

      {/* Alerta de Produtos Esgotados se Houver */}
      {stats.outOfStockProducts > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">Alerta de Reposição de Estoque</p>
              <p className="text-[11px] text-neutral-300 font-mono">
                Existem {stats.outOfStockProducts} produto(s) com 0 chaves disponíveis no momento.
              </p>
            </div>
          </div>
          <Link href="/admin/estoque">
            <span className="text-xs font-mono font-bold text-amber-400 hover:underline">
              Adicionar Chaves →
            </span>
          </Link>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black uppercase text-white font-display">
            Vendas & Pedidos Recentes
          </h2>
          <Link
            href="/admin/pedidos"
            className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-[10px] font-mono uppercase text-neutral-400">
                <th className="pb-3">Nº Pedido</th>
                <th className="pb-3">Comprador</th>
                <th className="pb-3">Itens</th>
                <th className="pb-3">Valor</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono">
              {recentOrders.map((ord: any) => (
                <tr key={ord.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="py-3 font-bold text-white">{ord.orderNumber}</td>
                  <td className="py-3 text-neutral-300">{ord.user?.name || ord.user?.email}</td>
                  <td className="py-3 text-neutral-400">{ord.items.length} item(s)</td>
                  <td className="py-3 font-bold text-emerald-400">
                    R$ {ord.totalAmount.toFixed(2)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ord.status === "COMPLETED"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 text-right text-neutral-500">
                    {new Date(ord.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
