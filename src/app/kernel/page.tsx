'use client'

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import CHCOW01 from "@/components/ch-cow-01";
import MotionCard from "@/components/motion-card";
import SBBEngine from "@/components/sbb-engine";
import SwanRadar from "@/components/swan-radar";
import MeshRefiner from "@/components/mesh-refiner";
import CowAdvisory from "@/components/cow-advisory";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const INITIAL_LOGS = [
    { id: "WARN_73", msg: "Alps mesh buffer limit", time: "14:02", level: "warn" },
    { id: "WARN_51", msg: "HB Train clock skew", time: "11:40", level: "warn" },
    { id: "INFO_12", msg: "Mood stabilization deployed", time: "09:15", level: "info" },
    { id: "BOOT_01", msg: "Switzerland.exe started", time: "00:00", level: "info" },
];

export default function KernelPage() {
    const [currentTime, setCurrentTime] = useState("");
    const [logs, setLogs] = useState(INITIAL_LOGS);
    const [isShaking, setIsShaking] = useState(false);

    // Advisory States
    const [isDay, setIsDay] = useState(true);
    const [meshDensity, setMeshDensity] = useState(100);
    const [isRadarBreach, setIsRadarBreach] = useState(false);
    const [isSbbOptimized, setIsSbbOptimized] = useState(true);

    useEffect(() => {
        // Just for ticking the current time in the UI somewhere if needed, but not strictly required
        const interval = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-CH', { hour12: false }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleRecover = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-CH', { hour: '2-digit', minute: '2-digit' });

        const newLog = {
            id: `SYNC_${Math.floor(Math.random() * 90) + 10}`,
            msg: "TRAIN SCHEDULE RECOVERED",
            time: timeStr,
            level: "info" as const
        };

        setLogs(prev => [newLog, ...prev].slice(0, 10)); // keep last 10
    };

    const handleBreach = () => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-CH', { hour: '2-digit', minute: '2-digit' });

        const newLog = {
            id: `CRIT_${Math.floor(Math.random() * 90) + 10}`,
            msg: "[CRITICAL] KERNEL_BREACH",
            time: timeStr,
            level: "warn" as const
        };

        setLogs(prev => [newLog, ...prev].slice(0, 10));
        setIsShaking(true);
        setIsRadarBreach(true);
        setTimeout(() => {
            setIsShaking(false);
            setIsRadarBreach(false);
        }, 1000);
    };

    const handleEnergyPenalty = (msg: string) => {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-CH', { hour: '2-digit', minute: '2-digit' });

        const newLog = {
            id: `WARN_${Math.floor(Math.random() * 90) + 10}`,
            msg: `[WARN] ${msg}`,
            time: timeStr,
            level: "warn" as const
        };

        setLogs(prev => [newLog, ...prev].slice(0, 10));
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 500);
    };

    return (
        <div className="min-h-screen pt-28 pb-20 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto">

                {/* Page Header */}
                <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                    <div className="space-y-1">
                        <p className="hud-label ml-0.5 !text-[#45B6FE] !opacity-100 animate-pulse">
              // AUTH_TOKEN_VALIDATED: KERNEL_LEVEL_01
                        </p>
                        <h1 className="text-5xl font-bold tracking-tighter text-white drop-shadow-sm">
                            Kernel <span className="text-[#45B6FE] font-mono text-xl align-top ml-2 brightness-125">v1.2</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3 px-5 py-2.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-md">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20" />
                            <div className="w-2 h-2 rounded-full bg-green-400 relative z-10" />
                        </div>
                        <span className="hud-label !text-green-400 !opacity-100 font-bold">System Online // Switzerland Intact</span>
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[300px]">

                    {/* Module 01 — CH-COW-01 Bovine Interface */}
                    <MotionCard className="p-6 md:row-span-1" delay={0.1}>
                        <CHCOW01
                            isDay={isDay}
                            meshDensity={meshDensity}
                            isRadarBreach={isRadarBreach}
                            isSbbOptimized={isSbbOptimized}
                        />
                    </MotionCard>

                    {/* Module 02 — Swan Radar Pillar & Instructions */}
                    <div className="flex flex-col gap-[10px] w-full items-stretch lg:col-span-2 lg:row-span-1">
                        <MotionCard
                            className={cn(
                                "p-6 flex flex-col relative h-auto overflow-hidden transition-colors duration-200",
                                isShaking ? "border-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.3)]" : ""
                            )}
                            delay={0.2}
                        >
                            <motion.div
                                animate={isShaking ? {
                                    x: [-2, 2, -2, 2, 0],
                                    y: [-1, 1, -1, 1, 0]
                                } : {}}
                                transition={{ duration: 0.1, repeat: 5 }}
                                className="relative z-10"
                            >
                                <div className="absolute top-0 left-0 z-10 pointer-events-none">
                                    <p className="hud-label !text-cyan-400">S_RADAR // PERIMETER</p>
                                    <h2 className="text-xl font-bold text-white tracking-tight mt-1">Swan Radar</h2>
                                </div>

                                <div className="mt-12">
                                    <SwanRadar onBreach={handleBreach} />
                                </div>
                            </motion.div>
                        </MotionCard>

                        {/* Instruction Card */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl flex flex-col gap-2">
                            <div className="hud-label !text-cyan-400 font-mono !text-[10px] tracking-widest opacity-100">
                                // SYSTEM_GUIDE
                            </div>
                            <p className="font-mono text-[11px] leading-relaxed text-white/70">
                                Swan signatures detected approaching the data center core. Click to neutralize each signature. Central breaches will result in kernel interface instability.
                            </p>
                        </div>
                    </div>

                    {/* Module 03 — Anomaly Log */}
                    <MotionCard className="p-6" delay={0.3}>
                        <div className="flex flex-col h-full">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <p className="hud-label">S_LOG // ANOMALIES</p>
                                    <h2 className="text-xl font-bold text-white tracking-tight mt-1 truncate">Security Feed</h2>
                                </div>
                                <div className="px-2 py-0.5 rounded border border-red-500/30 bg-red-500/10">
                                    <span className="font-mono text-[9px] text-red-400 font-bold uppercase animate-pulse">
                                        {logs.filter(l => l.level === 'warn').length} ALERT
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-2.5 overflow-hidden">
                                {logs.map((log) => (
                                    <div key={log.id} className="flex items-center gap-3 bg-[rgba(255,255,255,0.02)] rounded-xl px-4 py-2.5 border border-white/5 hover:border-white/10 transition-colors group/log">
                                        <span className={`font-mono text-[10px] font-black tracking-tighter w-12 shrink-0 ${log.level === 'warn' ? 'text-red-500' : 'text-[#45B6FE]'}`}>
                                            {log.id}
                                        </span>
                                        <p className="font-mono text-[10px] text-white/60 flex-1 truncate group-hover/log:text-white/90 transition-colors uppercase font-medium">{log.msg}</p>
                                        <span className="font-mono text-[9px] text-white/20 shrink-0">{log.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </MotionCard>

                    {/* Module 04 — Temporal Sync Pillar & Instructions */}
                    <div className="flex flex-col gap-[10px] w-full items-stretch lg:row-span-2">
                        <MotionCard className="p-6 flex flex-col relative h-auto overflow-hidden" delay={0.4}>
                            <div className="absolute top-6 left-6 z-10 pointer-events-none">
                                <p className="hud-label">S_SYNC // TEMPORAL</p>
                                <h2 className="text-xl font-bold text-white tracking-tight mt-1">SBB Engine</h2>
                            </div>

                            <div className="mt-8">
                                <SBBEngine
                                    onRecover={handleRecover}
                                    onStateChange={setIsSbbOptimized}
                                />
                            </div>
                        </MotionCard>

                        {/* Instruction Card */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl flex flex-col gap-2">
                            <div className="hud-label !text-cyan-400 font-mono !text-[10px] tracking-widest opacity-100">
                                // SYSTEM_GUIDE
                            </div>
                            <p className="font-mono text-[11px] leading-relaxed text-white/70">
                                If the train is delayed, press and hold <span className="text-red-600 font-bold">[STOP TIME]</span> to synchronize the schedule.
                            </p>
                        </div>
                    </div>

                    {/* Module 05 — Matterhorn Energy Pillar & Instructions */}
                    <div className="flex flex-col gap-[10px] w-full items-stretch lg:row-span-2">
                        <MotionCard
                            className={cn(
                                "p-6 flex flex-col relative h-auto overflow-hidden transition-colors duration-200",
                                isShaking ? "border-red-600/50 shadow-[0_0_20px_rgba(220,38,38,0.3)]" : ""
                            )}
                            delay={0.5}
                        >
                            <motion.div
                                animate={isShaking ? {
                                    x: [-2, 2, -2, 2, 0],
                                    y: [-1, 1, -1, 1, 0]
                                } : {}}
                                transition={{ duration: 0.1, repeat: 5 }}
                                className="relative z-10 h-full"
                            >
                                <div className="absolute top-0 left-0 z-10 pointer-events-none">
                                    <p className="hud-label !text-cyan-400">S_MESH // ENERGY</p>
                                    <h2 className="text-xl font-bold text-white tracking-tight mt-1">Matterhorn Refiner</h2>
                                </div>

                                <div className="mt-12 h-full">
                                    <MeshRefiner
                                        onPenalty={handleEnergyPenalty}
                                        onStateChange={(state) => {
                                            setIsDay(state.isDay);
                                            setMeshDensity(state.meshDensity);
                                        }}
                                    />
                                </div>
                            </motion.div>
                        </MotionCard>

                        {/* Instruction Card (Static) */}
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3 shadow-xl flex flex-col gap-2">
                            <div className="hud-label !text-cyan-400 font-mono !text-[10px] tracking-widest opacity-100">
                                // RESOURCE_MANAGEMENT
                            </div>
                            <p className="font-mono text-[11px] leading-relaxed text-white/70">
                                Adjust mesh density to match the solar cycle. High-fidelity rendering is restricted to daylight hours for energy optimization.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
            <Navbar />
        </div >
    );
}
