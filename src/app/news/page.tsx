'use client';

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function NewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from("news")
                .select("*")
                .order("created_at", { ascending: false });

            if (data) {
                setNews(data);
            }
            setIsLoading(false);
        };

        fetchNews();
    }, []);

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

            <div className="mb-8 font-mono text-sm text-[#45B6FE] tracking-widest uppercase animate-pulse">
                // LOG_FEED: REAL-TIME DATA STREAM FROM THE CH-SIMULATION CORE.
            </div>

            <div className="flex flex-col gap-[10px]">
                {isLoading ? (
                    <div className="text-center text-[#45B6FE] text-sm tracking-widest uppercase p-8 border border-[#45B6FE]/20 border-dashed animate-pulse">
                        CONNECTING TO CORE ARCHIVE...
                    </div>
                ) : !news || news.length === 0 ? (
                    <div className="text-center text-white/30 text-sm tracking-widest uppercase p-8 border border-white/5 border-dashed">
                        No Anomalies Recorded.
                    </div>
                ) : (
                    news.map((post) => (
                        <article key={post.id} className="glass-panel p-6 hover:border-white/20 transition-colors flex flex-col gap-4 overflow-hidden">
                            {post.image_url && (
                                <div className="w-full relative aspect-video rounded overflow-hidden border border-white/10">
                                    <img
                                        src={post.image_url}
                                        alt={post.title}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className="flex flex-col gap-2">
                                <h2 className="text-xl font-semibold tracking-wide text-white">{post.title}</h2>
                                <p className="text-sm leading-relaxed text-white/70 font-mono whitespace-pre-wrap">
                                    {post.content}
                                </p>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}
