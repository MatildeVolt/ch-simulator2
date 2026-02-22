import Navbar from "@/components/navbar";
import CHCOW01 from "@/components/ch-cow-01";

export default async function KernelPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Page Header */}
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <p className="hud-label mb-1">// MODULE ACCESS GRANTED</p>
                        <h1 className="text-4xl font-bold tracking-tight text-white">
                            Kernel
                            <span className="text-[#45B6FE] ml-2 font-mono text-2xl">v1.0</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 glass px-4 py-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        <span className="hud-label text-green-400">All systems operational</span>
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[280px]">

                    {/* Module 01 — CH-COW-01 Bovine Interface (tall, left) */}
                    <div className="glass-panel group relative overflow-hidden p-6 flex flex-col">
                        <div className="accent-line" />
                        <CHCOW01 />
                    </div>

                    {/* Module 02 — Subject Demographics */}
                    <div className="glass-panel group relative overflow-hidden p-6 flex flex-col lg:col-span-2">
                        <div className="accent-line" />
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="hud-label">MODULE 02</p>
                                <h2 className="text-lg font-semibold text-white tracking-wide mt-0.5">Subject Demographics</h2>
                            </div>
                            <span className="swiss-badge">LIVE</span>
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-3">
                            {[
                                { label: "Active Subjects", value: "8,720,421", delta: "+0.003%" },
                                { label: "Anomaly Rate", value: "0.002%", delta: "−stable" },
                                { label: "Compliance", value: "99.91%", delta: "+0.01%" },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-black/30 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:border-[#45B6FE]/20 transition-colors">
                                    <p className="hud-label mb-2">{stat.label}</p>
                                    <div>
                                        <p className="font-mono text-2xl font-bold text-white">{stat.value}</p>
                                        <p className="font-mono text-[10px] text-[#45B6FE] mt-1">{stat.delta}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Module 03 — System Anomalies */}
                    <div className="glass-panel group relative overflow-hidden p-6 flex flex-col">
                        <div className="accent-line" />
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="hud-label">MODULE 03</p>
                                <h2 className="text-lg font-semibold text-white tracking-wide mt-0.5">Anomaly Log</h2>
                            </div>
                            <span className="swiss-badge text-red-400 border-red-400/30">2 WARN</span>
                        </div>
                        <div className="flex-1 space-y-2 overflow-hidden">
                            {[
                                { id: "WARN_73", msg: "Alps texture buffer overflow — Sector 7G", time: "14:02:11", level: "warn" },
                                { id: "WARN_51", msg: "Train delay anomaly — Zürich HB +0.003ms", time: "11:40:00", level: "warn" },
                                { id: "INFO_12", msg: "Population mood stabilized — chocolate drop", time: "09:15:33", level: "info" },
                                { id: "INFO_01", msg: "Kernel boot complete — all modules loaded", time: "00:00:01", level: "info" },
                            ].map((log) => (
                                <div key={log.id} className="flex items-center gap-3 bg-black/20 rounded-lg px-3 py-2 border border-white/5">
                                    <span className={`font-mono text-[10px] font-bold w-14 shrink-0 ${log.level === 'warn' ? 'text-red-400' : 'text-[#45B6FE]'}`}>
                                        {log.id}
                                    </span>
                                    <p className="font-mono text-[10px] text-white/50 flex-1 truncate">{log.msg}</p>
                                    <span className="font-mono text-[10px] text-white/25 shrink-0">{log.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Module 04 — Network Uplink */}
                    <div className="glass-panel group relative overflow-hidden p-6 flex flex-col">
                        <div className="accent-line" />
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="hud-label">MODULE 04</p>
                                <h2 className="text-lg font-semibold text-white tracking-wide mt-0.5">Network Uplink</h2>
                            </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                {/* Pulsing rings */}
                                <div className="absolute w-full h-full rounded-full border border-[#45B6FE]/10 animate-ping" style={{ animationDuration: '3s' }} />
                                <div className="absolute w-3/4 h-3/4 rounded-full border border-[#45B6FE]/20 animate-ping" style={{ animationDuration: '2s' }} />
                                <div className="absolute w-full h-full rounded-full border border-[#45B6FE]/30 animate-spin" style={{ animationDuration: '8s', borderTopColor: '#45B6FE' }} />
                                <div className="z-10 text-center">
                                    <p className="font-mono text-[10px] text-[#45B6FE] tracking-widest">SYNC</p>
                                    <p className="font-mono text-xs text-white/40">99.9%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Module 05 — Environment Controls */}
                    <div className="glass-panel group relative overflow-hidden p-6 flex flex-col">
                        <div className="accent-line" />
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <p className="hud-label">MODULE 05</p>
                                <h2 className="text-lg font-semibold text-white tracking-wide mt-0.5">Environment Controls</h2>
                            </div>
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            {[
                                { label: "Precipitation", value: "42%", active: true },
                                { label: "Temperature", value: "8.2°C", active: true },
                                { label: "Wind Layer", value: "OFF", active: false },
                                { label: "Fog Matrix", value: "3%", active: true },
                            ].map((ctrl) => (
                                <div key={ctrl.label} className={`rounded-xl border p-3 flex flex-col gap-1 cursor-pointer transition-all ${ctrl.active ? 'border-[#45B6FE]/20 bg-[#45B6FE]/5 hover:bg-[#45B6FE]/10' : 'border-white/5 bg-black/20 hover:border-white/10'}`}>
                                    <p className="hud-label">{ctrl.label}</p>
                                    <p className={`font-mono text-sm font-bold ${ctrl.active ? 'text-[#45B6FE]' : 'text-white/30'}`}>{ctrl.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            <Navbar />
        </div>
    );
}
