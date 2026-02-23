'use client'

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

interface MeshRefinerProps {
    onPenalty: (msg: string) => void;
}

// ── Pixelation CSS trick ──────────────────────────────────────────────────────
// Scale an image to (1/n) of container, then CSS-scale it back up with
// image-rendering: pixelated — no libraries needed.
// n: 1 = crisp (100% density), 20 = very pixelated (0% density)
function getPixelScale(density: number): number {
    // density 0 → n=20 (big blocks), density 100 → n=1 (crisp)
    return Math.max(1, Math.round(20 - (density / 100) * 19));
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

    const isPenalty = (isDay && meshDensity < 80) || (!isDay && meshDensity > 20);
    const pixelN = getPixelScale(meshDensity);

    // Fidelity label
    const fidelityLabel = meshDensity <= 30 ? "SKELETAL" : meshDensity <= 70 ? "MEDIUM" : "HI_FIDELITY";
    const fidelityClass = meshDensity <= 30
        ? "text-red-400 bg-red-500/10 border-red-500/30"
        : meshDensity <= 70
            ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
            : "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";

    return (
        <div className="flex flex-col h-auto pb-8 space-y-4">

            {/* ── 2-column area ─────────────────────────────────────────── */}
            <div className="grid grid-cols-[2fr_1fr] gap-3 items-stretch">

                {/* Left: Pixelating Matterhorn image */}
                <div className="relative rounded-xl border border-white/5 overflow-hidden bg-black min-h-[130px]">

                    {/* The image — pixelation trick via scale + image-rendering */}
                    <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ imageRendering: "pixelated" }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            alt="Matterhorn"
                            src="https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80"
                            className="absolute top-0 left-0 object-cover"
                            style={{
                                imageRendering: "pixelated",
                                width: `${100 / pixelN}%`,
                                height: `${100 / pixelN}%`,
                                transform: `scale(${pixelN})`,
                                transformOrigin: "top left",
                                transition: "none",
                            }}
                        />
                    </div>

                    {/* Dark overlay gradient – day lighter, night darker */}
                    <div className={cn(
                        "absolute inset-0 pointer-events-none transition-colors duration-700",
                        isDay ? "bg-gradient-to-t from-black/40 via-transparent to-black/10"
                            : "bg-gradient-to-t from-black/70 via-black/30 to-black/20"
                    )} />

                    {/* Fidelity badge bottom-left */}
                    <div className="absolute bottom-2 left-2">
                        <span className={cn("font-mono text-[8px] font-bold px-1.5 py-0.5 rounded border", fidelityClass)}>
                            {fidelityLabel} // {meshDensity}%
                        </span>
                    </div>

                    {/* Warning flash overlay */}
                    {isPenalty && (
                        <motion.div
                            animate={{ opacity: [0.1, 0.5, 0.1] }}
                            transition={{ duration: 1.2, repeat: Infinity }}
                            className="absolute inset-0 bg-red-600/20 pointer-events-none flex items-center justify-center"
                        >
                            <span className="font-mono text-[9px] text-red-400 font-bold border border-red-500/50 px-2 py-0.5 bg-black/70">
                                {isDay ? "LOW_FIDELITY_DETECTED" : "EFFICIENCY_VIOLATION"}
                            </span>
                        </motion.div>
                    )}
                </div>

                {/* Right: Day/Night status panel */}
                <div className={cn(
                    "min-h-[130px] rounded-xl border flex flex-col items-center justify-center gap-3 transition-colors duration-700",
                    isDay ? "border-cyan-500/40 bg-cyan-950/20"
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
                    <span>PIXELATED</span>
                    <span>NOMINAL</span>
                    <span>CRYSTAL_CLEAR</span>
                </div>
            </div>
        </div>
    );
}
