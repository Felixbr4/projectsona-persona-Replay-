"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lock, Mail, AlertCircle, KeyRound, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      router.push("/conta/perfil");
      router.refresh();
    } else {
      setError(res.message || "Erro ao conectar.");
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-theme-surface/80 border border-theme-border/80 rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center text-theme-primary mx-auto shadow-[0_0_15px_var(--theme-glow)]">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-white font-display">
            Acessar ProjecSona
          </h1>
          <p className="text-xs text-theme-muted font-mono">
            Entre para gerenciar suas compras, ver chaves Steam e acompanhar pedidos.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs font-bold text-red-300 flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="E-mail de Acesso"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu.email@exemplo.com"
            required
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-theme-muted">
                Senha
              </label>
              <Link
                href="/esqueci-senha"
                className="text-xs text-theme-primary hover:underline font-mono"
              >
                Esqueci a senha
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 bg-black/40 text-theme-text border border-theme-border rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            variant="persona"
            isLoading={isLoading}
            className="w-full text-sm"
          >
            Entrar na Plataforma
          </Button>
        </form>

        {/* Quick Demo Shortcuts */}
        <div className="pt-4 border-t border-theme-border/60 space-y-2">
          <p className="text-[11px] font-mono text-neutral-400 text-center uppercase tracking-wider">
            Atalhos para Demonstração Rápida:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin("ren.amamiya@projecsona.com", "userpassword123")}
              className="p-2 text-left bg-black/40 hover:bg-theme-primary/10 border border-theme-border hover:border-theme-primary/50 rounded-xl text-[11px] text-neutral-300 hover:text-white transition-all"
            >
              <strong className="block text-theme-primary">Cliente Demo</strong>
              <span className="font-mono text-[10px]">ren.amamiya@...</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin("admin@projecsona.com", "adminpassword123")}
              className="p-2 text-left bg-black/40 hover:bg-red-500/10 border border-theme-border hover:border-red-500/50 rounded-xl text-[11px] text-neutral-300 hover:text-white transition-all"
            >
              <strong className="block text-red-400">Admin (Igor)</strong>
              <span className="font-mono text-[10px]">admin@projecsona...</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-neutral-400">
          Ainda não possui uma conta?{" "}
          <Link href="/cadastro" className="text-theme-primary font-bold hover:underline">
            Cadastre-se gratuitamente
          </Link>
        </div>
      </div>
    </div>
  );
}
