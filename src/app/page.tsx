'use client';

import Link from "next/link";
import { motion } from "framer-motion";

const NARRATIVE = "SWITZERLAND IS NOT PERFECT. IT IS A CONSTRUCT. A HIGH-FIDELITY SIMULATION WHERE STABILITY IS A FRAGILE ILLUSION. BEHIND THE POSTCARDS AND THE PRECISION LIES A COMPLEX GRID OF SHIFTING DATA. YOUR OBJECTIVE IS ABSOLUTE: PREVENT TOTAL SYSTEM COLLAPSE. YOU ARE THE OPERATOR. YOU ARE THE LAST LINE OF DEFENSE. SYNCHRONIZE. DEFEND. CALIBRATE. WELCOME TO THE CORE.";

export default function WelcomePage() {
  const words = NARRATIVE.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      x: 20,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative w-full overflow-hidden">
      {/* Red Alert Pulse Overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0 animate-[pulse_4s_ease-in-out_infinite]"
        style={{ boxShadow: 'inset 0 0 150px rgba(255, 0, 40, 0.2)', backgroundColor: 'rgba(255, 0, 40, 0.03)' }}
      ></div>

      <div className="mb-12 text-center relative z-10 flex flex-col items-center">
        {/* CSS Minimalist Swiss Flag */}
        <div className="w-[48px] h-[48px] bg-[#FF0028] relative flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,0,40,0.4)] border border-white/10 rounded-sm">
          <div className="w-[30px] h-[8px] bg-white absolute rounded-sm"></div>
          <div className="w-[8px] h-[30px] bg-white absolute rounded-sm"></div>
        </div>

        <h1 className="text-4xl font-bold tracking-[0.2em] mb-2 text-white uppercase italic">
          // INITIALIZING_SIMULATION: CH-SIM-01
        </h1>
        <p className="text-sm tracking-widest text-[#45B6FE] uppercase opacity-80 font-mono">
          Kernel Access Terminal
        </p>
      </div>

      <div className="glass-panel w-full max-w-2xl p-10 flex flex-col gap-8 relative overflow-hidden group z-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#45B6FE] to-transparent opacity-50"></div>

        <div className="space-y-4 min-h-[160px] flex items-center justify-center">
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-lg font-mono font-medium tracking-wider text-white leading-relaxed text-center uppercase"
          >
            {words.map((char, index) => (
              <motion.span variants={child} key={index}>
                {char}
              </motion.span>
            ))}
          </motion.div>
        </div>

        <div className="space-y-6 pt-6 border-t border-white/10">
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#45B6FE] uppercase tracking-[0.3em] opacity-80">
              // OPERATOR_INSTRUCTIONS
            </h3>
            <ul className="text-sm text-white/70 font-mono space-y-4">
              <li className="flex items-start gap-4">
                <span className="text-[#45B6FE] font-bold">[01]</span>
                <span>Sync the <span className="text-white brightness-125">SBB_CLOCK</span> to maintain temporal stability.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-[#45B6FE] font-bold">[02]</span>
                <span>Defend the perimeter in <span className="text-white brightness-125">SWAN_RADAR</span> to prevent data leaks.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-[#45B6FE] font-bold">[03]</span>
                <span>Calibrate the <span className="text-white brightness-125">MATTERHORN_REFINER</span> for optimal energy rendering.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <Link
            href="/kernel"
            className="group relative px-12 py-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#45B6FE]/50 text-white transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#45B6FE]/0 via-[#45B6FE]/10 to-[#45B6FE]/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative z-10 text-lg font-bold tracking-[0.3em] uppercase">
              [ AVVIA_SIMULAZIONE ]
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
