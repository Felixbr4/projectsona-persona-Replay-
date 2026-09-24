import React from "react";
import Link from "next/link";
import { ShieldCheck, Zap, Lock, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-theme-bg border-t border-theme-border/60 transition-colors duration-300">
      {/* Value Badges Banner */}
      <div className="border-b border-theme-border/40 py-8 bg-theme-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-theme-surface/50 border border-theme-border/60">
            <div className="p-3 bg-theme-primary/10 rounded-lg text-theme-primary">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Entrega Imediata</h4>
              <p className="text-xs text-theme-muted">Chaves Steam oficiais prontas para ativação logo após o pagamento.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-theme-surface/50 border border-theme-border/60">
            <div className="p-3 bg-theme-primary/10 rounded-lg text-theme-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Chaves 100% Autênticas</h4>
              <p className="text-xs text-theme-muted">Estoque direto com criptografia de ponta e controle anti-duplicação.</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-theme-surface/50 border border-theme-border/60">
            <div className="p-3 bg-theme-primary/10 rounded-lg text-theme-primary">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">Comparador Transparente</h4>
              <p className="text-xs text-theme-muted">Identifique sempre a melhor oferta entre as principais lojas autorizadas.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎭</span>
              <span className="font-display font-black text-xl text-white uppercase tracking-wider">
                PROJEC<span className="text-theme-primary">SONA</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              A plataforma definitiva para fãs e jogadores da franquia Persona. Compre chaves digitais seguras e compare preços com transparência.
            </p>
          </div>

          {/* Jogos */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase text-theme-primary mb-4 tracking-widest">
              Jogos da Franquia
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/jogos/persona-3-reload" className="text-neutral-400 hover:text-cyan-400 transition-colors">
                  Persona 3 Reload (Dark Hour)
                </Link>
              </li>
              <li>
                <Link href="/jogos/persona-4-revival" className="text-neutral-400 hover:text-yellow-400 transition-colors">
                  Persona 4 Revival (TV World)
                </Link>
              </li>
              <li>
                <Link href="/jogos/persona-5-royal" className="text-neutral-400 hover:text-red-400 transition-colors">
                  Persona 5 Royal (Phantom Thieves)
                </Link>
              </li>
            </ul>
          </div>

          {/* Navegação */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase text-theme-primary mb-4 tracking-widest">
              Navegação Rápida
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/catalogo" className="text-neutral-400 hover:text-white transition-colors">
                  Catálogo de Edições
                </Link>
              </li>
              <li>
                <Link href="/ofertas" className="text-neutral-400 hover:text-white transition-colors">
                  Comparador de Ofertas
                </Link>
              </li>
              <li>
                <Link href="/carrinho" className="text-neutral-400 hover:text-white transition-colors">
                  Meu Carrinho
                </Link>
              </li>
              <li>
                <Link href="/conta/pedidos" className="text-neutral-400 hover:text-white transition-colors">
                  Minhas Chaves Digitais
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Suporte */}
          <div>
            <h5 className="text-xs font-mono font-bold uppercase text-theme-primary mb-4 tracking-widest">
              Segurança & Suporte
            </h5>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              Ambiente de demonstração Full-Stack acadêmico/profissional. Todos os direitos reservados às respectivas marcas ATLUS / SEGA.
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-white/5 border border-theme-border rounded text-[10px] font-mono text-neutral-400">
                SSL 256-Bit
              </span>
              <span className="px-2 py-1 bg-white/5 border border-theme-border rounded text-[10px] font-mono text-neutral-400">
                Next.js 14
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-theme-border/40 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} ProjecSona Marketplace. Desenvolvido com paixão pela franquia Persona.</p>
          <div className="flex items-center gap-1 mt-2 sm:mt-0">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>and Next.js Full-Stack</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
