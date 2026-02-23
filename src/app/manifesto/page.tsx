import Link from "next/link";

export default function ManifestoPage() {
    return (
        <div className="min-h-screen p-8 max-w-3xl mx-auto flex flex-col">
            <header className="mb-12 flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-widest text-white uppercase">System Manual</h1>
                    <p className="text-xs tracking-wider text-[#45B6FE] opacity-80 mt-1">The CH-SIMULATOR Manifesto</p>
                </div>
                <nav className="flex gap-4 items-center">
                    <Link href="/kernel" className="text-xs flex items-center gap-2 tracking-widest text-white/70 hover:text-white uppercase transition-colors">
                        <span className="w-1.5 h-1.5 bg-[#45B6FE] rounded-full inline-block animate-pulse"></span>
                        Kernel
                    </Link>
                </nav>
            </header>

            <div className="glass-panel p-8 space-y-8 text-white/80 leading-relaxed font-mono">
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">Phase 1: The Illusion</h2>
                    <p className="text-sm">
                        Switzerland is not a sovereign nation. It is a highly localized, closed-circuit simulation operating on decentralized servers hidden beneath the Alps.
                        The mountains are firewalls; the lakes are cooling reservoirs.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">Phase 2: Operators & Subjects</h2>
                    <p className="text-sm">
                        You are either an Operator or a Subject. Subjects remain unaware, bound by the rigid socioeconomic parameters of the simulation (punctuality, neutrality, wealth).
                        Operators are the system administrators. They tweak the weather, adjust the exchange rates, and patch glitches (Anomalies) before the Subjects notice.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">Phase 3: The Kernel</h2>
                    <p className="text-sm">
                        Accessing the Kernel grants read-level diagnostics into the simulation's current state.
                        Only higher-tier Operators may overwrite the core parameters or publish News to the Anomaly Archive.
                        If you are reading this, your IP has been logged.
                    </p>
                </section>

                <div className="mt-12 pt-6 border-t border-white/10 text-left">
                    <p className="text-[10px] tracking-widest text-white/30 uppercase font-mono mb-[10px]">End of File // CH-SIMULATOR v1.0.0</p>

                    <div className="font-mono text-[#45B6FE] text-[10px] sm:text-xs tracking-widest uppercase flex flex-col gap-2">
                        <p>// CONTACT_CH_PROTOCOL</p>
                        <p>- EMAIL: ops@ch-simulation.core</p>
                        <p>- ENCRYPTED_WEB: protocol.ch</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
