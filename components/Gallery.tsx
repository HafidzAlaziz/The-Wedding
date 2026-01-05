"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";

const photos = [
    "/gallery-islamic-1.png",
    "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621619856515-338148ca4180?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621619856624-42fd193a0661?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop",
];

const Gallery = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <section className="py-24 md:py-32 bg-wedding-cream relative">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-wedding text-4xl md:text-6xl text-wedding-dark mb-4">Momen Indah</h2>
                    <p className="text-wedding-gold tracking-widest uppercase text-xs mb-8">Kisah Kami Dalam Lensa</p>
                </motion.div>

                {/* Photo Grid */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
                    {photos.map((photo, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setSelectedImage(photo)}
                            className="relative overflow-hidden rounded-2xl cursor-pointer shadow-md group"
                        >
                            <Image
                                src={photo}
                                alt={`Wedding Photo ${index + 1}`}
                                width={800}
                                height={600}
                                className="w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white border border-white px-4 py-2 rounded-full text-xs uppercase tracking-widest font-semibold">
                                    Lihat Foto
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal Preview */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <motion.button
                            className="absolute top-6 right-6 text-white bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={24} />
                        </motion.button>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={selectedImage}
                                alt="Selected Wedding Photo"
                                fill
                                className="object-contain"
                                priority
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Gallery;
