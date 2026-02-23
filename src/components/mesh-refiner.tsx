'use client'

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

interface MeshRefinerProps {
    onPenalty: (msg: string) => void;
}

// ─── SVG data — shared ridge points ──────────────────────────────────────────
const RIDGE = "0,95 20,88 35,70 50,80 65,45 80,62 100,20 115,50 130,35 145,55 160,25 175,60 195,40 215,70 230,55 250,80 265,72 280,95";

// Medium-poly triangles (adds inner facets on top of skeletal)
const MID_TRIS = [
    "65,45 100,20 80,62",
    "80,62 100,20 115,50",
    "100,20 115,50 130,35",
    "115,50 130,35 145,55",
    "130,35 145,55 160,25",
    "145,55 160,25 175,60",
    "160,25 175,60 195,40",
    "175,60 195,40 215,70",
];

// High-poly extras (adds all remaining facets + fine base triangles)
const HIGH_TRIS = [
    "35,70 65,45 50,80",
    "35,70 50,80 20,88",
    "65,45 50,80 80,62",
    "35,70 65,45 50,95",
    "65,45 80,62 65,95",
    "80,62 115,50 95,95",
    "100,20 130,35 115,95",
    "130,35 145,55 130,95",
    "145,55 175,60 160,95",
    "215,70 230,55 250,80",
    "230,55 250,80 265,72",
    "215,70 250,80 230,95",
];

// ─── Tier derivation ──────────────────────────────────────────────────────────
function getTier(density: number): "low" | "mid" | "high" {
    if (density <= 30) return "low";
    if (density <= 70) return "mid";
    return "high";
}

