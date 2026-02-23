'use client'

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CHCOW01Props {
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

const DetailedCow = ({ isGlitching }: { isGlitching: boolean }) => {
    const primary = isGlitching ? "text-[#FF0028] drop-shadow-[0_0_8px_rgba(255,0,40,0.8)]" : "text-white/90";
    const accent = isGlitching ? "text-white font-bold" : "text-[#FF0028] font-bold drop-shadow-[0_0_8px_rgba(255,0,40,0.8)]";

    return (
        <pre className="font-mono text-[10px] leading-[1.2] sm:text-xs select-none whitespace-pre w-fit mx-auto my-4 py-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
            <div><span className={primary}>       /)  ({'\\'}</span></div>
            <div><span className={primary}>  .-._((,</span><span className={accent}>~~</span><span className={primary}>.))_.-,</span></div>
            <div><span className={primary}>   `-.   </span><span className={accent}>@@</span><span className={primary}>   ,-'</span></div>
            <div><span className={primary}>     / ,o--o. {'\\'}</span></div>
            <div><span className={primary}>    ( ( .__. ) )</span></div>
            <div><span className={primary}>     ) `----' (</span></div>
            <div><span className={primary}>    /          {'\\'}</span></div>
            <div><span className={primary}>   /  </span><span className={accent}>CH-01</span><span className={primary}>     {'\\'}</span></div>
            <div><span className={primary}>  /      </span><span className={accent}>+</span><span className={primary}>       {'\\'}</span></div>
            <div><span className={primary}>  `---s-</span><span className={accent}>+++</span><span className={primary}>-s---'</span></div>
            <div><span className={primary}>      || </span><span className={accent}>+</span><span className={primary}> ||</span></div>
            <div><span className={primary}>      ||   ||</span></div>
            <div><span className={primary}>      ))   ))</span></div>
        </pre>
    );
};

export default function CHCOW01({ isDay, meshDensity, isRadarBreach, isSbbOptimized }: CHCOW01Props) {
    const [currentMessage, setCurrentMessage] = useState("// INITIALIZING_HEURISTICS... [OK]");
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const [cursor, setCursor] = useState(true);
    const [isGlitching, setIsGlitching] = useState(false);

    const lastRemarkTime = useRef(Date.now());
    const prevConditionsRef = useRef({ isDay, meshDensity, isRadarBreach, isSbbOptimized });

    // ── Cursor Blink ────────────────────────────────────────────────────────
    useEffect(() => {
        const interval = setInterval(() => setCursor(c => !c), 500);
        return () => clearInterval(interval);
    }, []);

    // ── Priority Logic ──────────────────────────────────────────────────────
    useEffect(() => {
        let nextMsg = "";
        const isCurrentlyOptimized = isDay ? (meshDensity >= 70 && isSbbOptimized && !isRadarBreach) : (meshDensity <= 30 && isSbbOptimized && !isRadarBreach);
        const wasOptimized = prevConditionsRef.current.isDay ? (prevConditionsRef.current.meshDensity >= 70 && prevConditionsRef.current.isSbbOptimized && !prevConditionsRef.current.isRadarBreach) : (prevConditionsRef.current.meshDensity <= 30 && prevConditionsRef.current.isSbbOptimized && !prevConditionsRef.current.isRadarBreach);

        // Priority 1: ENERGY ERROR
        if (!isDay && meshDensity > 40) {
            nextMsg = "// URGENT: Night mode active. Decrease mesh density to save Swiss energy!";
        }
        // Priority 2: RADAR SECURITY
        else if (isRadarBreach) {
            nextMsg = "// SECURITY: Swan signatures detected in the inner circle! Neutralize now!";
        }
        // Priority 3: SUCCESS
        else if (isCurrentlyOptimized && !wasOptimized) {
            nextMsg = "// STATUS: Calibration successful. You're as precise as a Swiss watchmaker.";
        }

        if (nextMsg && nextMsg !== currentMessage) {
            setCurrentMessage(nextMsg);
            setDisplayedText("");
            setIsTyping(true);
            lastRemarkTime.current = Date.now();
        }

        prevConditionsRef.current = { isDay, meshDensity, isRadarBreach, isSbbOptimized };
    }, [isDay, meshDensity, isRadarBreach, isSbbOptimized, currentMessage]);

    // ── Random Witty Remarks ────────────────────────────────────────────────
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const isOptimized = isDay ? (meshDensity >= 70 && isSbbOptimized && !isRadarBreach) : (meshDensity <= 30 && isSbbOptimized && !isRadarBreach);

            if (now - lastRemarkTime.current > 30000 && isOptimized) {
                const randomIdx = Math.floor(Math.random() * SWISS_REMARKS.length);
                setCurrentMessage(SWISS_REMARKS[randomIdx]);
                setDisplayedText("");
                setIsTyping(true);
                lastRemarkTime.current = now;
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isDay, meshDensity, isRadarBreach, isSbbOptimized]);

    // ── Typing Animation ────────────────────────────────────────────────────
    useEffect(() => {
        if (!isTyping) return;
        let i = 0;
        const interval = setInterval(() => {
            if (i < currentMessage.length) {
                setDisplayedText(currentMessage.slice(0, i + 1));
                i++;
            } else {
                setIsTyping(false);
                clearInterval(interval);
            }
        }, 25);
        return () => clearInterval(interval);
    }, [currentMessage, isTyping]);

    // ── Glitch UI ───────────────────────────────────────────────────────────
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 150);
        }, 10000);
        return () => clearInterval(glitchInterval);
    }, []);

    const isAlarm = currentMessage.includes("URGENT") || currentMessage.includes("SECURITY");

    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            {/* Swiss Red Badge */}
            <div className="flex items-center justify-between z-10 relative">
                <span className={cn(
                    "neon-badge transition-colors duration-500",
                    isAlarm ? "!text-red-500 !border-red-500/40 bg-red-500/10" : "!text-[#FF0028] !border-[#FF0028]/20 bg-[#FF0028]/5"
                )}>
                    <span className={cn(
                        "w-1 h-1 rounded-full animate-pulse",
                        isAlarm ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" : "bg-[#FF0028] shadow-[0_0_8px_rgba(255,0,40,0.8)]"
                    )} />
                    CH-COW-01
                </span>
                <span className="hud-label !text-white/40 uppercase tracking-widest">
                    {isAlarm ? "CRITICAL_ADVISORY" : "BOVINE INTERFACE"}
                </span>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center relative z-0 gap-6 px-4">
                {/* ASCII Cow */}
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="shrink-0"
                >
                    <DetailedCow isGlitching={isGlitching || isAlarm} />
                </motion.div>

                {/* Speech Bubble */}
                <div className={cn(
                    "relative bg-white/10 backdrop-blur-md rounded-2xl border p-4 max-w-sm w-full shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-colors duration-500",
                    "before:content-[''] before:absolute before:border-[10px] before:border-transparent sm:before:top-1/2 sm:before:-translate-y-1/2 before:bottom-full before:left-1/2 before:-translate-x-1/2 sm:before:bottom-auto sm:before:translate-x-0",
                    isAlarm ? "border-red-500/50 before:border-r-red-500/50 before:border-b-red-500/50 sm:before:border-r-red-500/50 sm:before:border-b-transparent" : "border-white/20 before:border-r-white/20 before:border-b-white/20 sm:before:border-r-white/20 sm:before:border-b-transparent"
                )}>
                    <div className={cn(
                        "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent rounded-t-2xl",
                        isAlarm && "via-red-500/50"
                    )} />
                    <p className={cn(
                        "font-mono text-sm leading-relaxed transition-colors duration-500",
                        isAlarm ? "text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]" : "text-cyan-400 drop-shadow-[0_0_5px_rgba(69,182,254,0.5)]"
                    )}>
                        {displayedText}
                        <span className={cn(
                            "inline-block w-[6px] h-[14px] ml-1.5 align-middle transition-opacity",
                            cursor ? 'opacity-100' : 'opacity-0',
                            isAlarm ? "bg-red-500" : "bg-cyan-400"
                        )} />
                    </p>
                </div>
            </div>
        </div>
    );
}
