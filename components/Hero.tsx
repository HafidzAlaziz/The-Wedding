"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const Hero = () => {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
                style={{
                    backgroundImage: "url('/hero-islamic.png')",
                }}
            >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-wedding-pink font-medium tracking-[0.3em] uppercase mb-4 text-sm md:text-base"
                >
                    The Wedding of
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="font-wedding text-6xl md:text-8xl text-wedding-cream mb-6 drop-shadow-lg"
                >
                    Romeo & Juliet
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-px w-24 bg-wedding-gold mx-auto mb-6"
                />

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="text-wedding-cream text-xl md:text-2xl font-light tracking-wide mb-10"
                >
                    04 . 01 . 2027
                </motion.p>

                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.8, delay: 1.3 }}
                    onClick={() => {
                        document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-wedding-gold hover:bg-opacity-90 text-white px-8 py-3 rounded-full transition-all duration-300 shadow-xl tracking-widest text-sm uppercase font-semibold"
                >
                    Daftar Kehadiran
                </motion.button>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-wedding-cream/60"
            >
                <ChevronDown size={32} />
            </motion.div>
        </section>
    );
};

export default Hero;
