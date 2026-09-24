"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Persona3TransitionProps {
  onComplete: () => void;
}

/**
 * Persona 3 Reload Thematic Transition
 * Conceito: Relógio da Dark Hour verde-água/azul surge, ponteiros giram velozmente
 * até a Meia-Noite (12:00), impacto visual de vidro e dispersão azul neon.
 *
 * // TODO: substituir futuramente por animação cinematográfica Persona 3 pré-renderizada
 */
export const Persona3Transition: React.FC<Persona3TransitionProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<"spinning" | "midnight" | "shatter">("spinning");

  useEffect(() => {
    // Fase 1: Girando até a meia noite (800ms)
    const timer1 = setTimeout(() => setPhase("midnight"), 900);
    // Fase 2: Meia-Noite / Impacto Azul (400ms)
    const timer2 = setTimeout(() => setPhase("shatter"), 1400);
    // Fase 3: Conclusão
    const timer3 = setTimeout(() => onComplete(), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#02050f]/95 backdrop-blur-md overflow-hidden"
    >
      {/* Círculos concêntricos e runas da Dark Hour */}
      <motion.div
        animate={{ rotate: 360, scale: phase === "midnight" ? 1.2 : 1 }}
        transition={{ duration: 3, ease: "linear", repeat: Infinity }}
        className="absolute w-[600px] h-[600px] rounded-full border border-cyan-500/20 pointer-events-none"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 5, ease: "linear", repeat: Infinity }}
        className="absolute w-[450px] h-[450px] rounded-full border border-dashed border-cyan-400/30 pointer-events-none"
      />

      {/* Relógio da Dark Hour */}
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{
            scale: phase === "midnight" ? [1, 1.3, 1.1] : 1,
            boxShadow:
              phase === "midnight"
                ? "0 0 80px rgba(0, 210, 255, 0.9), inset 0 0 40px rgba(0, 210, 255, 0.6)"
                : "0 0 30px rgba(0, 210, 255, 0.3)",
          }}
          transition={{ duration: 0.4 }}
          className={`relative w-48 h-48 rounded-full border-4 ${
            phase === "midnight" ? "border-cyan-300 bg-cyan-950/80" : "border-emerald-400 bg-emerald-950/50"
          } flex items-center justify-center transition-colors duration-300`}
        >
          {/* Marcadores de hora */}
          <div className="absolute top-2 font-mono font-bold text-xs text-cyan-300">XII</div>
          <div className="absolute bottom-2 font-mono font-bold text-xs text-cyan-500">VI</div>
          <div className="absolute left-3 font-mono font-bold text-xs text-cyan-500">IX</div>
          <div className="absolute right-3 font-mono font-bold text-xs text-cyan-500">III</div>

          {/* Ponteiro das horas */}
          <motion.div
            animate={{
              rotate: phase === "spinning" ? [0, 720, 1080, 1440] : 0,
            }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute w-1.5 h-16 bg-cyan-300 origin-bottom rounded-full"
            style={{ bottom: "50%" }}
          />

          {/* Ponteiro dos minutos */}
          <motion.div
            animate={{
              rotate: phase === "spinning" ? [0, 2160, 4320, 5760] : 0,
            }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="absolute w-1 h-20 bg-white origin-bottom rounded-full shadow-[0_0_10px_#00d2ff]"
            style={{ bottom: "50%" }}
          />

          {/* Núcleo do relógio */}
          <div className="w-4 h-4 rounded-full bg-cyan-400 z-10 shadow-[0_0_15px_#00d2ff]" />
        </motion.div>

        {/* Texto do Momento */}
        <motion.div
          animate={{ opacity: [0, 1], y: [10, 0] }}
          className="mt-6 text-center"
        >
          <p className="font-mono text-cyan-400 text-sm tracking-widest uppercase">
            {phase === "spinning" && "Sincronizando Relógio Biológico..."}
            {phase === "midnight" && "⚡ DARK HOUR: 12:00 AM ATINGIDA ⚡"}
            {phase === "shatter" && "Despertando Persona..."}
          </p>
          <h2 className="text-2xl font-black italic tracking-wider text-white mt-1 drop-shadow-[0_0_15px_rgba(0,210,255,0.8)]">
            PERSONA 3 RELOAD
          </h2>
        </motion.div>
      </div>
    </motion.div>
  );
};
