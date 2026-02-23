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
        <div className="flex flex-col h-full gap-3 pb-4">
            {/* Row 1: Header */}
            <div className="flex items-center justify-between shrink-0">
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

            {/* Row 2: Visuals — mountain + celestial body */}
            <div className="flex flex-row gap-3 flex-1 min-h-0 items-stretch">
                {/* Left: Mountain Range */}
                <div className="flex-1 flex items-center justify-center bg-black/20 rounded-xl border border-white/5 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {isDay ? (
                            <motion.svg
                                key="day-mesh"
                                width="100%"
                                height="100%"
                                viewBox="0 0 300 100"
                                preserveAspectRatio="xMidYMid meet"
                                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 1.05, y: -8 }}
                                className="drop-shadow-[0_0_15px_rgba(34,211,238,0.2)] p-2"
                            >
                                <path
                                    d="M0 90 L30 65 L50 40 L70 55 L90 25 L110 50 L130 30 L155 10 L175 38 L195 20 L215 45 L235 30 L255 55 L270 40 L290 65 L300 90 Z"
                                    stroke="rgba(34,211,238,0.8)"
                                    strokeWidth="0.8"
                                    fill="transparent"
                                />
                                <line x1="0" y1="90" x2="300" y2="90" stroke="rgba(34,211,238,0.4)" strokeWidth="0.5" />
                                {[30, 50, 70, 90, 110, 130, 155, 175, 195, 215, 235, 255, 270, 290].map((x, i) => {
                                    const ys = [65, 40, 55, 25, 50, 30, 10, 38, 20, 45, 30, 55, 40, 65];
                                    return <line key={i} x1={x} y1={ys[i]} x2={x} y2={90} stroke="rgba(34,211,238,0.25)" strokeWidth="0.3" />;
                                })}
                                <polyline points="0,90 50,40 90,25 155,10 195,20 255,55 300,90" stroke="rgba(34,211,238,0.15)" strokeWidth="0.3" fill="none" />
                                <polyline points="0,90 30,65 90,25 130,30 195,20 235,30 300,90" stroke="rgba(34,211,238,0.12)" strokeWidth="0.3" fill="none" />
                                <polyline points="0,90 70,55 110,50 155,10 215,45 270,40 300,90" stroke="rgba(34,211,238,0.12)" strokeWidth="0.3" fill="none" />
                                <circle cx="155" cy="10" r="2" fill="rgba(34,211,238,0.6)" />
                                <circle cx="195" cy="20" r="1.5" fill="rgba(34,211,238,0.4)" />
                                <circle cx="90" cy="25" r="1.5" fill="rgba(34,211,238,0.4)" />
                            </motion.svg>
                        ) : (
                            <motion.svg
                                key="night-mesh"
                                width="100%"
                                height="100%"
                                viewBox="0 0 300 100"
                                preserveAspectRatio="xMidYMid meet"
                                initial={{ opacity: 0, scale: 1.05, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                                className="p-2"
                            >
                                <path
                                    d="M0 90 L40 50 L80 70 L120 30 L160 15 L200 45 L240 30 L275 60 L300 90 Z"
                                    stroke="rgba(255,255,255,0.35)"
                                    strokeWidth="1"
                                    fill="rgba(255,255,255,0.04)"
                                />
                                <line x1="0" y1="90" x2="300" y2="90" stroke="rgba(255,255,255,0.12)" strokeWidth="0.5" />
                                <line x1="40" y1="50" x2="40" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                                <line x1="120" y1="30" x2="120" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                                <line x1="160" y1="15" x2="160" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                                <line x1="240" y1="30" x2="240" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                            </motion.svg>
                        )}
                    </AnimatePresence>

                    {/* Warning Overlay */}
                    {((isDay && meshDensity < 80) || (!isDay && meshDensity > 20)) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="absolute inset-0 bg-red-500/10 pointer-events-none flex items-end justify-center pb-2"
                        >
                            <span className="font-mono text-[8px] text-red-500 font-bold border border-red-500/50 px-2 py-0.5 bg-black/60 backdrop-blur-sm">
                                STATUS_ERR
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* Right: Celestial Body */}
                <div className="w-24 flex items-center justify-center bg-black/20 rounded-xl border border-white/5 overflow-hidden shrink-0">
                    <AnimatePresence mode="wait">
                        {isDay ? (
                            <motion.div
                                key="sun"
                                initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
                                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
                                className="relative flex items-center justify-center"
                            >
                                <div className="absolute w-10 h-10 bg-cyan-400/20 rounded-full blur-xl animate-pulse" />
                                <svg width="52" height="52" viewBox="0 0 24 24" className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                                    <circle cx="12" cy="12" r="5" fill="currentColor" />
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <line key={i} x1="12" y1="1" x2="12" y2="4"
                                            transform={`rotate(${i * 45} 12 12)`}
                                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        />
                                    ))}
                                </svg>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="moon"
                                initial={{ opacity: 0, x: 20, y: -20 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                exit={{ opacity: 0, x: -20, y: 20 }}
                                className="relative flex items-center justify-center"
                            >
                                <div className="absolute w-10 h-10 bg-white/5 rounded-full blur-lg" />
                                <svg width="52" height="52" viewBox="0 0 24 24" className="text-gray-300 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
                                </svg>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Row 3: Mesh Density Slider */}
            <div className="space-y-2 shrink-0">
                <div className="flex justify-between items-center px-1">
                    <label className="font-mono text-[9px] text-cyan-400/70 tracking-widest uppercase">
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

