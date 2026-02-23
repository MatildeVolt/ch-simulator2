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

const INITIAL_INSTRUCTION = "Adjust mesh density to match the solar cycle. High-fidelity rendering is restricted to daylight hours for energy optimization.";

export default function CowAdvisory({ isDay, meshDensity, isRadarBreach, isSbbOptimized }: CowAdvisoryProps) {
    const [message, setMessage] = useState(`// ADVISORY: ${INITIAL_INSTRUCTION}`);
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
        // Priority 3: SUCCESS (STATUS)
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
        }, 20);

        return () => {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        };
    }, [message]);

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl flex flex-col gap-2 transition-all duration-300 min-h-[85px]">
            <div className="flex items-center justify-between">
                <div className="hud-label !text-cyan-400 font-mono !text-[10px] tracking-widest opacity-100 uppercase font-bold flex items-center gap-1.5">
                    <span className={cn(
                        "w-1.5 h-1.5 rounded-full animate-pulse",
                        message.includes("URGENT") || message.includes("SECURITY") ? "bg-red-500" : "bg-cyan-400"
                    )} />
                    {message.includes("URGENT") || message.includes("SECURITY") ? "// ALERT_CORE" : "// RESOURCE_MANAGEMENT"}
                </div>

                {/* Minimalist Cow Indication */}
                <div className="text-[10px] font-mono text-white/30 flex items-center gap-1">
                    CH-COW-01.AI <span className="text-cyan-400/50">●</span>
                </div>
            </div>

            <div className="font-mono text-[11px] leading-relaxed min-h-[32px] transition-colors duration-500">
                <span className={cn(
                    "whitespace-pre-wrap",
                    message.includes("URGENT") || message.includes("SECURITY") ? "text-red-400" : "text-white/70"
                )}>
                    {displayedText}
                </span>
                {isTyping && (
                    <span className={cn(
                        "inline-block w-1.5 h-3 animate-pulse ml-0.5 align-middle",
                        message.includes("URGENT") || message.includes("SECURITY") ? "bg-red-500" : "bg-cyan-400"
                    )} />
                )}
            </div>
        </div>
    );
}
