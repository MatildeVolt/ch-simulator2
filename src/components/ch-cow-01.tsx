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

    // Blinking cursor
    useEffect(() => {
        const interval = setInterval(() => setCursor(c => !c), 500);
        return () => clearInterval(interval);
    }, []);

    // Cycle through messages
    useEffect(() => {
        const interval = setInterval(() => {
            const next = STATUS_MESSAGES[Math.floor(Math.random() * STATUS_MESSAGES.length)];
            setCurrentMessage(next);
            setDisplayedText("");
            setIsTyping(true);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Typewriter effect
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
        }, 28);
        return () => clearInterval(interval);
    }, [currentMessage, isTyping]);

    return (
        <div className="flex flex-col gap-3 h-full">
            {/* Swiss Red Badge */}
            <div className="flex items-center justify-between">
                <span className="swiss-badge text-[#FF0028] border-[#FF0028]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF0028] animate-pulse" />
                    CH-COW-01
                </span>
                <span className="hud-label">BOVINE INTERFACE</span>
            </div>

            {/* ASCII Cow */}
            <pre className="font-mono text-[11px] leading-tight text-[#FF0028]/80 select-none whitespace-pre">
                {COW_ASCII}
            </pre>

            {/* Terminal Output */}
            <div className="flex-1 bg-black/40 rounded-xl border border-white/5 p-3 mt-1 overflow-hidden">
                <div className="hud-label mb-2">// SYSTEM OUTPUT</div>
                <p className="font-mono text-xs text-[#45B6FE] leading-relaxed">
                    {displayedText}
                    <span className={`inline-block w-[7px] h-[13px] bg-[#45B6FE] ml-0.5 align-middle ${cursor ? 'opacity-100' : 'opacity-0'}`} />
                </p>
            </div>
        </div>
    );
}
