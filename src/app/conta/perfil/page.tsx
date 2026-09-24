"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { User, ShieldCheck, Mail, Package, ShieldAlert, KeyRound, LogOut } from "lucide-react";

export default function ProfilePage() {
  const { user, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-theme-muted font-mono text-xs">
        Carregando informações do usuário...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-white">Sessão Expirada</h1>
        <p className="text-xs text-neutral-400">Faça login para acessar o seu perfil.</p>
        <Link href="/login">
          <Button variant="persona">Ir para Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: "Minha Conta" }, { label: "Perfil" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-theme-primary text-black font-black text-2xl flex items-center justify-center shadow-[0_0_20px_var(--theme-glow)]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black uppercase text-white font-display">
                {user.name}
              </h1>
              {user.role === "ADMIN" && (
                <Badge variant="danger" className="text-[10px]">
                  Admin
                </Badge>
              )}
            </div>
            <p className="text-xs font-mono text-theme-muted">{user.email}</p>
          </div>
        </div>

        <Button variant="ghost" onClick={() => logout()} className="text-red-400 gap-1.5 self-start sm:self-auto">
          <LogOut className="w-4 h-4" />
          Encerrar Sessão
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Verification Status Card */}
        <div className="p-6 rounded-2xl bg-theme-surface/70 border border-theme-border/80 backdrop-blur-md space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-white">Status da Conta</h3>
          <div className="pt-1">
            {user.emailVerified ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-mono">
                <ShieldCheck className="w-4 h-4" />
                E-mail Verificado
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold font-mono">
                E-mail Não Confirmado
              </span>
            )}
          </div>
          <p className="text-[11px] text-neutral-400">
            Sua conta tem permissão total para compra e resgate de chaves Steam.
          </p>
        </div>

        {/* Orders Card Shortcut */}
        <div className="p-6 rounded-2xl bg-theme-surface/70 border border-theme-border/80 backdrop-blur-md space-y-3 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-theme-primary/10 flex items-center justify-center text-theme-primary mb-3">
              <Package className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Pedidos & Chaves Steam</h3>
            <p className="text-[11px] text-neutral-400 mt-1">
              Visualize suas chaves digitais compradas e histórico de transações.
            </p>
          </div>
          <Link href="/conta/pedidos" className="pt-2">
            <Button size="sm" variant="secondary" className="w-full">
              Ver Meus Pedidos
            </Button>
          </Link>
        </div>

        {/* Admin Card if Applicable */}
        {user.role === "ADMIN" && (
          <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/40 backdrop-blur-md space-y-3 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 mb-3">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-white">Acesso Administrativo</h3>
              <p className="text-[11px] text-neutral-300 mt-1">
                Você possui privilégios de gestão de produtos, estoque e pedidos.
              </p>
            </div>
            <Link href="/admin/dashboard" className="pt-2">
              <Button size="sm" variant="danger" className="w-full">
                Abrir Painel Admin
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