export default function MeshRefiner({ onPenalty }: MeshRefinerProps) {
    const [isDay, setIsDay] = useState(true);
    const [meshDensity, setMeshDensity] = useState(100);
    const [cycleTime, setCycleTime] = useState(15);
    const lastPenaltyTime = useRef(0);

    // ── Day/Night Cycle ──────────────────────────────────────────────────────
    useEffect(() => {
        const cycle = setInterval(() => {
            setIsDay(p => !p);
            setCycleTime(15);
        }, 15000);
        const tick = setInterval(() => {
            setCycleTime(p => (p > 0 ? p - 1 : 15));
        }, 1000);
        return () => { clearInterval(cycle); clearInterval(tick); };
    }, []);

    // ── Energy Penalty ───────────────────────────────────────────────────────
    useEffect(() => {
        const check = () => {
            const now = Date.now();
            if (now - lastPenaltyTime.current < 2000) return;
            if (isDay && meshDensity < 80) {
                onPenalty("LOW_FIDELITY_DAY_RESTRICTION");
                lastPenaltyTime.current = now;
            } else if (!isDay && meshDensity > 20) {
                onPenalty("ENERGY_OVERCONSUMPTION");
                lastPenaltyTime.current = now;
            }
        };
        const id = setInterval(check, 1000);
        return () => clearInterval(id);
    }, [isDay, meshDensity, onPenalty]);

    const tier = getTier(meshDensity);
    const isPenalty = (isDay && meshDensity < 80) || (!isDay && meshDensity > 20);

    // ── Colour tones per tier ─────────────────────────────────────────────────
    const ridgeColour = tier === "low"
        ? "rgba(255,255,255,0.35)"
        : tier === "mid"
            ? "rgba(255,255,255,0.60)"
            : "rgba(255,255,255,0.80)";

    const meshColour = tier === "mid"
        ? "rgba(34,211,238,0.18)"
        : "rgba(34,211,238,0.28)";

    return (
        <div className="flex flex-col h-full space-y-4 pb-8">

            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <AnimatePresence mode="wait">
                        {isDay ? (
                            <motion.div key="day-hdr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2">
                                <Sun className="w-4 h-4 text-cyan-400 animate-pulse" />
                                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Day Mode // Operational</span>
                            </motion.div>
                        ) : (
                            <motion.div key="ngt-hdr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex items-center gap-2">
                                <Moon className="w-4 h-4 text-slate-400" />
                                <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider">Night Mode // Energy Saving</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <div className="flex items-center gap-3">
                    <span className={cn(
                        "font-mono text-[9px] font-bold px-1.5 py-0.5 rounded tracking-widest",
                        tier === "low" && "text-red-400 bg-red-500/10 border border-red-500/20",
                        tier === "mid" && "text-yellow-400 bg-yellow-500/10 border border-yellow-500/20",
                        tier === "high" && "text-cyan-400 bg-cyan-500/10 border border-cyan-500/20",
                    )}>
                        {tier === "low" ? "SKELETAL" : tier === "mid" ? "MEDIUM" : "HI_FIDELITY"}
                    </span>
                    <span className="font-mono text-[10px] text-white/30">T–{cycleTime}S</span>
                </div>
            </div>

            {/* ── Mountain Render Area ─────────────────────────────────────── */}
            <div className="relative flex-1 min-h-[140px] flex items-center justify-center bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                <motion.svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 280 110"
                    preserveAspectRatio="xMidYMid meet"
                    className="px-3"
                >
                    {/* Horizon */}
                    <motion.line
                        x1="0" y1="95" x2="280" y2="95"
                        stroke="rgba(34,211,238,0.20)" strokeWidth="0.5"
                        animate={{ opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* ── HIGH-poly facets (only when high) ─────────────── */}
                    <AnimatePresence>
                        {tier === "high" && HIGH_TRIS.map((pts, i) => (
                            <motion.polygon
                                key={`h${i}`}
                                points={pts}
                                fill="rgba(34,211,238,0.04)"
                                stroke={meshColour}
                                strokeWidth="0.3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.02 }}
                            />
                        ))}
                    </AnimatePresence>

                    {/* ── MEDIUM-poly facets (mid + high) ───────────────── */}
                    <AnimatePresence>
                        {(tier === "mid" || tier === "high") && MID_TRIS.map((pts, i) => (
                            <motion.polygon
                                key={`m${i}`}
                                points={pts}
                                fill="rgba(34,211,238,0.03)"
                                stroke={meshColour}
                                strokeWidth="0.35"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.025 }}
                            />
                        ))}
                    </AnimatePresence>

                    {/* ── Vertical plumb lines (mid + high) ─────────────── */}
                    <AnimatePresence>
                        {tier !== "low" && [
                            [65, 45], [100, 20], [130, 35], [160, 25], [195, 40]
                        ].map(([px, py], i) => (
                            <motion.line
                                key={`p${i}`}
                                x1={px} y1={py} x2={px} y2={95}
                                stroke="rgba(34,211,238,0.12)" strokeWidth="0.35"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.03 }}
                            />
                        ))}
                    </AnimatePresence>

                    {/* ── Main ridge — always visible ────────────────────── */}
                    <polyline
                        points={RIDGE}
                        stroke={ridgeColour}
                        strokeWidth={tier === "low" ? 1.0 : 0.8}
                        fill="none"
                        strokeLinejoin="round"
                    />
                </motion.svg>

                {/* ── Warning Overlay ────────────────────────────────────── */}
                <AnimatePresence>
                    {isPenalty && (
                        <motion.div
                            key="warn"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute inset-0 bg-red-500/10 pointer-events-none flex items-center justify-center"
                        >
                            <span className="font-mono text-[10px] text-red-500 font-bold border border-red-500/50 px-2 py-1 bg-black/60 backdrop-blur-sm">
                                {isDay ? "LOW_FIDELITY_DETECTED" : "EFFICIENCY_VIOLATION"}
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Slider ──────────────────────────────────────────────────── */}
            <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                    <label className="font-mono text-[9px] text-white/40 tracking-widest uppercase">MESH_DENSITY</label>
                    <span className={cn(
                        "font-mono text-[10px] font-bold",
                        isPenalty ? "text-red-500" : "text-cyan-400"
                    )}>{meshDensity}%</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={meshDensity}
                    onChange={e => setMeshDensity(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400 outline-none transition-all hover:bg-white/20"
                />
                <div className="flex justify-between font-mono text-[8px] text-white/20 tracking-tighter">
                    <span>ECO_MIN</span>
                    <span>NOMINAL</span>
                    <span>HI_FIDELITY</span>
                </div>
            </div>
        </div>
    );
}
