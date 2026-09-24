"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Validando token de verificação...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Nenhum token de verificação foi fornecido.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage(data.message || "E-mail confirmado com sucesso!");
        } else {
          setStatus("error");
          setMessage(data.error || "Token inválido ou expirado.");
        }
      } catch {
        setStatus("error");
        setMessage("Erro de conexão ao verificar e-mail.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="w-full max-w-md bg-theme-surface/80 border border-theme-border/80 rounded-3xl p-8 backdrop-blur-md shadow-2xl text-center space-y-6">
      {status === "loading" && (
        <div className="space-y-4 py-8">
          <Loader2 className="w-12 h-12 text-theme-primary animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-white">Verificando sua conta...</h2>
          <p className="text-xs text-theme-muted font-mono">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div className="space-y-4 py-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tight text-white font-display">
            Conta Verificada!
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">{message}</p>
          <div className="pt-4">
            <Link href="/login">
              <Button size="lg" variant="persona" className="w-full">
                Fazer Login Agora
              </Button>
            </Link>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="space-y-4 py-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black uppercase italic tracking-tight text-white font-display">
            Falha na Verificação
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed">{message}</p>
          <div className="pt-4 flex gap-3">
            <Link href="/login" className="flex-1">
              <Button size="md" variant="secondary" className="w-full">
                Ir para Login
              </Button>
            </Link>
            <Link href="/cadastro" className="flex-1">
              <Button size="md" variant="primary" className="w-full">
                Novo Cadastro
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="text-center font-mono text-xs text-theme-muted">
            Carregando...
          </div>
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
