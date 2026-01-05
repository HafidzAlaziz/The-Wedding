"use client";

import { motion } from "framer-motion";
import { Quote as QuoteIcon } from "lucide-react";

const Quote = () => {
    return (
        <section className="py-24 md:py-32 bg-wedding-dark relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-wedding-gold to-transparent opacity-50" />

            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="max-w-4xl mx-auto text-center relative"
                >
                    <QuoteIcon className="text-wedding-gold/20 mx-auto mb-8 w-16 h-16" />

                    <h2 className="font-wedding text-2xl md:text-3xl text-wedding-gold/80 italic mb-8 leading-relaxed">
                        "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
                    </h2>

                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "80px" }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="h-px bg-wedding-gold mx-auto mb-6"
                    />

                    <p className="font-medium text-wedding-cream tracking-[0.2em] uppercase text-sm">
                        Ar-Rum: 21
                    </p>
                </motion.div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-t from-wedding-gold to-transparent opacity-50" />
        </section>
    );
};

export default Quote;
