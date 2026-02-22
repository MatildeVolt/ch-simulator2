'use client'

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const STATUS_MESSAGES = [
    "KERNEL LOAD: 99.7% — All sectors nominal.",
    "SUBJECT COUNT: 8,720,421 — Deviation within tolerance.",
    "WEATHER SYNC: Initializing precipitation override for Berne.",
    "CULTURAL MATRIX: Fondue module v4.2 — STABLE.",
    "EXPORT SURPLUS: CHF 49.2B — Timeline consistent.",
    "BORDER RENDER: Mountain pass textures reloading...",
    "DEMOCRACY SCRIPT: Running. 99.1% acceptance rate.",
    "TRAIN DELAY: Anomaly detected. Dispatching patch 0.003ms.",
    "BANKING MODULE: Offshore encryption layer — ONLINE.",
    "CLOCK SYNC: ±0.001ms. Subjects remain unaware.",
    "ALPS RENDERING: LOD level 4 active. No subjects near debug zone.",
    "POPULATION MOOD: NEUTRAL. Chocolate distribution nominal.",
    "LANGUAGE MATRIX: 4 protocols active. Divergence: 0%.",
    "NEUTRALITY CORE: Stable. All military override — DORMANT.",
    "SIMULATION INTEGRITY: 99.9998% — Variance acceptable.",
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

export default function CHCOW01() {
    const [currentMessage, setCurrentMessage] = useState(STATUS_MESSAGES[0]);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const [cursor, setCursor] = useState(true);
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setCursor(c => !c), 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const next = STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)];
            setCurrentMessage(next);
            setDisplayedText("");
            setIsTyping(true);
        }, 5000); // Changed to 5000ms as requested
        return () => clearInterval(interval);
    }, []);

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

    useEffect(() => {
        const glitchInterval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 150);
        }, 10000);
        return () => clearInterval(glitchInterval);
    }, []);

    return (
        <div className="flex flex-col gap-4 h-full overflow-hidden">
            {/* Swiss Red Badge */}
            <div className="flex items-center justify-between z-10 relative">
                <span className="neon-badge !text-[#FF0028] !border-[#FF0028]/20 bg-[#FF0028]/5">
                    <span className="w-1 h-1 rounded-full bg-[#FF0028] shadow-[0_0_8px_rgba(255,0,40,0.8)] animate-pulse" />
                    CH-COW-01
                </span>
                <span className="hud-label !text-white/40">BOVINE INTERFACE</span>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center relative z-0 gap-6 px-4">
                {/* ASCII Cow with Framer Motion floating and Glitch */}
                <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="shrink-0"
                >
                    <DetailedCow isGlitching={isGlitching} />
                </motion.div>

                {/* Speech Bubble */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 max-w-sm w-full shadow-[0_4px_30px_rgba(0,0,0,0.1)] before:content-[''] before:absolute before:border-[10px] before:border-transparent before:border-r-white/20 before:border-b-white/20 sm:before:top-1/2 sm:before:-translate-y-1/2 sm:before:-left-[20px] before:bottom-full before:left-1/2 before:-translate-x-1/2 sm:before:bottom-auto sm:before:translate-x-0 hidden sm:block">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#45B6FE]/50 to-transparent rounded-t-2xl" />
                    <p className="font-mono text-sm text-cyan-400 leading-relaxed drop-shadow-[0_0_5px_rgba(69,182,254,0.5)]">
                        {displayedText}
                        <span className={`inline-block w-[6px] h-[14px] bg-cyan-400 ml-1.5 align-middle ${cursor ? 'opacity-100' : 'opacity-0'}`} />
                    </p>
                </div>
                {/* Mobile Speech Bubble (tail points up) */}
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 max-w-sm w-full shadow-[0_4px_30px_rgba(0,0,0,0.1)] before:content-[''] before:absolute before:border-[10px] before:border-transparent before:border-b-white/20 before:bottom-full before:left-1/2 before:-translate-x-1/2 sm:hidden mt-2">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#45B6FE]/50 to-transparent rounded-t-2xl" />
                    <p className="font-mono text-sm text-cyan-400 leading-relaxed drop-shadow-[0_0_5px_rgba(69,182,254,0.5)]">
                        {displayedText}
                        <span className={`inline-block w-[6px] h-[14px] bg-cyan-400 ml-1.5 align-middle ${cursor ? 'opacity-100' : 'opacity-0'}`} />
                    </p>
                </div>
            </div>

            {/* Terminal Output */}
            <div className="bg-black/80 backdrop-blur-md rounded-xl border border-white/10 p-4 relative group/terminal z-10 mt-auto hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#45B6FE]/50 to-transparent" />
                <div className="hud-label !text-[9px] mb-3 !opacity-50 tracking-[0.3em] font-bold">SYSTEM // OUTPUT</div>
                <p className="font-mono text-xs text-[#45B6FE] leading-relaxed glow-cyan brightness-110 min-h-[36px]">
                    {displayedText}
                    <span className={`inline-block w-[6px] h-[12px] bg-[#45B6FE] ml-1.5 align-middle ${cursor ? 'opacity-100' : 'opacity-0'}`} />
                </p>
            </div>
        </div>
    );
}
