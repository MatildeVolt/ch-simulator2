'use client'

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Blip {
    id: number;
    angle: number; // 0 to 360
    distance: number; // 100 to 0 (edge to center)
    speed: number;
}

interface SwanRadarProps {
    onBreach: () => void;
}

export default function SwanRadar({ onBreach }: SwanRadarProps) {
    const [blips, setBlips] = useState<Blip[]>([]);
    const nextId = useRef(1);

    // Initial spawn
    useEffect(() => {
        const initialBlips = Array.from({ length: 3 }).map(() => ({
            id: nextId.current++,
            angle: Math.random() * 360,
            distance: 80 + Math.random() * 20,
            speed: 0.05 + Math.random() * 0.1
        }));
        setBlips(initialBlips);
    }, []);

    // Movement Logic
    useEffect(() => {
        const moveBlips = () => {
            setBlips((current) => {
                let breachDetected = false;
                const nextBlips = current.map(blip => {
                    const nextDist = blip.distance - blip.speed;
                    if (nextDist <= 2) {
                        breachDetected = true;
                        // Respawn immediately to maintain 3
                        return {
                            id: nextId.current++,
                            angle: Math.random() * 360,
                            distance: 100,
                            speed: 0.05 + Math.random() * 0.1
                        };
                    }
                    return { ...blip, distance: nextDist };
                });

                if (breachDetected) {
                    onBreach();
                }
                return nextBlips;
            });
        };

        const interval = setInterval(moveBlips, 16); // ~60fps
        return () => clearInterval(interval);
    }, [onBreach]);

    const handleBlipClick = (id: number) => {
        setBlips((current) =>
            current.map(blip => blip.id === id ? {
                id: nextId.current++,
                angle: Math.random() * 360,
                distance: 100,
                speed: 0.05 + Math.random() * 0.1
            } : blip)
        );
    };

    return (
        <div className="relative w-full aspect-square max-w-[280px] mx-auto flex items-center justify-center group/radar">
            {/* Radar Grid Circles */}
            <div className="absolute inset-0 border border-cyan-500/10 rounded-full" />
            <div className="absolute inset-[15%] border border-cyan-500/20 rounded-full" />
            <div className="absolute inset-[30%] border border-cyan-500/20 rounded-full" />
            <div className="absolute inset-[45%] border border-cyan-500/30 rounded-full" />

            {/* Center Dot */}
            <div className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)] z-20" />

            {/* Scanning Sweep Line */}
            <motion.div
                className="absolute w-1/2 h-[1px] bg-gradient-to-r from-transparent to-cyan-400/80 origin-left left-1/2 top-1/2 z-10"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ filter: "drop-shadow(0 0 4px rgba(34,211,238,0.5))" }}
            />

            {/* Blips */}
            <AnimatePresence>
                {blips.map((blip) => {
                    const rad = (blip.angle * Math.PI) / 180;
                    const x = 50 + (blip.distance / 2) * Math.cos(rad);
                    const y = 50 + (blip.distance / 2) * Math.sin(rad);

                    return (
                        <motion.button
                            key={blip.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 0.8, scale: 1 }}
                            exit={{ opacity: 0, scale: 2 }}
                            onClick={() => handleBlipClick(blip.id)}
                            className="absolute w-4 h-4 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center cursor-pointer"
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                            }}
                        >
                            <div className="w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_12px_rgba(34,211,238,1)] animate-pulse" />
                            <div className="absolute inset-0 border border-cyan-400 rounded-full animate-ping opacity-40" />
                        </motion.button>
                    );
                })}
            </AnimatePresence>

            {/* HUD Markings */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full pb-1 text-[8px] font-mono text-cyan-400/40">000°</div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full pt-1 text-[8px] font-mono text-cyan-400/40">180°</div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-1 text-[8px] font-mono text-cyan-400/40">270°</div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full pl-1 text-[8px] font-mono text-cyan-400/40">090°</div>
        </div>
    );
}
