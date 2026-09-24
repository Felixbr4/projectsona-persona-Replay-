"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Persona5TransitionProps {
  onComplete: () => void;
}

/**
 * Persona 5 Royal Thematic Transition
 * Conceito: Estilo de quadrinho rebelde e corte "All-Out Attack" / Joker,
 * faixas diagonais vermelhas e pretas cruzam a tela com efeito de impacto e máscara dos Phantom Thieves.
 *
 * // TODO: inserir efeito de rachadura/Joker cinematográfico Persona 5 com sprites adicionais
 */
export const Persona5Transition: React.FC<Persona5TransitionProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"slash" | "callingCard" | "shatter">("slash");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("callingCard"), 600);
    const t2 = setTimeout(() => setPhase("shatter"), 1200);
    const t3 = setTimeout(() => onComplete(), 1700);

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 overflow-hidden"
    >
      {/* Faixas diagonais cortando em velocidade extrema */}
      <motion.div
        initial={{ x: "-100%", skewX: -20 }}
        animate={{ x: "0%", skewX: -20 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="absolute inset-0 bg-red-600 origin-left"
        style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)" }}
      />
      <motion.div
        initial={{ x: "100%", skewX: -20 }}
        animate={{ x: "0%", skewX: -20 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
        className="absolute inset-0 bg-black/90"
        style={{ clipPath: "polygon(40% 0, 100% 0, 100% 100%, 20% 100%)" }}
      />

      {/* Cartão de Visita / Phantom Calling Card & Máscara de Joker */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          animate={{
            scale: phase === "callingCard" ? [0.8, 1.15, 1] : 1,
            rotate: [-12, -4],
          }}
          transition={{ duration: 0.4 }}
          className="bg-neutral-900 border-4 border-red-500 text-white p-6 shadow-[0_0_50px_rgba(239,68,68,0.8)] -rotate-3 max-w-sm text-center"
          style={{ clipPath: "polygon(4% 0%, 100% 0%, 96% 100%, 0% 100%)" }}
        >
          <div className="bg-red-600 text-white font-black text-xs px-3 py-1 uppercase tracking-widest inline-block mb-3">
            PHANTOM THIEVES OF HEARTS
          </div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
            TAKE YOUR HEART!
          </h2>
          <p className="text-xs text-red-200 mt-2 font-mono">
            Sir / Madam Player, seu coração de gamer foi oficialmente alvo.
          </p>
          <div className="mt-4 pt-3 border-t border-red-500/40 flex items-center justify-between text-xs font-bold text-red-400">
            <span>METAVERSE NAVIGATOR</span>
            <span className="text-white bg-black px-2 py-0.5">P5 ROYAL</span>
          </div>
        </motion.div>

        {/* Efeito de Corte Visual Slash */}
        <motion.div
          animate={{ scaleX: [0, 1.5, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-96 h-1 bg-white shadow-[0_0_20px_white] -rotate-12 mt-4"
        />
      </div>
    </motion.div>
  );
};
