'use client'

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastRemarkTime = useRef(Date.now());

    // ── Logic Hub ────────────────────────────────────────────────────────────
    useEffect(() => {
        let nextMsg = "";

        if (isRadarBreach) {
            nextMsg = "// ALERT: Perimeter compromised. Less fondue, more focus on the radar!";
        } else if (!isDay && meshDensity > 40) {
            nextMsg = "// ADVISORY: Too much energy for the night cycle. Pixelate the Matterhorn to save Swiss power!";
        } else if (isDay && meshDensity >= 70 && isSbbOptimized && !isRadarBreach) {
            nextMsg = "// STATUS: All systems nominal. Precision levels are matching the SBB clocks.";
        }

        if (nextMsg && nextMsg !== message) {
            setMessage(nextMsg);
            lastRemarkTime.current = Date.now(); // Reset remark timer on priority message
        }
    }, [isDay, meshDensity, isRadarBreach, isSbbOptimized, message]);

    // ── Random Witty Remarks ────────────────────────────────────────────────
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            if (now - lastRemarkTime.current > 30000) {
                const randomIdx = Math.floor(Math.random() * SWISS_REMARKS.length);
                setMessage(SWISS_REMARKS[randomIdx]);
                lastRemarkTime.current = now;
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // ── Terminal Typing Effect ──────────────────────────────────────────────
    useEffect(() => {
        setDisplayedText("");
        setIsTyping(true);
        let i = 0;

        if (typingTimeoutRef.current) clearInterval(typingTimeoutRef.current);

        typingTimeoutRef.current = setInterval(() => {
            if (i < message.length) {
                setDisplayedText(prev => prev + message.charAt(i));
                i++;
            } else {
                if (typingTimeoutRef.current) clearInterval(typingTimeoutRef.current);
                setIsTyping(false);
            }
        }, 30);

        return () => {
            if (typingTimeoutRef.current) clearInterval(typingTimeoutRef.current);
        };
    }, [message]);

    return (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl flex items-start gap-4 transition-all duration-300 min-h-[70px]">
            {/* Minimalist Cyan Cow Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400 drop-shadow-glow">
                    <path d="M12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M9 11C9 10.4477 9.44772 10 10 10C10.5523 10 11 10.4477 11 11C11 11.5523 10.5523 12 10 12C9.44772 12 9 11.5523 9 11Z" fill="currentColor" />
                    <path d="M13 11C13 10.4477 13.4477 10 14 10C14.5523 10 15 10.4477 15 11C15 11.5523 14.5523 12 14 12C13.4477 12 13 11.5523 13 11Z" fill="currentColor" />
                    <path d="M8 15C8 15 10 17 12 17C14 17 16 15 16 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M5 8L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M19 8L17 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>

            {/* Message Display */}
            <div className="flex flex-col gap-1 overflow-hidden">
                <div className="flex items-center gap-2">
                    <span className="hud-label !text-cyan-400 font-mono !text-[10px] tracking-widest opacity-100 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        ADVISORY_HUB // CH-COW-01.AI
                    </span>
                </div>
                <div className="font-mono text-[11px] leading-relaxed text-white/80 min-h-[32px]">
                    <span className="whitespace-pre-wrap">{displayedText}</span>
                    {isTyping && <span className="inline-block w-1.5 h-3 bg-cyan-400 animate-pulse ml-0.5 align-middle" />}
                </div>
            </div>
        </div>
    );
}
