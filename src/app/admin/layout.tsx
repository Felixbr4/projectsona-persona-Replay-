"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Package,
  KeyRound,
  ShoppingBag,
  TrendingUp,
  ShieldAlert,
  ArrowLeft,
  Users,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-mono text-xs text-theme-muted">
        Verificando credenciais de administrador...
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500" />
        <h1 className="text-xl font-bold text-white">Acesso Restrito</h1>
        <p className="text-xs text-neutral-400 max-w-sm">
          Esta área é restrita a administradores do ProjecSona. Faça login com uma conta administrativa.
        </p>
        <Link href="/login" className="text-xs font-bold text-theme-primary hover:underline">
          Ir para Login Admin
        </Link>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Produtos", href: "/admin/produtos", icon: Package },
    { label: "Estoque & Chaves", href: "/admin/estoque", icon: KeyRound },
    { label: "Pedidos", href: "/admin/pedidos", icon: ShoppingBag },
    { label: "Ofertas Externas", href: "/admin/ofertas", icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#070609] text-white">
      {/* Admin Top Header Banner */}
      <div className="bg-red-950/40 border-b border-red-500/30 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400" />
          <span className="font-mono font-bold text-xs text-red-300 uppercase tracking-wider">
            PAINEL ADMINISTRATIVO • PROJECSONA VELVET CONTROL
          </span>
        </div>
        <Link
          href="/"
          className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para a Loja</span>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Admin Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-800">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-base flex items-center justify-center">
                A
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-xs truncate">{user.name}</p>
                <span className="text-[10px] font-mono text-red-400">ADMINISTRADOR</span>
              </div>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? "bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/60"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Admin Area */}
        <main className="lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
