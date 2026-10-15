"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Persona5TransitionProps {
  onComplete: () => void;
}

/**
 * Persona 5 Royal Thematic Transition
 * Máscara do protagonista Joker sendo progressivamente coberta por chamas azuis e ciano orgânicas,
 * substituindo os conceitos anteriores de calling card e cortes.
 */
export const Persona5Transition: React.FC<Persona5TransitionProps> = ({ onComplete }) => {
  const [flameStage, setFlameStage] = useState<"initial" | "ignite" | "engulf">("initial");

  useEffect(() => {
    // Sequência:
    // 1. A máscara aparece com detalhes visíveis
    // 2. Pequenas chamas azuis começam a surgir
    const t1 = setTimeout(() => setFlameStage("ignite"), 300);
    // 3. Chamas azuis e ciano se espalham progressivamente até cobri-la
    const t2 = setTimeout(() => setFlameStage("engulf"), 900);
    // 4. Conclusão da transição e revelação da página
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 overflow-hidden"
    >
      {/* Contêiner da Máscara do Joker com proporções preservadas */}
      <div className="relative flex flex-col items-center justify-center max-w-lg w-full px-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: flameStage === "engulf" ? 1.08 : 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-72 md:w-96 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,180,255,0.4)] border-2 border-cyan-500/30 bg-black/60"
        >
          {/* Imagem autêntica da Máscara de Joker */}
          <img
            src="/assets/images/transitions/joker-mask.jpg"
            alt="Máscara Joker - Persona 5 Royal"
            className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_0_20px_rgba(0,210,255,0.3)]"
          />

          {/* Chamas azuis e ciano com movimento orgânico progressivo */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
              flameStage === "initial"
                ? "opacity-0"
                : flameStage === "ignite"
                ? "opacity-60"
                : "opacity-100"
            }`}
          >
            {/* Camada 1 de chamas azuis profundas */}
            <div
              className="absolute inset-0 mix-blend-screen animate-pulse"
              style={{
                background:
                  "radial-gradient(circle at 50% 80%, rgba(0, 210, 255, 0.75) 0%, rgba(0, 102, 255, 0.6) 45%, rgba(0, 0, 180, 0.4) 70%, transparent 95%)",
              }}
            />

            {/* Camada 2 de labaredas ciano ondulantes */}
            <div
              className="absolute inset-0 mix-blend-color-dodge"
              style={{
                background:
                  "linear-gradient(0deg, rgba(0,240,255,0.85) 0%, rgba(30,144,255,0.7) 40%, rgba(100,50,255,0.5) 75%, transparent 100%)",
                filter: "blur(4px)",
              }}
            />

            {/* Partículas de chamas azuis subindo */}
            <div
              className="absolute inset-0 opacity-80"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #00ffff 20%, transparent 25%), radial-gradient(circle, #0088ff 20%, transparent 25%)",
                backgroundSize: "20px 20px, 32px 32px",
                backgroundPosition: "0 0, 10px 16px",
              }}
            />
          </div>
        </motion.div>

        {/* Indicador de título estilizado Persona 5 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-cyan-400 font-bold bg-cyan-950/60 px-4 py-1.5 rounded-full border border-cyan-500/40 shadow-[0_0_15px_rgba(0,210,255,0.3)]">
            PERSONA 5 ROYAL • AWAKENING
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};
