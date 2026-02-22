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
        <div className="flex flex-col h-full space-y-4">
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

            {/* Matterhorn Rendering Area */}
            <div className="relative flex-1 min-h-[140px] flex items-center justify-center bg-black/20 rounded-xl border border-white/5 overflow-hidden">
                <AnimatePresence mode="wait">
                    {isDay ? (
                        <motion.svg
                            key="day-mesh"
                            width="180"
                            height="120"
                            viewBox="0 0 100 80"
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.1, y: -10 }}
                            className="drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                        >
                            {/* Detailed Mesh (Day) */}
                            <path
                                d="M10 70 L50 10 L90 70 Z"
                                stroke="rgba(255,255,255,0.8)"
                                strokeWidth="0.5"
                                fill="transparent"
                            />
                            {/* Inner complexity lines based on density slider (visual only) */}
                            {Array.from({ length: Math.floor(meshDensity / 10) }).map((_, i) => (
                                <line
                                    key={i}
                                    x1={10 + i * 4}
                                    y1={70}
                                    x2={50}
                                    y2={10 + i * 5}
                                    stroke="rgba(34,211,238,0.3)"
                                    strokeWidth="0.2"
                                />
                            ))}
                            <line x1="50" y1="10" x2="50" y2="70" stroke="rgba(34,211,238,0.4)" strokeWidth="0.3" />
                            <line x1="10" y1="70" x2="90" y2="70" stroke="rgba(34,211,238,0.4)" strokeWidth="0.3" />
                        </motion.svg>
                    ) : (
                        <motion.svg
                            key="night-mesh"
                            width="180"
                            height="120"
                            viewBox="0 0 100 80"
                            initial={{ opacity: 0, scale: 1.1, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        >
                            {/* Minimalist Triangle (Night) */}
                            <path
                                d="M10 70 L50 20 L90 70 Z"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="1"
                                fill="rgba(255,255,255,0.05)"
                            />
                            <line x1="50" y1="20" x2="50" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
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
