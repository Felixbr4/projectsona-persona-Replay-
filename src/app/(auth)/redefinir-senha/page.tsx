"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { KeyRound, CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        setIsSuccess(true);
      } else {
        setError(data.error || "Erro ao redefinir senha.");
      }
    } catch {
      setIsLoading(false);
      setError("Erro ao conectar ao servidor.");
    }
  };

  return (
    <div className="w-full max-w-md bg-theme-surface/80 border border-theme-border/80 rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center text-theme-primary mx-auto shadow-[0_0_15px_var(--theme-glow)]">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black uppercase italic tracking-tight text-white font-display">
          Nova Senha de Acesso
        </h1>
        <p className="text-xs text-theme-muted font-mono">
          Defina uma nova senha segura para sua conta.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs font-bold text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-4 text-center animate-fade-in">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-black text-white uppercase">
            Senha Alterada com Sucesso!
          </h3>
          <p className="text-xs text-neutral-300">
            Sua senha foi redefinida com segurança. Você já pode fazer login.
          </p>
          <div className="pt-2">
            <Link href="/login">
              <Button size="lg" variant="persona" className="w-full">
                Fazer Login com Nova Senha
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nova Senha (Mínimo 6 caracteres)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Input
            label="Confirmar Nova Senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            size="lg"
            variant="persona"
            isLoading={isLoading}
            className="w-full text-sm"
          >
            Salvar Nova Senha
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="text-center font-mono text-xs text-theme-muted">
            Carregando...
          </div>
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
