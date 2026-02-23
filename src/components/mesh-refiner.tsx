'use client'

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

interface MeshRefinerProps {
    onPenalty: (msg: string) => void;
}

export default function MeshRefiner({ onPenalty }: MeshRefinerProps) {
    const [isDay, setIsDay] = useState(true);
    const [meshDensity, setMeshDensity] = useState(100);
    const [cycleTime, setCycleTime] = useState(15);
    const lastPenaltyTime = useRef(0);

    // Day/Night Cycle Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setIsDay((prev) => !prev);
            setCycleTime(15);
        }, 15000);

        const timer = setInterval(() => {
            setCycleTime((prev) => (prev > 0 ? prev - 1 : 15));
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(timer);
        };
    }, []);

    // Energy Penalty Logic
    useEffect(() => {
        const checkEnergy = () => {
            const now = Date.now();
            if (now - lastPenaltyTime.current < 2000) return; // Debounce penalty

            if (isDay && meshDensity < 80) {
                onPenalty("LOW_FIDELITY_DAY_RESTRICTION");
                lastPenaltyTime.current = now;
            } else if (!isDay && meshDensity > 20) {
                onPenalty("ENERGY_OVERCONSUMPTION");
                lastPenaltyTime.current = now;
            }
        };

        const interval = setInterval(checkEnergy, 1000);
        return () => clearInterval(interval);
    }, [isDay, meshDensity, onPenalty]);

    return (
        <div className="flex flex-col h-full space-y-4 pb-8">
            {/* Header with Cycle Status */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isDay ? (
                        <div className="flex items-center gap-2">
                            <Sun className="w-4 h-4 text-cyan-400 animate-pulse" />
                            <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider">Day Mode // Operational</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Moon className="w-4 h-4 text-slate-400" />
                            <span className="font-mono text-[10px] text-slate-400 font-bold uppercase tracking-wider">Night Mode // Energy Saving</span>
                        </div>
                    )}
                </div>
                <div className="font-mono text-[10px] text-white/40">
                    NEXT_CYCLE: {cycleTime}S
                </div>
            </div>

            {/* Mountain Range Rendering Area */}
            <div className="relative flex-1 min-h-[140px] flex items-center justify-center bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                <AnimatePresence mode="wait">
                    {isDay ? (
                        /* ── DAY: High-Poly Mountain Range ── */
                        <motion.svg
                            key="day-mesh"
                            width="100%"
                            height="100%"
                            viewBox="0 0 280 110"
                            preserveAspectRatio="xMidYMid meet"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="px-4"
                        >
                            {/* Base horizon line */}
                            <line x1="0" y1="95" x2="280" y2="95" stroke="rgba(34,211,238,0.25)" strokeWidth="0.5" />

                            {/* Main ridge silhouette */}
                            <polyline
                                points="0,95 20,88 35,70 50,80 65,45 80,62 100,20 115,50 130,35 145,55 160,25 175,60 195,40 215,70 230,55 250,80 265,72 280,95"
                                stroke="rgba(255,255,255,0.75)"
                                strokeWidth="0.8"
                                fill="none"
                                strokeLinejoin="round"
                            />

                            {/* Mesh triangulation — density-driven opacity */}
                            {[
                                /* Left cluster */
                                "35,70 65,45 50,80",
                                "35,70 50,80 20,88",
                                "65,45 50,80 80,62",
                                "35,70 65,45 50,95",
                                /* Centre-left peak */
                                "65,45 100,20 80,62",
                                "80,62 100,20 115,50",
                                "65,45 80,62 65,95",
                                "80,62 115,50 95,95",
                                /* Centre peak */
                                "100,20 115,50 130,35",
                                "115,50 130,35 145,55",
                                "100,20 130,35 115,95",
                                "130,35 145,55 130,95",
                                /* Centre-right peak */
                                "130,35 145,55 160,25",
                                "145,55 160,25 175,60",
                                "160,25 175,60 195,40",
                                "145,55 175,60 160,95",
                                /* Right cluster */
                                "175,60 195,40 215,70",
                                "195,40 215,70 230,55",
                                "215,70 230,55 250,80",
                                "230,55 250,80 265,72",
                                "215,70 250,80 230,95",
                            ].map((pts, i) => (
                                <polygon
                                    key={i}
                                    points={pts}
                                    fill="rgba(34,211,238,0.03)"
                                    stroke="rgba(34,211,238,0.22)"
                                    strokeWidth="0.35"
                                    opacity={0.4 + (meshDensity / 100) * 0.6}
                                />
                            ))}

                            {/* Extra density lines that grow with slider */}
                            {meshDensity > 40 && [
                                [100, 20, 100, 95],
                                [160, 25, 160, 95],
                                [65, 45, 65, 95],
                                [130, 35, 130, 95],
                                [195, 40, 195, 95],
                            ].map(([x1, y1, x2, y2], i) => (
                                <line key={`v${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(34,211,238,0.12)" strokeWidth="0.3" />
                            ))}
                        </motion.svg>
                    ) : (
                        /* ── NIGHT: Low-Poly Silhouette ── */
                        <motion.svg
                            key="night-mesh"
                            width="100%"
                            height="100%"
                            viewBox="0 0 280 110"
                            preserveAspectRatio="xMidYMid meet"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="px-4"
                        >
                            {/* Filled silhouette */}
                            <polygon
                                points="0,95 35,70 65,45 100,20 130,35 160,25 195,40 230,55 265,72 280,95"
                                fill="rgba(255,255,255,0.04)"
                                stroke="rgba(255,255,255,0.35)"
                                strokeWidth="0.8"
                                strokeLinejoin="round"
                            />
                            {/* Minimal peak connectors */}
                            <line x1="100" y1="20" x2="100" y2="95" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                            <line x1="160" y1="25" x2="160" y2="95" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                            <line x1="0" y1="95" x2="280" y2="95" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
                        </motion.svg>
                    )}
                </AnimatePresence>

                {/* Warning Overlay */}
                {((isDay && meshDensity < 80) || (!isDay && meshDensity > 20)) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="absolute inset-0 bg-red-500/10 pointer-events-none flex items-center justify-center"
                    >
                        <span className="font-mono text-[10px] text-red-500 font-bold border border-red-500/50 px-2 py-1 bg-black/50 backdrop-blur-sm">
                            {isDay ? "LOW_FIDELITY_DETECTED" : "EFFICIENCY_VIOLATION"}
                        </span>
                    </motion.div>
                )}
            </div>

            {/* Mesh Density Slider */}
            <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                    <label className="font-mono text-[9px] text-white/40 tracking-widest uppercase">
                        MESH_DENSITY
                    </label>
                    <span className={cn(
                        "font-mono text-[10px] font-bold",
                        (isDay && meshDensity < 80) || (!isDay && meshDensity > 20) ? "text-red-500" : "text-cyan-400"
                    )}>
                        {meshDensity}%
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={meshDensity}
                    onChange={(e) => setMeshDensity(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400 outline-none transition-all hover:bg-white/20"
                />
                <div className="flex justify-between font-mono text-[8px] text-white/20 tracking-tighter">
                    <span>ECO_MODE</span>
                    <span>NOMINAL</span>
                    <span>HI_FIDELITY</span>
                </div>
            </div>
        </div>
    );
}
