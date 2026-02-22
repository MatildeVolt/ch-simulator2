import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { publishNews } from "@/app/actions";

export default async function NewsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let isOperator = false;

    if (user) {
        const { data: subjectData } = await supabase
            .from("subjects")
            .select("role")
            .eq("id", user.id)
            .single();
        if (subjectData?.role === "Operator") {
            isOperator = true;
        }
    }

    const { data: news } = await supabase
        .from("news")
        .select("*, subjects(email)")
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto flex flex-col">
            <header className="mb-12 flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-widest text-white uppercase">Anomaly Archive</h1>
                    <p className="text-xs tracking-wider text-[#45B6FE] opacity-80 mt-1">Classified Log Entries</p>
                </div>
                <nav className="flex gap-4 items-center">
                    <Link href="/kernel" className="text-xs flex items-center gap-2 tracking-widest text-white/70 hover:text-white uppercase transition-colors">
                        <span className="w-1.5 h-1.5 bg-[#45B6FE] rounded-full inline-block animate-pulse"></span>
                        Kernel
                    </Link>
                </nav>
            </header>

            {isOperator && (
                <div className="mb-12 glass-panel p-6 border border-[#45B6FE]/30">
                    <h2 className="text-sm tracking-widest text-[#45B6FE] uppercase mb-4 font-semibold">Operator Access: Publish Log</h2>
                    <form action={publishNews} className="space-y-4">
                        <div>
                            <input
                                name="title"
                                placeholder="Anomaly Designation (Title)"
                                required
                                className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[#45B6FE]/50 transition-colors placeholder:text-white/30"
                            />
                        </div>
                        <div>
                            <textarea
                                name="content"
                                placeholder="Log details..."
                                required
                                rows={3}
                                className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-sm text-white focus:outline-none focus:border-[#45B6FE]/50 transition-colors placeholder:text-white/30 resize-none font-mono"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="bg-[#45B6FE]/20 hover:bg-[#45B6FE]/40 text-[#45B6FE] border border-[#45B6FE]/50 text-xs px-6 py-2 rounded transition-colors uppercase tracking-widest font-bold">
                                Deploy to Archive
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="mb-8 flex justify-between items-center">
                <div className="text-sm font-medium tracking-widest text-white/50 uppercase">
                    Latest Entries
                </div>
            </div>

            <div className="space-y-6">
                {!news || news.length === 0 ? (
                    <div className="text-center text-white/30 text-xs tracking-widest uppercase p-8 border border-white/5 border-dashed">
                        No Anomalies Recorded.
                    </div>
                ) : (
                    news.map((post) => (
                        <article key={post.id} className="glass-panel p-6 hover:border-white/20 transition-colors group">
                            <div className="flex items-start justify-between mb-4">
                                <h2 className="text-xl font-semibold tracking-wide text-white group-hover:text-[#45B6FE] transition-colors">{post.title}</h2>
                                <span className="text-[10px] tracking-widest text-white/40 uppercase font-mono bg-white/5 px-2 py-1 rounded">
                                    {new Date(post.created_at).toISOString().split('T')[0]}
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed text-white/70 font-mono whitespace-pre-wrap">
                                {post.content}
                            </p>
                            <div className="mt-6 pt-4 border-t border-white/10 text-xs flex justify-between text-white/40">
                                <span className="uppercase tracking-widest">Author: {post.subjects?.email?.split('@')[0] || "Unknown"}</span>
                                <span>ID: {post.id.split('-')[0]}</span>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}
