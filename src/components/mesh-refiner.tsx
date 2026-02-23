'use client'

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

interface MeshRefinerProps {
    onPenalty: (msg: string) => void;
}

const RIDGE = "0,95 20,88 35,70 50,80 65,45 80,62 100,20 115,50 130,35 145,55 160,25 175,60 195,40 215,70 230,55 250,80 265,72 280,95";

const MID_TRIS = [
    "65,45 100,20 80,62", "80,62 100,20 115,50",
    "100,20 115,50 130,35", "115,50 130,35 145,55",
    "130,35 145,55 160,25", "145,55 160,25 175,60",
    "160,25 175,60 195,40", "175,60 195,40 215,70",
];

const HIGH_TRIS = [
    "35,70 65,45 50,80", "35,70 50,80 20,88",
    "65,45 50,80 80,62", "35,70 65,45 50,95",
    "65,45 80,62 65,95", "80,62 115,50 95,95",
    "100,20 130,35 115,95", "130,35 145,55 130,95",
    "145,55 175,60 160,95", "215,70 230,55 250,80",
    "230,55 250,80 265,72", "215,70 250,80 230,95",
];

function getTier(d: number): "low" | "mid" | "high" {
    if (d <= 30) return "low";
    if (d <= 70) return "mid";
    return "high";
}

export default function MeshRefiner({ onPenalty }: MeshRefinerProps) {
    const [isDay, setIsDay] = useState(true);
    const [meshDensity, setMeshDensity] = useState(100);
    const [cycleTime, setCycleTime] = useState(15);
    const lastPenalty = useRef(0);

    useEffect(() => {
        const cycle = setInterval(() => { setIsDay(p => !p); setCycleTime(15); }, 15000);
        const tick = setInterval(() => { setCycleTime(p => p > 0 ? p - 1 : 15); }, 1000);
        return () => { clearInterval(cycle); clearInterval(tick); };
    }, []);

    useEffect(() => {
        const id = setInterval(() => {
            const now = Date.now();
            if (now - lastPenalty.current < 2000) return;
            if (isDay && meshDensity < 80) { onPenalty("LOW_FIDELITY_DAY_RESTRICTION"); lastPenalty.current = now; }
            else if (!isDay && meshDensity > 20) { onPenalty("ENERGY_OVERCONSUMPTION"); lastPenalty.current = now; }
        }, 1000);
        return () => clearInterval(id);
    }, [isDay, meshDensity, onPenalty]);

    const tier = getTier(meshDensity);
    const isPenalty = (isDay && meshDensity < 80) || (!isDay && meshDensity > 20);
    const ridgeStroke = tier === "low" ? "rgba(255,255,255,0.4)" : tier === "mid" ? "rgba(255,255,255,0.65)" : "rgba(255,255,255,0.85)";
    const meshStroke = tier === "high" ? "rgba(34,211,238,0.30)" : "rgba(34,211,238,0.18)";

    return (
        <div className="flex flex-col h-auto pb-8 space-y-4">

            {/* ── 2-column header area ──────────────────────────────────── */}
            <div className="grid grid-cols-[2fr_1fr] gap-4 items-center">

                {/* Left: mountain render */}
                <div className="relative min-h-[130px] bg-black/20 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
                    <svg
                        width="100%"
                        height="130"
                        viewBox="0 0 280 110"
                        preserveAspectRatio="xMidYMid meet"
                        className="px-3"
                    >
                        <line x1="0" y1="95" x2="280" y2="95" stroke="rgba(34,211,238,0.20)" strokeWidth="0.5" />

                        {/* HIGH facets */}
                        {tier === "high" && HIGH_TRIS.map((pts, i) => (
                            <polygon key={`h${i}`} points={pts}
                                fill="rgba(34,211,238,0.04)" stroke={meshStroke} strokeWidth="0.3" />
                        ))}

                        {/* MID facets */}
                        {(tier === "mid" || tier === "high") && MID_TRIS.map((pts, i) => (
                            <polygon key={`m${i}`} points={pts}
                                fill="rgba(34,211,238,0.03)" stroke={meshStroke} strokeWidth="0.35" />
                        ))}

                        {/* Plumb lines */}
                        {tier !== "low" && [[65, 45], [100, 20], [130, 35], [160, 25], [195, 40]].map(([px, py], i) => (
                            <line key={`v${i}`} x1={px} y1={py} x2={px} y2={95}
                                stroke="rgba(34,211,238,0.12)" strokeWidth="0.35" />
                        ))}

                        {/* Ridge — always */}
                        <polyline points={RIDGE}
                            stroke={ridgeStroke}
                            strokeWidth={tier === "low" ? 1.0 : 0.8}
                            fill="none" strokeLinejoin="round" />
                    </svg>

                    {/* Warning overlay */}
                    {isPenalty && (
                        <motion.div
                            animate={{ opacity: [0.2, 0.8, 0.2] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                            className="absolute inset-0 bg-red-500/10 pointer-events-none flex items-center justify-center"
                        >
                            <span className="font-mono text-[9px] text-red-400 font-bold border border-red-500/40 px-2 py-0.5 bg-black/60">
                                {isDay ? "LOW_FIDELITY" : "EFFICIENCY_VIOLATION"}
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* Right: day/night status panel */}
                <div className={cn(
                    "h-full min-h-[130px] rounded-xl border flex flex-col items-center justify-center gap-3 transition-colors duration-700",
                    isDay
                        ? "border-cyan-500/40 bg-cyan-950/20"
                        : "border-slate-600/40 bg-slate-900/40"
                )}>
                    <AnimatePresence mode="wait">
                        {isDay ? (
                            <motion.div key="sun" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                className="flex flex-col items-center gap-1">
                                <Sun className="w-9 h-9 text-cyan-400" strokeWidth={1.5} />
                                <span className="font-mono text-[9px] text-cyan-400 font-bold tracking-widest">DAY</span>
                            </motion.div>
                        ) : (
                            <motion.div key="moon" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                className="flex flex-col items-center gap-1">
                                <Moon className="w-9 h-9 text-white" strokeWidth={1.5} />
                                <span className="font-mono text-[9px] text-white/60 font-bold tracking-widest">NIGHT</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <span className="font-mono text-[9px] text-white/30">T–{cycleTime}S</span>
                    <span className={cn(
                        "font-mono text-[8px] font-bold px-1.5 py-0.5 rounded tracking-widest",
                        tier === "low" && "text-red-400 bg-red-500/10 border border-red-500/20",
                        tier === "mid" && "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20",
                        tier === "high" && "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20",
                    )}>
                        {tier === "low" ? "SKELETAL" : tier === "mid" ? "MEDIUM" : "HI_FI"}
                    </span>
                </div>
            </div>

            {/* ── Slider ────────────────────────────────────────────────── */}
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="font-mono text-[9px] text-white/40 tracking-widest">MESH_DENSITY</label>
                    <span className={cn("font-mono text-[10px] font-bold", isPenalty ? "text-red-400" : "text-cyan-400")}>
                        {meshDensity}%
                    </span>
                </div>
                <input type="range" min="0" max="100" value={meshDensity}
                    onChange={e => setMeshDensity(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400 outline-none"
                />
                <div className="flex justify-between font-mono text-[8px] text-white/20">
                    <span>ECO_MIN</span>
                    <span>NOMINAL</span>
                    <span>HI_FIDELITY</span>
                </div>
            </div>
        </div>
    );
}
