'use client'

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sun, Moon } from "lucide-react";

interface MeshRefinerProps {
    onPenalty: (msg: string) => void;
}

function getPixelDivisor(density: number): number {
    if (density > 95) return 1;
    if (density > 80) return 2;
    if (density > 60) return 4;
    if (density > 40) return 8;
    if (density > 20) return 12;
    return 16;
}

export default function MeshRefiner({ onPenalty }: MeshRefinerProps) {
    const [isDay, setIsDay] = useState(true);
    const [meshDensity, setMeshDensity] = useState(100);
    const [cycleTime, setCycleTime] = useState(15);
    const [isMoving, setIsMoving] = useState(false);
    const [isCycleGrace, setIsCycleGrace] = useState(false);

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

    const drawPixelated = () => {
        const canvas = canvasRef.current;
        const img = imageRef.current;
        if (!canvas || !img) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const pixelScale = getPixelDivisor(meshDensity);

        const sw = Math.max(1, Math.floor(w / pixelScale));
        const sh = Math.max(1, Math.floor(h / pixelScale));

        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, sw, sh);
        ctx.drawImage(canvas, 0, 0, sw, sh, 0, 0, w, h);
    };

    useEffect(() => {
        drawPixelated();
    }, [meshDensity]);

    // ── Day/Night Cycle Logic with Grace ─────────────────────────────────────
    useEffect(() => {
        const cycleInterval = setInterval(() => {
            setIsDay((prev) => !prev);
            setCycleTime(15);
            // Grant 3s grace period to react to the new cycle
            setIsCycleGrace(true);
            setTimeout(() => setIsCycleGrace(false), 3000);
        }, 15000);

        const timerInterval = setInterval(() => {
            setCycleTime((prev) => (prev > 0 ? prev - 1 : 15));
        }, 1000);

        return () => {
            clearInterval(cycleInterval);
            clearInterval(timerInterval);
        };
    }, []);

    // ── Energy Penalty Logic (Stationary & Clear of Grace) ───────────────────
    useEffect(() => {
        if (isMoving || isCycleGrace) return;

        const checkEnergy = () => {
            const now = Date.now();
            if (now - lastPenaltyTime.current < 2500) return;

            // Updated Thresholds (Strict but inclusive):
            // Success Day: >= 70
            // Success Night: <= 30
            if (isDay && meshDensity < 70) {
                onPenalty("LOW_FIDELITY_STATIONARY_WARNING");
                lastPenaltyTime.current = now;
            } else if (!isDay && meshDensity > 30) {
                onPenalty("ENERGY_OVERCONSUMPTION_STATIONARY");
                lastPenaltyTime.current = now;
            }
        };

        const interval = setInterval(checkEnergy, 1000);
        return () => clearInterval(interval);
    }, [isDay, meshDensity, onPenalty, isMoving, isCycleGrace]);

    const handleSliderChange = (val: number) => {
        setMeshDensity(val);
        setIsMoving(true);
        if (moveTimeout.current) clearTimeout(moveTimeout.current);
        moveTimeout.current = setTimeout(() => setIsMoving(false), 600);
    };

    // Derived Penalty State for UI
    const isPenalty = !isMoving && !isCycleGrace && ((isDay && meshDensity < 70) || (!isDay && meshDensity > 30));

    const fidelityLabel = meshDensity < 30 ? "ECO_MODE" : meshDensity < 70 ? "OPTIMIZED" : "HI_FIDELITY";
    const fidelityClass = meshDensity < 30
        ? "text-green-400 bg-green-500/10 border-green-500/30"
        : meshDensity < 70
            ? "text-yellow-400 bg-yellow-500/10 border-yellow-500/30"
            : "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";

    return (
        <div className="flex flex-col h-auto pb-8 space-y-4">
            {/* ── 2-Column Grid Area ────────────────────────────────────── */}
            <div className="grid grid-cols-[2fr_1fr] gap-3 items-stretch">

                {/* Left: Pixelating Canvas */}
                <div className="relative rounded-xl border border-white/5 overflow-hidden bg-black min-h-[130px] flex items-center justify-center">
                    <canvas ref={canvasRef} width={400} height={260} className="w-full h-full object-cover" />

                    <div className={cn(
                        "absolute inset-0 pointer-events-none transition-colors duration-700",
                        isDay ? "bg-gradient-to-t from-black/40 via-transparent"
                            : "bg-gradient-to-t from-black/70 via-black/40 font-bold"
                    )} />

                    <div className="absolute bottom-2 left-2">
                        <span className={cn("font-mono text-[8px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-tighter", fidelityClass)}>
                            {fidelityLabel} / {meshDensity}%
                        </span>
                    </div>



                    {/* Cycle Grace Indicator */}
                    {isCycleGrace && (
                        <div className="absolute top-2 right-2">
                            <span className="font-mono text-[8px] bg-white/10 text-white/40 px-1 py-0.5 rounded animate-pulse uppercase">
                                Cycle Syncing...
                            </span>
                        </div>
                    )}
                </div>

                {/* Right: Day/Night Status Panel */}
                <div className={cn(
                    "min-h-[130px] rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors duration-700 px-2 text-center relative overflow-hidden",
                    isPenalty
                        ? "border-red-500/50 bg-red-950/20"
                        : isDay
                            ? "border-cyan-500/40 bg-cyan-950/10"
                            : "border-slate-600/40 bg-slate-900/40"
                )}>
                    {isCycleGrace && (
                        <motion.div
                            className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20"
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 3, ease: "linear" }}
                        />
                    )}

                    <AnimatePresence mode="wait">
                        {isDay ? (
                            <motion.div key="sun" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center gap-1">
                                <Sun className={cn("w-10 h-10 transition-colors", isPenalty ? "text-red-500" : "text-cyan-400")} strokeWidth={1} />
                                <span className={cn("font-mono text-[10px] font-bold tracking-widest", isPenalty ? "text-red-500" : "text-cyan-400")}>DAY_CYCLE</span>
                            </motion.div>
                        ) : (
                            <motion.div key="moon" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                className="flex flex-col items-center gap-1">
                                <Moon className={cn("w-10 h-10 transition-colors", isPenalty ? "text-red-500" : "text-white")} strokeWidth={1} />
                                <span className={cn("font-mono text-[10px] font-bold tracking-widest", isPenalty ? "text-red-500" : "text-white/60")}>NIGHT_CYCLE</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col items-center gap-0.5 z-10">
                        <span className={cn(
                            "font-mono text-[8px] font-bold px-1.5 py-0.5 rounded tracking-tighter uppercase transition-colors",
                            isPenalty ? "bg-red-500/20 text-red-400" : "bg-cyan-500/10 text-cyan-400/70"
                        )}>
                            {isPenalty ? "[!] SYSTEM_VIOLATION" : isCycleGrace ? "[*] WAIT_SYNC" : "[✓] NOMINAL_OP"}
                        </span>
                        <span className="font-mono text-[9px] text-white/30 font-bold uppercase tracking-tight">T–{cycleTime}S</span>
                    </div>
                </div>
            </div>

            {/* Mesh Density Slider with Visual Range Hints */}
            <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                    <label className="font-mono text-[9px] text-white/40 tracking-widest uppercase flex items-center gap-2">
                        <span>MESH_DENSITY</span>
                        {isMoving && <span className="w-1 h-1 rounded-full bg-cyan-400 animate-ping" />}
                    </label>
                    <span className={cn(
                        "font-mono text-[10px] font-bold transition-all",
                        isPenalty ? "text-red-500 scale-110" : "text-cyan-400"
                    )}>
                        {meshDensity}%
                    </span>
                </div>

                <div className="relative pt-1">
                    {/* Visual markers for thresholds */}
                    <div className="absolute top-0 left-[30%] w-px h-1 bg-white/20" />
                    <div className="absolute top-0 left-[70%] w-px h-1 bg-white/20" />

                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={meshDensity}
                        onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400 outline-none transition-all hover:bg-white/20"
                    />
                </div>

                <div className="flex justify-between font-mono text-[8px] text-white/15 tracking-tighter uppercase px-1">
                    <span className={cn(!isDay && "text-green-500/50")}>ECO_LO</span>
                    <span className="opacity-40">NOMINAL</span>
                    <span className={cn(isDay && "text-cyan-500/50")}>HDR_SYNC</span>
                </div>
            </div>
        </div>
    );
}
