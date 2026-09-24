import React from "react";
import { Swords, HeartHandshake, Eye, Sparkles } from "lucide-react";

interface GameMechanicsProps {
  theme: string;
}

export const GameMechanics: React.FC<GameMechanicsProps> = ({ theme }) => {
  const mechanicsByTheme: Record<string, Array<{ title: string; desc: string; icon: any }>> = {
    persona3: [
      {
        title: "Invocação via Evoker",
        desc: "Dispare o Evoker contra a própria têmpora para confrontar o medo da morte e manifestar o poder avassalador da sua Persona.",
        icon: Swords,
      },
      {
        title: "A Torre Tártaro",
        desc: "Explore centenas de andares gerados proceduralmente durante a Meia-Noite com chefes desafiadores e tesouros lendários.",
        icon: Eye,
      },
      {
        title: "Theurgias & Relógio",
        desc: "Ataques supremos desbloqueados pela harmonia emocional de cada membro do esquadrão SEES durante o combate em turnos.",
        icon: Sparkles,
      },
      {
        title: "Social Links (Vínculos)",
        desc: "Construa laços com colegas e cidadãos durante o dia para fortalecer a fusão de Personas no Velvet Room com Elizabeth.",
        icon: HeartHandshake,
      },
    ],
    persona4: [
      {
        title: "Midnight Channel & TV World",
        desc: "Mergulhe no interior dos televisores para salvar as vítimas sequestradas antes que a neblina tome conta do mundo real.",
        icon: Eye,
      },
      {
        title: "Confronto com a Sombra",
        desc: "Aceite suas próprias fraquezas e medos reprimidos para domar sua Persona interior e salvar seus companheiros de equipe.",
        icon: Swords,
      },
      {
        title: "Investigação & Clima",
        desc: "Acompanhe a previsão do tempo chuvoso para planejar resgates críticos e coletar pistas com os habitantes de Inaba.",
        icon: Sparkles,
      },
      {
        title: "Social Links Comunitários",
        desc: "Crie laços inquebráveis com seus amigos em clubes escolares, empregos de meio período e passeios de moto.",
        icon: HeartHandshake,
      },
    ],
    persona5: [
      {
        title: "All-Out Attack & Baton Pass",
        desc: "Derrube as fraquezas elementais de todos os inimigos e execute um ataque em equipe com finalização cinematográfica.",
        icon: Swords,
      },
      {
        title: "Infiltração em Palácios",
        desc: "Use o gancho de escalada, furtividade e salto de sombras para navegar pelas fortalezas cognitivas dos corações corrompidos.",
        icon: Eye,
      },
      {
        title: "Negociação de Sombras",
        desc: "Converse com as sombras capturadas em combate para recrutá-las como Personas, extorquir dinheiro ou obter itens raros.",
        icon: Sparkles,
      },
      {
        title: "Confidants & Habilidades Rebeldes",
        desc: "Faça acordos com aliados em Tóquio para desbloquear regalias de combate, armas customizadas e novos golpes táticos.",
        icon: HeartHandshake,
      },
    ],
  };

  const mechanics = mechanicsByTheme[theme] || mechanicsByTheme.persona5;

  return (
    <section className="my-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-theme-primary/10 rounded-xl text-theme-primary">
          <Swords className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-theme-muted">
            Gameplay & Recursos
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white font-display">
            Mecânicas Principais
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mechanics.map((mech, idx) => {
          const Icon = mech.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-theme-surface/60 border border-theme-border/80 hover:border-theme-primary/50 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-12 h-12 rounded-xl bg-theme-primary/10 flex items-center justify-center text-theme-primary mb-4 group-hover:scale-110 transition-transform">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-theme-primary transition-colors">
                {mech.title}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {mech.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
