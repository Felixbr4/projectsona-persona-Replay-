"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Persona4TransitionProps {
  onComplete: () => void;
}

/**
 * Persona 4 Revival Thematic Transition
 * TV de tubo CRT amarela volumosa, tela curva, chiado visual estático discreto,
 * espiral amarela e preta contínua com aproximação da câmera (zoom).
 */
export const Persona4Transition: React.FC<Persona4TransitionProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<"appear" | "zoom">("appear");

  useEffect(() => {
    // Fase 1: TV com espiral e chiado visual
    const t1 = setTimeout(() => setStage("zoom"), 900);
    // Fase 2: Conclusão do zoom e liberação
    const t2 = setTimeout(() => onComplete(), 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0802]/95 overflow-hidden"
    >
      {/* Moldura de TV de tubo antiga com carcaça amarela volumosa */}
      <motion.div
        animate={{
          scale: stage === "zoom" ? 6 : 1,
          opacity: stage === "zoom" ? 0 : 1,
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-[340px] md:w-[480px] h-[270px] md:h-[370px] bg-gradient-to-b from-[#ffea3b] via-[#ffd700] to-[#d4af37] rounded-[40px] p-6 border-[10px] border-[#996515] shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(255,215,0,0.35)] flex flex-col justify-between"
      >
        {/* Antenas telescópicas CRT */}
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex gap-14 pointer-events-none">
          <div className="w-2 h-16 bg-gradient-to-t from-[#6b4e05] to-[#aaa] rotate-[-28deg] origin-bottom rounded-full shadow-md" />
          <div className="w-2 h-16 bg-gradient-to-t from-[#6b4e05] to-[#aaa] rotate-[28deg] origin-bottom rounded-full shadow-md" />
        </div>

        {/* Tela CRT com curvatura de vidro e borda interna espessa */}
        <div className="relative w-full h-[84%] bg-[#080808] rounded-[28px] overflow-hidden border-[6px] border-[#222] shadow-[inset_0_0_30px_rgba(0,0,0,0.95)] flex items-center justify-center">
          {/* Espiral contínua amarela e preta */}
          <div
            className="w-56 h-56 rounded-full animate-spin shadow-[0_0_25px_rgba(255,215,0,0.6)]"
            style={{
              animationDuration: "2.5s",
              background: "repeating-conic-gradient(#ffd700 0deg 30deg, #111111 30deg 60deg)",
            }}
          />

          {/* Chiado visual analógico / Estática leve restrita à tela */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30 mix-blend-screen"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 10%, transparent 11%), radial-gradient(circle, #ffd700 10%, transparent 11%)",
              backgroundSize: "6px 6px, 8px 8px",
            }}
          />

          {/* Linhas de scanline CRT */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ffd700]/5 to-transparent pointer-events-none" />

          {/* Curvatura de vidro CRT reflexo */}
          <div className="absolute inset-0 rounded-[24px] pointer-events-none shadow-[inset_0_0_40px_rgba(255,255,255,0.15)]" />
        </div>

        {/* Painel inferior de controles clássicos da TV CRT */}
        <div className="flex items-center justify-between pt-2 px-2">
          <div className="flex gap-2">
            <div className="w-5 h-5 rounded-full bg-[#5a3e0b] border-2 border-[#8c6218] shadow-inner" />
            <div className="w-5 h-5 rounded-full bg-[#5a3e0b] border-2 border-[#8c6218] shadow-inner" />
          </div>
          <span className="font-mono text-xs font-black text-[#3d2700] uppercase tracking-widest">
            PERSONA 4 REVIVAL • TV
          </span>
          <div className="flex gap-1.5">
            <div className="w-1.5 h-4 bg-[#6b4e05] rounded-full" />
            <div className="w-1.5 h-4 bg-[#6b4e05] rounded-full" />
            <div className="w-1.5 h-4 bg-[#6b4e05] rounded-full" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
