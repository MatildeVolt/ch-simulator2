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
        <div className="relative w-full aspect-square max-w-[280px] mx-auto flex items-center justify-center group/radar overflow-hidden rounded-full">
            {/* Water Texture Layer */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <motion.path
                        d="M0 50 Q 25 40, 50 50 T 100 50 V 100 H 0 Z"
                        fill="url(#water-gradient)"
                        animate={{
                            d: [
                                "M0 50 Q 25 45, 50 50 T 100 50 V 100 H 0 Z",
                                "M0 50 Q 25 55, 50 50 T 100 50 V 100 H 0 Z",
                                "M0 50 Q 25 45, 50 50 T 100 50 V 100 H 0 Z",
                            ]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.path
                        d="M0 60 Q 25 50, 50 60 T 100 60 V 100 H 0 Z"
                        fill="url(#water-gradient)"
                        opacity="0.5"
                        animate={{
                            d: [
                                "M0 60 Q 25 65, 50 60 T 100 60 V 100 H 0 Z",
                                "M0 60 Q 25 55, 50 60 T 100 60 V 100 H 0 Z",
                                "M0 60 Q 25 65, 50 60 T 100 60 V 100 H 0 Z",
                            ]
                        }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    />
                    <defs>
                        <linearGradient id="water-gradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#22D3EE" stopOpacity="0.05" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

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
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.5 }}
                            onClick={() => handleBlipClick(blip.id)}
                            className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center cursor-pointer group/swan"
                            style={{
                                left: `${x}%`,
                                top: `${y}%`,
                            }}
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Swan Illustration */}
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={cn(
                                        "drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] transition-transform duration-300 group-hover/swan:scale-110",
                                        blip.angle > 90 && blip.angle < 270 ? "scale-x-1" : "scale-x-[-1]"
                                    )}
                                >
                                    {/* Body */}
                                    <path
                                        d="M4 14C4 11 6 9 9 9C11 9 12 10 13 11C14 10 16 9 18 9C20 9 22 11 22 14C22 18 18 20 13 20C8 20 4 18 4 14Z"
                                        fill="white"
                                    />
                                    {/* Neck & Head */}
                                    <path
                                        d="M13 11L14 6C14 5 15 4 16 4C17 4 18 5 18 6L18 9"
                                        stroke="white"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                    />
                                    <circle cx="16.5" cy="4.5" r="1.5" fill="white" />
                                    {/* Beak */}
                                    <path d="M17.5 4.5L20 5L18 6L17.5 4.5Z" fill="#FACC15" />
                                    {/* Eye */}
                                    <circle cx="16" cy="4" r="0.5" fill="black" />
                                </svg>

                                {/* Proximity Pulse if getting too close */}
                                {blip.distance < 30 && (
                                    <div className="absolute inset-0 border border-red-500 rounded-full animate-ping opacity-20" />
                                )}
                            </div>
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
