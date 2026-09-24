"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Persona4TransitionProps {
  onComplete: () => void;
}

/**
 * Persona 4 Revival Thematic Transition
 * Conceito: TV CRT amarela analógica, ruído/estática de sinal chuvoso,
 * espiral hipnótica preto e branca expandindo em zoom até cobrir a tela e revelar o TV World.
 *
 * // TODO: inserir efeito de televisão/espiral Persona 4 com shader customizado futuramente
 */
export const Persona4Transition: React.FC<Persona4TransitionProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<"noise" | "spiral" | "zoom">("noise");

  useEffect(() => {
    // Fase 1: Ruído analógico e sintonia
    const t1 = setTimeout(() => setStage("spiral"), 700);
    // Fase 2: Expansão da espiral hipnótica
    const t2 = setTimeout(() => setStage("zoom"), 1300);
    // Fase 3: Conclusão e liberação da página
    const t3 = setTimeout(() => onComplete(), 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0c08]/95 overflow-hidden"
    >
      {/* Moldura de TV CRT Retrô Amarela */}
      <motion.div
        animate={{
          scale: stage === "zoom" ? 5 : 1,
          opacity: stage === "zoom" ? 0 : 1,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="relative w-[340px] md:w-[480px] h-[260px] md:h-[360px] bg-yellow-400 rounded-3xl p-6 border-8 border-yellow-500 shadow-[0_0_60px_rgba(250,204,21,0.5)] flex flex-col justify-between"
      >
        {/* Antenas do televisor */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-12 pointer-events-none">
          <div className="w-1.5 h-14 bg-yellow-600 rotate-[-25deg] origin-bottom rounded-full" />
          <div className="w-1.5 h-14 bg-yellow-600 rotate-[25deg] origin-bottom rounded-full" />
        </div>

        {/* Tela CRT com curvatura */}
        <div className="relative w-full h-[85%] bg-black rounded-2xl overflow-hidden border-4 border-neutral-900 crt-scanline flex items-center justify-center">
          {stage === "noise" && (
            <div className="absolute inset-0 bg-neutral-900 flex flex-col items-center justify-center">
              <div className="animate-pulse text-yellow-400 font-mono text-sm uppercase tracking-widest">
                [ SINAL MIDNIGHT CHANNEL: CH-04 ]
              </div>
              <div className="text-xs text-yellow-300/70 mt-2 font-mono">Sintonizando Inaba Neblina...</div>
            </div>
          )}

          {/* Espiral Hipnótica em rotação */}
          {(stage === "spiral" || stage === "zoom") && (
            <motion.div
              animate={{ rotate: 720, scale: stage === "zoom" ? 12 : 1 }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="w-48 h-48 rounded-full border-8 border-dashed border-white flex items-center justify-center shadow-[0_0_40px_white]"
            >
              <div className="w-32 h-32 rounded-full border-8 border-dotted border-yellow-300 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-black border-4 border-white animate-spin" />
              </div>
            </motion.div>
          )}

          {/* Efeito de scanline analógico */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent pointer-events-none" />
        </div>

        {/* Controles da TV (Botões rotativos e grelha) */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-700 border border-yellow-800" />
            <div className="w-4 h-4 rounded-full bg-yellow-700 border border-yellow-800" />
          </div>
          <span className="font-mono text-xs font-bold text-yellow-950 uppercase tracking-wider">
            PERSONA 4 REVIVAL
          </span>
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-yellow-700 rounded-full" />
            <div className="w-1 h-3 bg-yellow-700 rounded-full" />
            <div className="w-1 h-3 bg-yellow-700 rounded-full" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
