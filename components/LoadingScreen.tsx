"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const LoadingScreen = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-wedding-cream"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                        className="text-center"
                    >
                        <h1 className="font-wedding text-5xl md:text-7xl text-wedding-gold mb-4">R&J</h1>
                        <div className="h-px w-24 bg-wedding-gold/30 mx-auto mb-4" />
                        <p className="text-wedding-dark/40 tracking-[0.3em] uppercase text-[10px] md:text-xs">
                            Membangun Kebahagiaan...
                        </p>
                    </motion.div>

                    <motion.div
                        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-48 h-1 bg-wedding-gold/10 rounded-full overflow-hidden"
                    >
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "0%" }}
                            transition={{ duration: 2.5, ease: "easeInOut" }}
                            className="h-full bg-wedding-gold w-full"
                        />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
