'use client'

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MotionCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export default function MotionCard({ children, className, delay = 0 }: MotionCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay,
                ease: [0.23, 1, 0.32, 1]
            }}
            whileHover={{
                scale: 1.01,
                transition: { duration: 0.2 }
            }}
            className={cn(
                "glass glass-hover relative overflow-hidden group",
                className
            )}
        >
            <div className="accent-line group-hover:opacity-100 transition-opacity" />

            {/* Corner Brackets Aesthetic */}
            <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-[#45B6FE]/40 group-hover:border-[#45B6FE] transition-colors" />
            <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-[#45B6FE]/40 group-hover:border-[#45B6FE] transition-colors" />
            <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-[#45B6FE]/40 group-hover:border-[#45B6FE] transition-colors" />
            <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-[#45B6FE]/40 group-hover:border-[#45B6FE] transition-colors" />

            {children}
        </motion.div>
    );
}
