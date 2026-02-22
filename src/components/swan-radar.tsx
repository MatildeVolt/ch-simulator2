'use client'

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Blip {
    id: string;
    angle: number; // in degrees
    distance: number; // 0 to 100
    speed: number;
}

interface SwanRadarProps {
    onSuccess: (id: string) => void;
    onBreach: () => void;
}

export default function SwanRadar({ onSuccess, onBreach }: SwanRadarProps) {
    const [blips, setBlips] = useState<Blip[]>([]);
    const [isBreached, setIsBreached] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Spawn and update blips
    useEffect(() => {
        // Initial burst
        setBlips(Array.from({ length: 4 }).map(() => ({
            id: Math.random().toString(36).substr(2, 9),
            angle: Math.random() * 360,
            distance: 40 + Math.random() * 60, // scattered distances
            speed: 0.2 + Math.random() * 0.4,
        })));

        const spawnInterval = setInterval(() => {
            setBlips(prev => {
                if (prev.length < 15) {
                    const newBlip: Blip = {
                        id: Math.random().toString(36).substr(2, 9),
                        angle: Math.random() * 360,
                        distance: 100,
                        speed: 0.2 + Math.random() * 0.4,
                    };
                    return [...prev, newBlip];
                }
                return prev;
            });
        }, 1000);

        const moveInterval = setInterval(() => {
            setBlips(prev => {
                const nextBlips = prev.map(blip => ({
                    ...blip,
                    distance: blip.distance - blip.speed
                }));

                // Check for breach
                const breached = nextBlips.some(b => b.distance <= 0);
                if (breached) {
                    onBreach();
                    setIsBreached(true);
                    setTimeout(() => setIsBreached(false), 1000);
                    // Remove breached blips (at most one per cycle to avoid spamming callbacks if not needed, 
                    // though multiple could breach)
                    return nextBlips.filter(b => b.distance > 0);
                }

                return nextBlips;
            });
        }, 30);

        return () => {
            clearInterval(spawnInterval);
            clearInterval(moveInterval);
        };
    }, [onBreach]);

    const handleNeutralize = (id: string) => {
        setBlips(prev => prev.filter(b => b.id !== id));
        onSuccess(id);
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full aspect-square max-w-[280px] mx-auto rounded-full border border-white/10 glass transition-colors duration-300",
                isBreached && "border-red-600 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
            )}
        >
            {/* Concentric Circles */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[75%] h-[75%] border border-white/5 rounded-full" />
                <div className="w-[50%] h-[50%] border border-white/5 rounded-full" />
                <div className="w-[25%] h-[25%] border border-white/5 rounded-full" />
                {/* Crosshair lines */}
                <div className="absolute inset-0 flex items-center transition-opacity opacity-20">
                    <div className="w-full h-[1px] bg-white/50" />
                </div>
                <div className="absolute inset-0 flex justify-center transition-opacity opacity-20">
                    <div className="h-full w-[1px] bg-white/50" />
                </div>
            </div>

            {/* Rotating Sweep */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-1/2 bg-gradient-to-t from-cyan-400/80 to-transparent origin-bottom" />
            </motion.div>

            {/* Blips */}
            <AnimatePresence>
                {blips.map((blip) => {
                    // Convert polar to cartesian
                    const rad = (blip.angle - 90) * (Math.PI / 180);
                    const x = 50 + (blip.distance / 2) * Math.cos(rad);
                    const y = 50 + (blip.distance / 2) * Math.sin(rad);

                    return (
                        <motion.button
                            key={blip.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            onClick={() => handleNeutralize(blip.id)}
                            className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 z-20 group"
                            style={{ left: `${x}%`, top: `${y}%` }}
                        >
                            <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-75 group-hover:bg-red-400" />
                            <span className="relative block w-full h-full rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] border border-white/20" />
                        </motion.button>
                    );
                })}
            </AnimatePresence>

            {/* Center Core */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm z-10">
                <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse" />
            </div>
        </div>
    );
}
