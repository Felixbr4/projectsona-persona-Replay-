import React from "react";
import { Users, Shield, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface CharacterItem {
  id: string;
  name: string;
  roleTag: string;
  personaName?: string | null;
  arcana?: string | null;
  description: string;
  image: string;
}

interface GameCharactersProps {
  characters: CharacterItem[];
}

export const GameCharacters: React.FC<GameCharactersProps> = ({ characters }) => {
  if (!characters || characters.length === 0) return null;

  return (
    <section className="my-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2.5 bg-theme-primary/10 rounded-xl text-theme-primary">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-theme-muted">
            Personagens & Personas
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white font-display">
            Elenco Principal
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {characters.map((char) => (
          <div
            key={char.id}
            className="group relative rounded-2xl bg-theme-surface/70 border border-theme-border/80 overflow-hidden hover:border-theme-primary/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] flex flex-col"
          >
            {/* Image Banner */}
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
              <img
                src={char.image}
                alt={char.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-theme-surface via-transparent to-transparent" />
              <div className="absolute top-3 right-3">
                <Badge variant="primary" className="text-[10px] backdrop-blur-md">
                  {char.roleTag}
                </Badge>
              </div>
            </div>

            {/* Character Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-theme-primary transition-colors">
                  {char.name}
                </h3>

                {char.personaName && (
                  <div className="flex items-center gap-1.5 text-xs text-theme-muted mt-1 font-mono">
                    <Wand2 className="w-3.5 h-3.5 text-theme-primary" />
                    <span>Persona: <strong className="text-white">{char.personaName}</strong></span>
                  </div>
                )}

                {char.arcana && (
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1 font-mono">
                    <Shield className="w-3.5 h-3.5 text-theme-secondary" />
                    <span>Arcano: {char.arcana}</span>
                  </div>
                )}

                <p className="text-xs text-neutral-300 mt-3 leading-relaxed">
                  {char.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
