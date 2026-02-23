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
    const [isMoving, setIsMoving] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const lastPenaltyTime = useRef(0);
    const moveTimeout = useRef<NodeJS.Timeout | null>(null);

    // ── Load Image ──────────────────────────────────────────────────────────
    useEffect(() => {
        const img = new Image();
        img.src = "/matterhorn-custom.jpg";
        img.onload = () => {
            imageRef.current = img;
            drawPixelated();
        };
    }, []);

    // ── Draw Logic ──────────────────────────────────────────────────────────
    const drawPixelated = () => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;

        // Density determines the "internal" resolution
        // 100% -> full res, 0% -> very low res
        // We range from 1x (crisp) to 20x (pixelated)
        const pixelScale = Math.max(1, Math.round(20 - (meshDensity / 100) * 19));

        const sw = Math.max(1, Math.floor(w / pixelScale));
        const sh = Math.max(1, Math.floor(h / pixelScale));

        // Disable smoothing for blocky look
        ctx.imageSmoothingEnabled = false;

        // Draw downscaled to a temporary area or directly using scaling
        // Best way: draw small then draw back large
        ctx.clearRect(0, 0, w, h);

        // Use an offscreen context-like approach by drawing small on the same canvas area
        // or just using the drawImage parameters for scaling
        ctx.drawImage(img, 0, 0, sw, sh);
        ctx.drawImage(canvas, 0, 0, sw, sh, 0, 0, w, h);
    };

    // Redraw whenever density changes
    useEffect(() => {
        drawPixelated();
    }, [meshDensity]);

    // ── Day/Night Cycle ──────────────────────────────────────────────────────
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

    // Energy Penalty Logic (Stationary Only)
    useEffect(() => {
        if (isMoving) return;

        const checkEnergy = () => {
            const now = Date.now();
            if (now - lastPenaltyTime.current < 2000) return;

            if (isDay && meshDensity <= 70) {
                onPenalty("LOW_FIDELITY_STATIONARY_WARNING");
                lastPenaltyTime.current = now;
            } else if (!isDay && meshDensity >= 30) {
                onPenalty("ENERGY_OVERCONSUMPTION_STATIONARY");
                lastPenaltyTime.current = now;
            }
        };

        const interval = setInterval(checkEnergy, 1000);
        return () => clearInterval(interval);
    }, [isDay, meshDensity, onPenalty, isMoving]);

    const handleSliderChange = (val: number) => {
        setMeshDensity(val);
        setIsMoving(true);

        if (moveTimeout.current) clearTimeout(moveTimeout.current);
        moveTimeout.current = setTimeout(() => {
            setIsMoving(false);
        }, 500);
    };

    const isPenalty = !isMoving && ((isDay && meshDensity <= 70) || (!isDay && meshDensity >= 30));

    // Fidelity Label
    const fidelityLabel = meshDensity <= 30 ? "SKELETAL" : meshDensity <= 70 ? "MEDIUM" : "HI_FIDELITY";
    const fidelityClass = meshDensity <= 30
        ? "text-red-400 bg-red-500/10 border-red-500/30"
        : meshDensity <= 70
            ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
            : "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";

    return (
        <div className="flex flex-col h-auto pb-8 space-y-4">
            {/* ── 2-Column Grid Area ────────────────────────────────────── */}
            <div className="grid grid-cols-[2fr_1fr] gap-3 items-stretch">

                {/* Left: Pixelating Canvas */}
                <div className="relative rounded-xl border border-white/5 overflow-hidden bg-black min-h-[130px] flex items-center justify-center">
                    <canvas
                        ref={canvasRef}
                        width={400} // High base resolution for the canvas element itself
                        height={260}
                        className="w-full h-full object-cover"
                    />

                    {/* Dark Overlay Gradient */}
                    <div className={cn(
                        "absolute inset-0 pointer-events-none transition-colors duration-700",
                        isDay ? "bg-gradient-to-t from-black/40 via-transparent"
                            : "bg-gradient-to-t from-black/70 via-black/40"
                    )} />

                    {/* Fidelity Badge */}
                    <div className="absolute bottom-2 left-2">
                        <span className={cn("font-mono text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-tighter", fidelityClass)}>
                            {fidelityLabel} / {meshDensity}%
                        </span>
                    </div>

                    {/* Stationary Penalty Flash Overlay */}
                    <AnimatePresence>
                        {isPenalty && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 1, 0] }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, repeat: Infinity }}
                                className="absolute inset-0 bg-red-500/10 pointer-events-none flex items-center justify-center placeholder-shift-fix"
                            >
                                <span className="font-mono text-[9px] text-red-500 font-bold border border-red-500/50 px-2 py-0.5 bg-black/80 backdrop-blur-sm">
                                    {isDay ? "LOW_FIDELITY_DETECTED" : "EFFICIENCY_VIOLATION"}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Day/Night Status Panel */}
                <div className={cn(
                    "min-h-[130px] rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors duration-700 px-2 text-center",
                    isPenalty
                        ? "border-red-500/50 bg-red-950/20"
                        : isDay
                            ? "border-cyan-500/40 bg-cyan-950/20"
                            : "border-slate-600/40 bg-slate-900/40"
                )}>
                    <AnimatePresence mode="wait">
                        {isDay ? (
                            <motion.div key="sun" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                className="flex flex-col items-center gap-1">
                                <Sun className={cn("w-10 h-10 transition-colors", isPenalty ? "text-red-500" : "text-cyan-400")} strokeWidth={1.2} />
                                <span className={cn("font-mono text-[9px] font-bold tracking-widest", isPenalty ? "text-red-500" : "text-cyan-400")}>DAY</span>
                            </motion.div>
                        ) : (
                            <motion.div key="moon" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                className="flex flex-col items-center gap-1">
                                <Moon className={cn("w-10 h-10 transition-colors", isPenalty ? "text-red-500" : "text-white")} strokeWidth={1.2} />
                                <span className={cn("font-mono text-[9px] font-bold tracking-widest", isPenalty ? "text-red-500" : "text-white/60")}>NIGHT</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col items-center gap-0.5">
                        <span className={cn(
                            "font-mono text-[8px] font-bold px-1.5 py-0.5 rounded tracking-tighter uppercase",
                            isPenalty ? "bg-red-500/20 text-red-500" : "bg-cyan-500/20 text-cyan-400"
                        )}>
                            {isPenalty ? "[STATUS: VIOLATION]" : "[STATUS: OPTIMIZED]"}
                        </span>
                        <span className="font-mono text-[9px] text-white/30 font-bold uppercase tracking-tight">Cycle: {cycleTime}S</span>
                    </div>
                </div>
            </div>

            {/* Mesh Density Slider */}
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="font-mono text-[9px] text-white/40 tracking-widest uppercase">
                        MESH_DENSITY
                    </label>
                    <span className={cn(
                        "font-mono text-[10px] font-bold transition-colors",
                        isPenalty ? "text-red-500" : "text-cyan-400"
                    )}>
                        {meshDensity}%
                    </span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={meshDensity}
                    onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400 outline-none transition-all hover:bg-white/20"
                />
                <div className="flex justify-between font-mono text-[8px] text-white/15 tracking-tighter uppercase relative">
                    <span>BLOCKY</span>
                    <span className="absolute left-1/2 -translate-x-1/2">NOMINAL</span>
                    <span>HIGH_RES</span>
                </div>
            </div>
        </div>
    );
}
