"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { KeyRound, Mail, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ message: string; devToken?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        setSuccessInfo({
          message: data.message,
          devToken: data.devToken,
        });
      } else {
        setError(data.error || "Erro ao solicitar recuperação.");
      }
    } catch {
      setIsLoading(false);
      setError("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-theme-surface/80 border border-theme-border/80 rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center text-theme-primary mx-auto shadow-[0_0_15px_var(--theme-glow)]">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-white font-display">
            Recuperar Senha
          </h1>
          <p className="text-xs text-theme-muted font-mono">
            Informe seu e-mail para receber um link seguro de redefinição.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs font-bold text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successInfo ? (
          <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-4 text-center animate-fade-in">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <p className="text-xs text-neutral-300 leading-relaxed">{successInfo.message}</p>

            {successInfo.devToken && (
              <div className="p-3 bg-black/60 rounded-xl border border-dashed border-emerald-500/50 space-y-2 text-left">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                  🛠️ Link direto de desenvolvimento:
                </span>
                <Link
                  href={`/redefinir-senha?token=${successInfo.devToken}`}
                  className="block text-center py-2 px-3 bg-emerald-500 text-black font-black text-xs uppercase rounded-lg hover:bg-emerald-400 transition-colors"
                >
                  Redefinir Senha Imediatamente
                </Link>
              </div>
            )}

            <Link href="/login" className="block text-xs text-theme-primary font-bold hover:underline pt-2">
              Voltar para o Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail da sua Conta"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              required
            />

            <Button
              type="submit"
              size="lg"
              variant="persona"
              isLoading={isLoading}
              className="w-full text-sm"
            >
              Enviar Link de Recuperação
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-neutral-400">
          Lembrou da senha?{" "}
          <Link href="/login" className="text-theme-primary font-bold hover:underline">
            Voltar ao login
          </Link>
        </div>
      </div>
    </div>
  );
}
