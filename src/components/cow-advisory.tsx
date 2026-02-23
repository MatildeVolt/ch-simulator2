'use client'

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CowAdvisoryProps {
    isDay: boolean;
    meshDensity: number;
    isRadarBreach: boolean;
    isSbbOptimized: boolean;
}

const SWISS_REMARKS = [
    "// M4_LOG: Thermal levels stable. Cooler than the water in Lake Zurich.",
    "// ADVICE: Remember, a true Swiss engineer never settles for low-poly during the day.",
    "// M4_LOG: Precision is not an option, it's a demographic requirement.",
    "// ADVICE: Chocolate consumption levels are low. Calibration might be affected.",
    "// M4_LOG: Atmospheric pressure is slightly higher than a fondue pot.",
    "// ADVICE: Keep the SBB clock ticking. Time is our only currency."
];

export default function CowAdvisory({ isDay, meshDensity, isRadarBreach, isSbbOptimized }: CowAdvisoryProps) {
    const [message, setMessage] = useState("// INITIALIZING_HEURISTICS... [OK]");
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastRemarkTime = useRef(Date.now());
    const prevConditionsRef = useRef({ isDay, meshDensity, isRadarBreach, isSbbOptimized });

    // ── Logic Hub (Priority Based) ──────────────────────────────────────────
    useEffect(() => {
        let nextMsg = "";
        const isCurrentlyOptimized = isDay ? (meshDensity >= 70 && isSbbOptimized && !isRadarBreach) : (meshDensity <= 30 && isSbbOptimized && !isRadarBreach);
        const wasOptimized = prevConditionsRef.current.isDay ? (prevConditionsRef.current.meshDensity >= 70 && prevConditionsRef.current.isSbbOptimized && !prevConditionsRef.current.isRadarBreach) : (prevConditionsRef.current.meshDensity <= 30 && prevConditionsRef.current.isSbbOptimized && !prevConditionsRef.current.isRadarBreach);

        // Priority 1: ENERGY ERROR (URGENT)
        if (!isDay && meshDensity > 40) {
            nextMsg = "// URGENT: Night mode active. Decrease mesh density to save Swiss energy!";
        }
        // Priority 2: RADAR SECURITY (SECURITY)
        else if (isRadarBreach) {
            nextMsg = "// SECURITY: Swan signatures detected in the inner circle! Neutralize now!";
        }
        // Priority 3: SUCCESS (STATUS) - Triggered when moving from any error/unoptimized state to fully optimized
        else if (isCurrentlyOptimized && !wasOptimized) {
            nextMsg = "// STATUS: Calibration successful. You're as precise as a Swiss watchmaker.";
        }

        // Update if message changed
        if (nextMsg && nextMsg !== message) {
            setMessage(nextMsg);
            lastRemarkTime.current = Date.now();
        }

        prevConditionsRef.current = { isDay, meshDensity, isRadarBreach, isSbbOptimized };
    }, [isDay, meshDensity, isRadarBreach, isSbbOptimized, message]);

    // ── Random Witty Remarks (Idle) ─────────────────────────────────────────
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const isOptimized = isDay ? (meshDensity >= 70 && isSbbOptimized && !isRadarBreach) : (meshDensity <= 30 && isSbbOptimized && !isRadarBreach);

            // Only fire remarks if idle for 30s and systems are nominal
            if (now - lastRemarkTime.current > 30000 && isOptimized) {
                const randomIdx = Math.floor(Math.random() * SWISS_REMARKS.length);
                setMessage(SWISS_REMARKS[randomIdx]);
                lastRemarkTime.current = now;
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isDay, meshDensity, isRadarBreach, isSbbOptimized]);

    // ── Terminal Typing Effect (Reset on change) ───────────────────────────
    useEffect(() => {
        setDisplayedText("");
        setIsTyping(true);
        let i = 0;

        if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

        typingIntervalRef.current = setInterval(() => {
            if (i < message.length) {
                setDisplayedText(prev => prev + message.charAt(i));
                i++;
            } else {
                if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
                setIsTyping(false);
            }
        }, 20); // Fast but visible typing stroke

        return () => {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        };
    }, [message]);

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl flex items-start gap-4 transition-all duration-300 min-h-[70px]">
            {/* Minimalist Cyan Cow Icon (HUD Style) */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400 drop-shadow-glow">
                    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="9" cy="11" r="1" fill="currentColor" />
                    <circle cx="15" cy="11" r="1" fill="currentColor" />
                    <path d="M8 15.5C8 15.5 10 17.5 12 17.5C14 17.5 16 15.5 16 15.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M5 9L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M19 9L17 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>

            {/* Message Display Area */}
            <div className="flex flex-col gap-1 overflow-hidden">
                <div className="flex items-center gap-2">
                    <span className="hud-label !text-cyan-400 font-mono !text-[10px] tracking-widest opacity-100 flex items-center gap-1.5 uppercase font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        ADVISORY_CORE // CH-COW-01.AI
                    </span>
                </div>
                <div className="font-mono text-[11px] leading-relaxed text-white/90 min-h-[32px]">
                    <span className="whitespace-pre-wrap">{displayedText}</span>
                    {isTyping && <span className="inline-block w-1.5 h-3 bg-cyan-400 animate-pulse ml-0.5 align-middle" />}
                </div>
            </div>
        </div>
    );
}
