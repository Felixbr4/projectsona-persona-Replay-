"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { UserPlus, CheckCircle2, AlertCircle, Sparkles, MailCheck } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ message: string; devToken?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas informadas não coincidem.");
      return;
    }

    setIsLoading(true);
    const res = await register(name, email, password, confirmPassword);
    setIsLoading(false);

    if (res.success) {
      setSuccessInfo({
        message: res.message || "Conta criada com sucesso!",
        devToken: res.user?.devVerificationToken,
      });
    } else {
      setError(res.message || "Erro ao registrar usuário.");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-theme-surface/80 border border-theme-border/80 rounded-3xl p-8 backdrop-blur-md shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-theme-primary/10 border border-theme-primary/30 flex items-center justify-center text-theme-primary mx-auto shadow-[0_0_15px_var(--theme-glow)]">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black uppercase italic tracking-tight text-white font-display">
            Criar Nova Conta
          </h1>
          <p className="text-xs text-theme-muted font-mono">
            Junte-se ao ProjecSona para comprar e acompanhar suas chaves Steam.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/40 rounded-xl text-xs font-bold text-red-300 flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successInfo ? (
          <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-4 text-center animate-fade-in">
            <MailCheck className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-base font-black text-white uppercase">
              Verificação de E-mail Enviada!
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Enviamos um link de ativação para <strong>{email}</strong>. Por favor, verifique seu e-mail para ativar sua conta.
            </p>

            {successInfo.devToken && (
              <div className="p-3 bg-black/60 rounded-xl border border-dashed border-emerald-500/50 space-y-2 text-left">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">
                  🛠️ Ambiente de Desenvolvimento (Ativação Rápida):
                </span>
                <Link
                  href={`/verificar-email?token=${successInfo.devToken}`}
                  className="block text-center py-2 px-3 bg-emerald-500 text-black font-black text-xs uppercase rounded-lg hover:bg-emerald-400 transition-colors"
                >
                  Confirmar E-mail Imediatamente
                </Link>
              </div>
            )}

            <div className="pt-2">
              <Link href="/login" className="text-xs text-theme-primary font-bold hover:underline">
                Ir para a tela de Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome Completo / Nickname"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Ren Amamiya"
              required
            />

            <Input
              label="Endereço de E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              required
            />

            <Input
              label="Senha de Acesso (Mínimo 6 dígitos)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Input
              label="Confirmar Senha"
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
              Criar Conta e Prosseguir
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-neutral-400">
          Já tem uma conta registrada?{" "}
          <Link href="/login" className="text-theme-primary font-bold hover:underline">
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}
