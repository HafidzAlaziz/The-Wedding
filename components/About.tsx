"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const About = () => {
    return (
        <section className="py-24 md:py-32 bg-wedding-cream relative">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <span className="text-wedding-gold font-semibold uppercase tracking-[0.3em] text-xs mb-3 block">Assalamualaikum Wr. Wb.</span>
                    <h2 className="font-wedding text-4xl md:text-6xl text-wedding-dark mb-6">Mempelai Pria & Wanita</h2>
                    <p className="max-w-2xl mx-auto text-wedding-dark/70 leading-relaxed font-light">
                        Dengan memohon rahmat Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami.
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24">
                    {/* Groom */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center group"
                    >
                        <div className="relative w-64 h-80 mx-auto mb-8 overflow-hidden rounded-t-full border-4 border-wedding-gold/20 shadow-2xl">
                            <Image
                                src="/groom-islamic.png"
                                alt="Romeo"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <h3 className="font-wedding text-3xl text-wedding-dark mb-2">Romeo Montague</h3>
                        <p className="text-wedding-gold font-medium mb-4">Putra dari</p>
                        <p className="text-wedding-dark/60 font-light italic">
                            Bpk. Lord Montague <br /> & Ibu Lady Montague
                        </p>
                    </motion.div>

                    {/* Ampersand */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="hidden md:block font-wedding text-7xl text-wedding-gold/30"
                    >
                        &
                    </motion.div>

                    {/* Bride */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center group"
                    >
                        <div className="relative w-64 h-80 mx-auto mb-8 overflow-hidden rounded-t-full border-4 border-wedding-gold/20 shadow-2xl">
                            <Image
                                src="/bride-islamic.png"
                                alt="Juliet"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <h3 className="font-wedding text-3xl text-wedding-dark mb-2">Juliet Capulet</h3>
                        <p className="text-wedding-gold font-medium mb-4">Putri dari</p>
                        <p className="text-wedding-dark/60 font-light italic">
                            Bpk. Lord Capulet <br /> & Ibu Lady Capulet
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
