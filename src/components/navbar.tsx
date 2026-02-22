import Link from "next/link";
import { signout } from "@/app/actions";

interface NavbarProps {
    systemStatus?: string;
}

export default function Navbar({ systemStatus = "NOMINAL" }: NavbarProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3">
            <nav className="max-w-7xl mx-auto glass-panel px-6 py-3 flex items-center justify-between">
                {/* Left: System Identity */}
                <div className="flex items-center gap-6">
                    <Link href="/kernel" className="flex items-center gap-3 group">
                        <div className="w-2 h-2 rounded-full bg-[#45B6FE] animate-pulse" />
                        <span className="font-mono text-sm font-bold tracking-[0.2em] text-white uppercase group-hover:text-[#45B6FE] transition-colors">
                            CH-SIM
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        <span className="hud-label">STATUS //</span>
                        <span className={`hud-label font-bold ${systemStatus === "CRITICAL" ? "text-red-400" : "text-[#45B6FE]"}`}>
                            {systemStatus}
                        </span>
                    </div>
                </div>

                {/* Center: Nav Links */}
                <div className="flex items-center gap-1">
                    <NavLink href="/kernel" label="Kernel" />
                    <NavLink href="/news" label="Archive" />
                    <NavLink href="/manifesto" label="Manifesto" />
                </div>

                {/* Right: Disengage */}
                <div className="flex items-center gap-4">
                    <span className="hidden md:block font-mono text-[10px] tracking-widest text-white/20 uppercase">
                        {new Date().toISOString().split('T')[0]}
                    </span>
                    <form action={signout}>
                        <button
                            type="submit"
                            className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-400/70 hover:text-red-400 border border-red-400/20 hover:border-red-400/50 px-3 py-1.5 rounded transition-all"
                        >
                            Disengage
                        </button>
                    </form>
                </div>
            </nav>
        </header>
    );
}

function NavLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="relative px-3 py-1.5 font-mono text-[11px] tracking-widest uppercase text-white/50 hover:text-white transition-colors rounded-lg hover:bg-white/5 group"
        >
            {label}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-[#45B6FE] group-hover:w-3/4 transition-all duration-300" />
        </Link>
    );
}
