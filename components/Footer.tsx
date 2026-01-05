"use client";

import { motion } from "framer-motion";
import { Music, Music2, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const Footer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Audio play failed:", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <footer className="bg-wedding-dark py-20 relative overflow-hidden">
            {/* Decorative Wave Mask */}
            <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
                <svg className="relative block w-[calc(100%+1.3px)] h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="#FDFBF7"></path>
                </svg>
            </div>

            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="mb-12"
                >
                    <span className="text-wedding-gold font-medium tracking-[0.4em] uppercase text-xs mb-4 block">Kami yang berbahagia</span>
                    <h2 className="font-wedding text-5xl md:text-7xl text-wedding-cream mb-4">Romeo & Juliet</h2>
                    <div className="h-px w-32 bg-wedding-gold/30 mx-auto" />
                </motion.div>

                <p className="text-wedding-cream/40 text-sm tracking-widest uppercase mb-12">
                    Terima kasih atas doa dan restu Anda
                </p>

                <div className="text-wedding-cream/20 text-xs font-light">
                    &copy; 2026 Romeo & Juliet Wedding Invitation. All Rights Reserved.
                </div>
            </div>

            {/* Floating Music Toggle */}
            <motion.div
                className="fixed bottom-6 right-6 z-50"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 }}
            >
                <button
                    onClick={toggleMusic}
                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 border-2 ${isPlaying
                            ? "bg-wedding-gold border-white text-white rotate-180"
                            : "bg-white border-wedding-gold text-wedding-gold"
                        }`}
                >
                    {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}

                    {/* Pulsing effect when playing */}
                    {isPlaying && (
                        <motion.div
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-wedding-gold rounded-full -z-10"
                        />
                    )}
                </button>
            </motion.div>

            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                loop
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" // Placeholder audio
            />
        </footer>
    );
};

export default Footer;
