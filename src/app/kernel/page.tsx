import Link from "next/link";
import { signout } from "@/app/actions";

export default async function KernelPage() {
    return (
        <div className="min-h-screen p-8 flex flex-col">
            <header className="mb-12 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-widest text-white uppercase">Kernel Module</h1>
                    <p className="text-xs tracking-wider text-[#45B6FE] opacity-80 mt-1">System status: OPTIMAL</p>
                </div>
                <nav className="flex gap-4 items-center">
                    <Link href="/news" className="text-xs tracking-widest text-white/70 hover:text-white uppercase transition-colors">Archive</Link>
                    <Link href="/manifesto" className="text-xs tracking-widest text-white/70 hover:text-white uppercase transition-colors">Manifesto</Link>
                    <form action={signout}>
                        <button type="submit" className="text-xs tracking-widest text-red-400 hover:text-red-300 uppercase transition-colors ml-4">Disengage</button>
                    </form>
                </nav>
            </header>

            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
                {/* Module 1 */}
                <div className="glass-panel p-6 flex flex-col col-span-1 md:col-span-2 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <span className="text-4xl font-black italic">01</span>
                    </div>
                    <h2 className="text-lg tracking-wider font-semibold text-white mb-2">Subject Demographics</h2>
                    <div className="flex-1 flex items-center justify-center border border-white/5 rounded bg-black/20">
                        <p className="text-xs text-white/30">Data visualization pending</p>
                    </div>
                </div>

                {/* Module 2 */}
                <div className="glass-panel p-6 flex flex-col relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <span className="text-4xl font-black italic">02</span>
                    </div>
                    <h2 className="text-lg tracking-wider font-semibold text-white mb-2">System Anomalies</h2>
                    <div className="flex-1 flex flex-col gap-2 mt-4">
                        <div className="text-xs flex justify-between border-b border-white/10 pb-2">
                            <span className="text-red-400">WARN_73</span>
                            <span className="text-white/50">14:02:11</span>
                        </div>
                        <div className="text-xs flex justify-between border-b border-white/10 pb-2">
                            <span className="text-[#45B6FE]">INFO_01</span>
                            <span className="text-white/50">12:15:00</span>
                        </div>
                    </div>
                </div>

                {/* Module 3 */}
                <div className="glass-panel p-6 flex flex-col relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <span className="text-4xl font-black italic">03</span>
                    </div>
                    <h2 className="text-lg tracking-wider font-semibold text-white mb-2">Network Uplink</h2>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full border border-[#45B6FE]/30 flex items-center justify-center relative">
                            <div className="absolute w-full h-full border-t border-[#45B6FE] rounded-full animate-spin"></div>
                            <span className="text-xs text-[#45B6FE]">SYNC</span>
                        </div>
                    </div>
                </div>

                {/* Module 4 */}
                <div className="glass-panel p-6 flex flex-col md:col-span-2 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <span className="text-4xl font-black italic">04</span>
                    </div>
                    <h2 className="text-lg tracking-wider font-semibold text-white mb-2">Environment Controls</h2>
                    <div className="flex-1 grid grid-cols-3 gap-4 mt-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-black/40 border border-white/10 rounded flex flex-col items-center justify-center p-4 hover:bg-white/5 cursor-pointer transition-colors">
                                <span className="block w-8 h-1 bg-white/20 mb-3 rounded"></span>
                                <span className="text-[10px] text-white/50 tracking-widest uppercase">Node {i}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
