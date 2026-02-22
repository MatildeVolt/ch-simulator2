'use client'

import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

interface SBBEngineProps {
    onRecover: () => void;
}

export default function SBBEngine({ onRecover }: SBBEngineProps) {
    const [delay, setDelay] = useState(0); // 0 = nominal
    const [isHoldingBtn, setIsHoldingBtn] = useState(false);

    // Clock Refs for direct DOM manipulation to avoid re-renders on RequestAnimationFrame
    const secondHandRef = useRef<HTMLDivElement>(null);
    const minuteHandRef = useRef<HTMLDivElement>(null);
    const hourHandRef = useRef<HTMLDivElement>(null);

    const requestRef = useRef<number>(null);
    const [timeStopped, setTimeStopped] = useState(false);

    // Track state for the train drift
    const driftIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Clock Logic
    useEffect(() => {
        let startTime = Date.now();
        let accumulatedTime = 0; // ms
        let currentMinute = new Date().getMinutes();

        // Randomize initial time for simulation visually
        let simulatedHour = new Date().getHours() % 12;
        let simulatedMinute = new Date().getMinutes();

        const animateClock = () => {
            if (timeStopped) {
                // If stopped, just keep the current startTime pushed forward
                startTime = Date.now() - accumulatedTime;
                requestRef.current = requestAnimationFrame(animateClock);
                return;
            }

            const now = Date.now();
            accumulatedTime = now - startTime;

            // The Swiss Sweep cycle is exactly 60 seconds.
            // But the hand does 360 degrees in 58.5s, then pauses for 1.5s at 0.
            const cycleMs = 60000;
            const cyclePos = accumulatedTime % cycleMs;

            const sweepTimeMs = 58500;
            const pauseTimeMs = 1500;

            let secondDegrees = 0;

            if (cyclePos < sweepTimeMs) {
                // Moving linearly from 0 to 360 over 58.5 seconds
                secondDegrees = (cyclePos / sweepTimeMs) * 360;
            } else {
                // Paused at 12 o'clock
                secondDegrees = 0;

                // Jump the minute hand if we just hit the pause
                const expectedMinute = Math.floor(accumulatedTime / cycleMs) + currentMinute;
                if (expectedMinute !== simulatedMinute) {
                    simulatedMinute = expectedMinute;
                    // Hour moves smoothly based on minutes
                    simulatedHour = (simulatedHour + 1 / 60) % 12;
                }
            }

            // Update DOM directly for smooth animation 
            if (secondHandRef.current) {
                secondHandRef.current.style.transform = `rotate(${secondDegrees}deg)`;
            }
            if (minuteHandRef.current) {
                minuteHandRef.current.style.transform = `rotate(${simulatedMinute * 6}deg)`;
            }
            if (hourHandRef.current) {
                hourHandRef.current.style.transform = `rotate(${(simulatedHour * 30) + (simulatedMinute * 0.5)}deg)`;
            }

            requestRef.current = requestAnimationFrame(animateClock);
        };

        requestRef.current = requestAnimationFrame(animateClock);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [timeStopped]);

    // Train Drift Logic
    useEffect(() => {
        const triggerDrift = () => {
            if (delay === 0) {
                const possibleDelays = [3, 5, 8];
                const r = possibleDelays[Math.floor(Math.random() * possibleDelays.length)];
                setDelay(r);
            }
        };

        // Every 20 seconds, there is a chance for drift if not already delayed
        driftIntervalRef.current = setInterval(() => {
            if (!timeStopped && delay === 0) {
                triggerDrift();
            }
        }, 20000);

        return () => {
            if (driftIntervalRef.current) clearInterval(driftIntervalRef.current);
        };
    }, [delay, timeStopped]);

    // Button Hold Logic (countdown delay)
    useEffect(() => {
        let holdTimer: NodeJS.Timeout;
        if (isHoldingBtn && delay > 0) {
            setTimeStopped(true);
            holdTimer = setInterval(() => {
                setDelay((prev) => {
                    const next = prev - 1;
                    if (next <= 0) {
                        clearInterval(holdTimer);
                        setIsHoldingBtn(false);
                        setTimeStopped(false);
                        onRecover(); // Trigger the log event
                        return 0;
                    }
                    return next;
                });
            }, 1000); // Decrement 1 second of delay per real 1 second of holding
        } else {
            setTimeStopped(false);
        }

        return () => {
            if (holdTimer) clearInterval(holdTimer);
        };
    }, [isHoldingBtn, delay, onRecover]);


    const handlePointerDown = () => {
        setIsHoldingBtn(true);
    };

    const handlePointerUp = () => {
        setIsHoldingBtn(false);
    };

    return (
        <div className="flex flex-col items-center gap-3">

            {/* Clock Face container */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)] border-4 border-[#222] shrink-0">

                {/* Clock Indices */}
                {[...Array(60)].map((_, i) => {
                    const isHour = i % 5 === 0;
                    return (
                        <div
                            key={i}
                            className="absolute left-1/2 top-0 bottom-0 w-[1px] sm:w-[2px] -translate-x-1/2"
                            style={{ transform: `rotate(${i * 6}deg)` }}
                        >
                            <div className={cn(
                                "mx-auto bg-black",
                                isHour ? "w-1 h-2" : "w-0.5 h-1"
                            )} style={{ marginTop: '1px' }} />
                        </div>
                    )
                })}

                {/* Clock Hands */}
                {/* Hour */}
                <div
                    ref={hourHandRef}
                    className="absolute left-1/2 top-1/4 w-1 h-1/4 bg-black origin-bottom -translate-x-1/2 rounded-full"
                    style={{ transformOrigin: '50% 100%' }}
                />

                {/* Minute */}
                <div
                    ref={minuteHandRef}
                    className="absolute left-1/2 top-[10%] w-0.5 sm:w-1 h-[40%] bg-black origin-bottom -translate-x-1/2 rounded-full"
                    style={{ transformOrigin: '50% 100%' }}
                />

                {/* Second (Swiss Red) */}
                <div
                    ref={secondHandRef}
                    className="absolute left-1/2 top-[5%] w-[2px] h-[60%] bg-[#DC2626] origin-[50%_75%] -translate-x-1/2 shadow-[0_0_5px_rgba(220,38,38,0.5)] z-10"
                >
                    {/* The iconic bulb */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[#DC2626] rounded-full" />
                </div>

                {/* Center Cap */}
                <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-black rounded-full -translate-x-1/2 -translate-y-1/2 z-20" />
            </div>

            {/* Button */}
            <button
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onContextMenu={(e) => e.preventDefault()}
                className={cn(
                    "w-full py-2 bg-black/40 rounded-xl font-mono text-[10px] sm:text-xs font-black transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] active:scale-95 select-none relative overflow-hidden group shrink-0",
                    delay > 0 ? "bg-[#DC2626] text-white hover:bg-[#B91C1C] drop-shadow-[0_0_10px_rgba(220,38,38,0.5)] animate-pulse hover:animate-none border-none" : "text-white/50 border border-white/10 hover:border-white/20 hover:text-white/80"
                )}
            >
                {delay > 0 ? "EMERGENCY SYNC [HOLD]" : "NOMINAL SYNC"}

                {isHoldingBtn && delay > 0 && (
                    <div className="absolute top-0 left-0 h-full bg-white/20 animate-[pulse_0.2s_ease-in-out_infinite]" style={{ width: '100%' }} />
                )}
            </button>

            {/* Train Track Mini-Game */}
            <div className="w-full h-16 relative border-b-2 border-dashed border-white/10 overflow-visible shrink-0 flex items-end">
                <motion.div
                    initial={{ left: "-30%" }}
                    animate={{ left: "120%" }}
                    transition={{
                        duration: delay > 0 ? 12 : 6, // Slow down when delayed 
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute bottom-1 z-30 w-max"
                >
                    {/* Train Graphic SVG */}
                    <div className={cn(
                        "relative flex items-end justify-center transition-all duration-500",
                        delay > 0 ? "drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] brightness-75" : "drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                    )}>
                        <svg
                            width="90"
                            height="36"
                            viewBox="0 0 90 36"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="shrink-0"
                        >
                            {/* Main Red Body */}
                            <path d="M4 0H86C88.2091 0 90 1.79086 90 4V30C90 31.1046 89.1046 32 88 32H2C0.89543 32 0 31.1046 0 30V4C0 1.79086 1.79086 0 4 0Z" fill="#DC2626" />

                            {/* Dark Windows */}
                            <path d="M5 4H20V14H5V4Z" fill="#1F2937" />
                            <path d="M24 4H43V14H24V4Z" fill="#1F2937" />
                            <path d="M47 4H66V14H47V4Z" fill="#1F2937" />
                            <path d="M70 4H85V14H70V4Z" fill="#1F2937" />

                            {/* White Horizontal Stripe */}
                            <rect y="17" width="90" height="3" fill="white" />

                            {/* Swiss Cross */}
                            <path fillRule="evenodd" clipRule="evenodd" d="M47 22H43V24H41V28H43V30H47V28H49V24H47V22ZM46 25H44V27H46V25ZM46 25V23H44V25H42V27H44V29H46V27H48V25H46Z" fill="white" />

                            {/* Wheels / Undercarriage */}
                            <rect x="15" y="32" width="60" height="3" rx="1.5" fill="#374151" />
                            <circle cx="20" cy="34" r="2" fill="#111827" />
                            <circle cx="25" cy="34" r="2" fill="#111827" />
                            <circle cx="65" cy="34" r="2" fill="#111827" />
                            <circle cx="70" cy="34" r="2" fill="#111827" />
                        </svg>
                    </div>

                    {/* Delay Bubble */}
                    {delay > 0 && (
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#DC2626] text-white text-[9px] sm:text-[10px] font-black font-mono px-2 py-0.5 rounded-full border border-white/20 shadow-[0_0_8px_rgba(220,38,38,0.8)] z-40 whitespace-nowrap">
                            +{delay}s
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
