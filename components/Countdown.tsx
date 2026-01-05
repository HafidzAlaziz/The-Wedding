"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const targetDate = new Date("2027-01-04T00:00:00").getTime();

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const TimeUnit = ({ value, label }: { value: number; label: string }) => (
        <div className="flex flex-col items-center mx-1 md:mx-4">
            <div className="relative bg-white/10 backdrop-blur-md rounded-xl w-16 h-20 md:w-24 md:h-28 flex items-center justify-center mb-2 shadow-2xl border border-white/20 overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                        key={value}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{
                            duration: 0.5,
                            ease: "easeOut"
                        }}
                        className="text-3xl md:text-5xl font-wedding text-wedding-gold"
                    >
                        {value.toString().padStart(2, '0')}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className="text-wedding-cream/80 uppercase tracking-widest text-[10px] md:text-xs font-semibold">
                {label}
            </span>
        </div>
    );

    return (
        <section id="countdown" className="py-20 md:py-32 bg-wedding-dark relative overflow-hidden">
            {/* Decorative Ornaments */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-wedding-gold/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-wedding-pink/5 blur-3xl rounded-full translate-x-1/4 translate-y-1/4" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-wedding text-3xl md:text-5xl text-wedding-cream mb-4">Save The Date</h2>
                    <p className="text-wedding-cream/60 tracking-widest uppercase text-sm">Menuju Hari Bahagia Kami</p>
                </motion.div>

                <div className="flex justify-center items-center">
                    <TimeUnit value={timeLeft.days} label="Hari" />
                    <TimeUnit value={timeLeft.hours} label="Jam" />
                    <TimeUnit value={timeLeft.minutes} label="Menit" />
                    <TimeUnit value={timeLeft.seconds} label="Detik" />
                </div>
            </div>
        </section>
    );
};

export default Countdown;
