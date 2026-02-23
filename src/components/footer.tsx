export default function Footer() {
    return (
        <footer className="mt-[10px] w-full border-t border-[#45B6FE]/50 bg-black/40 backdrop-blur-md px-6 py-4 z-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[#45B6FE] font-mono text-[10px] uppercase tracking-widest gap-4 md:gap-0">

                {/* Left Side */}
                <div className="flex-1 text-center md:text-left">
                    // CH-SIM_BUILD: 2026.02.v1
                </div>

                {/* Center */}
                <div className="flex-1 text-center flex items-center justify-center gap-2 font-bold animate-pulse">
                    [ STATUS: SYSTEM_OPERATIONAL ]
                </div>

                {/* Right Side */}
                <div className="flex-1 text-center md:text-right">
                    © PROTOCOL_CH
                </div>

            </div>
        </footer>
    );
}
