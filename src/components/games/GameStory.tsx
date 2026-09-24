import React from "react";
import { BookOpen, Sparkles } from "lucide-react";

interface GameStoryProps {
  gameName: string;
  story: string;
}

export const GameStory: React.FC<GameStoryProps> = ({ gameName, story }) => {
  return (
    <section className="my-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-theme-primary/10 rounded-xl text-theme-primary">
          <BookOpen className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-theme-muted">
            Enredo & Mitologia
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight text-white font-display">
            A História de {gameName}
          </h2>
        </div>
      </div>

      <div className="relative p-6 sm:p-8 rounded-2xl bg-theme-surface/60 border border-theme-border/80 backdrop-blur-md overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 text-theme-primary pointer-events-none">
          <Sparkles className="w-32 h-32" />
        </div>

        <p className="relative z-10 text-neutral-300 leading-relaxed text-base sm:text-lg whitespace-pre-line font-normal">
          {story}
        </p>
      </div>
    </section>
  );
};
