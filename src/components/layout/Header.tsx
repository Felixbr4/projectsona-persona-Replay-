"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/themes/ThemeProvider";
import { useGameTransition } from "@/components/transitions/TransitionManager";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  ShoppingBag,
  User,
  ShieldAlert,
  Menu,
  X,
  Sparkles,
  LogOut,
  Package,
  Layers,
} from "lucide-react";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { theme, velvetMode, toggleVelvetMode } = useTheme();
  const { navigateToGame } = useGameTransition();
  const { itemsCount } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const games = [
    { sigla: "P3R", name: "Persona 3 Reload", slug: "persona-3-reload", themeKey: "persona3" as const, color: "text-cyan-400 border-cyan-400/50 hover:bg-cyan-950/40" },
    { sigla: "P4R", name: "Persona 4 Revival", slug: "persona-4-revival", themeKey: "persona4" as const, color: "text-yellow-400 border-yellow-400/50 hover:bg-yellow-950/40" },
    { sigla: "P5R", name: "Persona 5 Royal", slug: "persona-5-royal", themeKey: "persona5" as const, color: "text-red-400 border-red-500/50 hover:bg-red-950/40" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-theme-bg/85 backdrop-blur-md border-b border-theme-border/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo Persona Replay */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src="/assets/images/logo.png"
            alt="Persona Replay"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <div>
            <span className="text-xl font-black tracking-wider uppercase text-white font-display">
              PERSONA <span className="text-theme-primary">REPLAY</span>
            </span>
            <span className="block text-[10px] font-mono tracking-widest text-theme-muted uppercase -mt-1">
              Loja Especializada Persona
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg text-sm font-bold tracking-wide transition-all ${
              pathname === "/"
                ? "text-theme-primary bg-theme-primary/10 border border-theme-primary/20"
                : "text-neutral-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Início
          </Link>

          {/* Seletor Rápido dos Jogos com Siglas Maiores e Visíveis */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-theme-surface/70 border border-theme-border rounded-xl">
            <span className="text-xs font-mono text-neutral-400 px-1 hidden xl:inline">JOGOS:</span>
            {games.map((g) => (
              <button
                key={g.slug}
                onClick={() => navigateToGame(g.slug, g.themeKey)}
                className={`px-3.5 py-1 text-base font-black tracking-wider uppercase rounded-lg border transition-all ${g.color} ${
                  theme === g.themeKey ? "bg-white/15 shadow-[0_0_12px_currentColor] scale-105" : "opacity-85 hover:opacity-100"
                }`}
                title={`Explorar ${g.name} com transição temática`}
              >
                <span>{g.sigla}</span>
              </button>
            ))}
          </div>

          <Link
            href="/catalogo"
            className={`px-3 py-2 rounded-lg text-sm font-bold tracking-wide transition-all ${
              pathname === "/catalogo"
                ? "text-theme-primary bg-theme-primary/10 border border-theme-primary/20"
                : "text-neutral-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Catálogo
          </Link>

          <Link
            href="/ofertas"
            className={`px-3 py-2 rounded-lg text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 ${
              pathname === "/ofertas"
                ? "text-theme-primary bg-theme-primary/10 border border-theme-primary/20"
                : "text-neutral-300 hover:text-white hover:bg-white/5"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-theme-primary" />
            Comparador
          </Link>
        </nav>

        {/* Right Actions (Velvet, Cart, User, Admin) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Controle Independente Velvet */}
          <button
            onClick={toggleVelvetMode}
            id="velvet-toggle-btn"
            className={`px-3 py-1.5 rounded-xl border text-xs font-black tracking-wider uppercase transition-all flex items-center gap-1.5 ${
              velvetMode
                ? "bg-blue-600 border-blue-300 text-white shadow-[0_0_15px_rgba(37,99,235,0.7)]"
                : "bg-theme-surface border-theme-border text-blue-400 hover:border-blue-400 hover:bg-blue-950/40"
            }`}
            title="Alternar paleta de cores Velvet Room"
            aria-pressed={velvetMode}
          >
            <span className={`w-2 h-2 rounded-full ${velvetMode ? "bg-white animate-ping" : "bg-blue-400"}`}></span>
            VELVET
          </button>

          {/* Carrinho */}
          <Link
            href="/carrinho"
            className="relative p-2.5 bg-theme-surface border border-theme-border rounded-xl text-neutral-200 hover:text-white hover:border-theme-primary/50 transition-all group"
            aria-label="Carrinho de Compras"
          >
            <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform text-theme-primary" />
            {itemsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-theme-primary text-black font-black text-xs rounded-full flex items-center justify-center shadow-[0_0_10px_var(--theme-glow)] animate-pulse">
                {itemsCount}
              </span>
            )}
          </Link>

          {/* User Account / Auth Dropdown */}
          <div className="relative">
            {user ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-theme-surface border border-theme-border rounded-xl text-sm font-bold text-neutral-200 hover:border-theme-primary transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-theme-primary text-black flex items-center justify-center text-xs font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-theme-surface border border-theme-border rounded-xl shadow-2xl py-2 z-50 animate-fade-in"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-theme-border/60">
                      <p className="text-xs font-bold text-white truncate">{user.name}</p>
                      <p className="text-[11px] font-mono text-theme-muted truncate">{user.email}</p>
                      {user.role === "ADMIN" && (
                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-red-600/30 text-red-400 text-[10px] font-bold rounded">
                          ADMINISTRADOR
                        </span>
                      )}
                    </div>

                    <Link
                      href="/conta/perfil"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-white/5 hover:text-white"
                    >
                      <User className="w-4 h-4 text-theme-primary" />
                      Meu Perfil
                    </Link>

                    <Link
                      href="/conta/pedidos"
                      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-white/5 hover:text-white"
                    >
                      <Package className="w-4 h-4 text-theme-primary" />
                      Meus Pedidos & Chaves
                    </Link>

                    {user.role === "ADMIN" && (
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/10"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Painel Admin
                      </Link>
                    )}

                    <div className="border-t border-theme-border/60 my-1" />

                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair da Conta
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-xs font-bold text-white hover:text-theme-primary transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  href="/cadastro"
                  className="px-3.5 py-2 bg-theme-primary text-black font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-[0_0_15px_var(--theme-glow)] hover:bg-theme-primary-hover transition-all"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-300 hover:text-white rounded-lg hover:bg-white/5"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-theme-surface border-b border-theme-border px-4 py-6 space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-white hover:bg-white/5"
            >
              Início
            </Link>
            <Link
              href="/catalogo"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-white hover:bg-white/5"
            >
              Catálogo Completo
            </Link>
            <Link
              href="/ofertas"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-bold text-white hover:bg-white/5"
            >
              Comparador de Preços
            </Link>
          </div>

          <div className="pt-4 border-t border-theme-border/60">
            <p className="text-xs font-mono uppercase text-theme-muted mb-2">Jogos Temáticos:</p>
            <div className="grid grid-cols-1 gap-2">
              {games.map((g) => (
                <button
                  key={g.slug}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigateToGame(g.slug, g.themeKey);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-xs font-bold uppercase ${g.color}`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
