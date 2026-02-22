'use client'

import { useState, useEffect } from "react";

const COW_ASCII = `  ^__^
  (oo)\\_______
  (__)\\       )\\\/\\
      ||----w |
      ||     ||`;

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

export default function CHCOW01() {
    const [currentMessage, setCurrentMessage] = useState(STATUS_MESSAGES[0]);
    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(true);
    const [cursor, setCursor] = useState(true);

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
        }, 6000);
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

    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Swiss Red Badge */}
            <div className="flex items-center justify-between">
                <span className="neon-badge !text-[#FF0028] !border-[#FF0028]/20 bg-[#FF0028]/5">
                    <span className="w-1 h-1 rounded-full bg-[#FF0028] shadow-[0_0_8px_rgba(255,0,40,0.8)] animate-pulse" />
                    CH-COW-01
                </span>
                <span className="hud-label !text-white/40">BOVINE INTERFACE</span>
            </div>

            {/* ASCII Cow */}
            <pre className="font-mono text-[10px] leading-tight text-white/90 drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] select-none whitespace-pre pl-2">
                {COW_ASCII}
            </pre>

            {/* Terminal Output */}
            <div className="flex-1 bg-black/60 rounded-xl border border-white/5 p-4 mt-1 relative overflow-hidden group/terminal">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#45B6FE]/30 to-transparent" />
                <div className="hud-label !text-[9px] mb-3 !opacity-50 tracking-[0.3em] font-bold">SYSTEM // OUTPUT</div>
                <p className="font-mono text-xs text-[#45B6FE] leading-relaxed glow-cyan brightness-110">
                    {displayedText}
                    <span className={`inline-block w-[6px] h-[12px] bg-[#45B6FE] ml-1.5 align-middle ${cursor ? 'opacity-100' : 'opacity-0'}`} />
                </p>
            </div>
        </div>
    );
}
