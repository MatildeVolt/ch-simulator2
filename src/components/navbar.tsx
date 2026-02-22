import Link from "next/link";
import { signout } from "@/app/actions";

interface NavbarProps {
    systemStatus?: string;
}

export default function Navbar({ systemStatus = "NOMINAL" }: NavbarProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <nav className="max-w-7xl mx-auto bg-[rgba(10,15,25,0.4)] backdrop-blur-md border border-white/5 px-6 py-2.5 flex items-center justify-between rounded-full">
                {/* Left: System Identity */}
                <div className="flex items-center gap-6">
                    <Link href="/kernel" className="flex items-center gap-3 group">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#45B6FE] shadow-[0_0_8px_rgba(69,182,254,0.8)] animate-pulse" />
                        <span className="font-mono text-xs font-bold tracking-[0.3em] text-white uppercase group-hover:text-[#45B6FE] transition-colors">
                            CH-SIM
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-2">
                        <span className="hud-label !opacity-60">STATUS //</span>
                        <span className="font-mono text-[10px] font-bold tracking-widest glow-cyan">
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
                    <span className="hidden md:block font-mono text-[9px] tracking-[0.2em] text-white/30 uppercase">
                        SEC_INTEL_v1.2
                    </span>
                    <form action={signout}>
                        <button
                            type="submit"
                            className="font-mono text-[10px] tracking-[0.2em] uppercase text-red-500/80 hover:text-red-400 border border-red-500/10 hover:border-red-500/40 px-4 py-1.5 rounded-full transition-all hover:bg-red-500/5"
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
            className="relative px-4 py-1.5 font-mono text-[10px] tracking-[0.25em] uppercase text-white/40 hover:text-white transition-all rounded-full hover:bg-white/5 group"
        >
            {label}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#45B6FE] group-hover:w-1/3 transition-all duration-300" />
        </Link>
    );
}
