"use client";
import { AnimatePresence, motion } from 'framer-motion';
import React, { ReactNode } from 'react';
import Navbar from './navbar';
import { usePathname } from 'next/navigation';

interface AnimatedPageProps {
    children: ReactNode;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children }) => {
    const pathName = usePathname();

    return (
        <AnimatePresence>
            <div key={pathName} className="w-screen h-screen bg-black overflow-hidden relative z-10">
                {/* Main Content */}
                <div className="relative z-30">
                    <div className="h-24">
                        <Navbar />
                    </div>
                    <motion.div
                        className="h-[calc(100vh-6rem)] z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1, ease: "easeInOut" }}
                        style={{
                            backfaceVisibility: "hidden",
                            transform: "translate3d(0, 0, 0)",
                            willChange: "transform, opacity"
                        }}
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
}

export default AnimatedPage;