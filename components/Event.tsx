"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, Clock } from "lucide-react";

const events = [
    {
        title: "Akad Nikah",
        date: "Senin, 04 Januari 2027",
        time: "08:00 - 10:00 WIB",
        location: "Masjid Raya Al-Mashun",
        address: "Jl. Mahkamah No.74, Mesjid, Kec. Medan Kota, Kota Medan",
        mapsUrl: "https://maps.app.goo.gl/3Xz8p8zQJ1z1z1z1",
    },
    {
        title: "Resepsi Pernikahan",
        date: "Senin, 04 Januari 2027",
        time: "11:00 - Selesai",
        location: "Grand City Hall Medan",
        address: "Jl. Balai Kota No.1, Kesawan, Kec. Medan Bar., Kota Medan",
        mapsUrl: "https://maps.app.goo.gl/3Xz8p8zQJ1z1z1z1",
    },
];

const Event = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <section id="event" className="py-24 md:py-32 bg-white relative" />;
    }

    return (
        <section id="event" className="py-24 md:py-32 bg-white relative">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="font-wedding text-4xl md:text-6xl text-wedding-dark mb-6">Waktu & Tempat</h2>
                    <div className="h-px w-24 bg-wedding-gold mx-auto mb-6" />
                </motion.div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {events.map((event, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                            className="bg-wedding-cream/50 p-10 rounded-3xl border border-wedding-gold/10 shadow-lg text-center relative overflow-hidden group"
                        >
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-wedding-gold/5 rounded-bl-full transition-transform duration-500 group-hover:scale-125" />

                            <h3 className="font-wedding text-3xl text-wedding-gold mb-8">{event.title}</h3>

                            <div className="space-y-6 mb-10 text-wedding-dark/80">
                                <div className="flex flex-col items-center">
                                    <Calendar size={24} className="text-wedding-gold mb-2" />
                                    <p className="font-medium">{event.date}</p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <Clock size={24} className="text-wedding-gold mb-2" />
                                    <p className="font-medium">{event.time}</p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <MapPin size={24} className="text-wedding-gold mb-2" />
                                    <p className="font-bold text-lg mb-1">{event.location}</p>
                                    <p className="text-sm px-6 font-light">{event.address}</p>
                                </div>
                            </div>

                            <motion.a
                                href={event.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center bg-wedding-dark text-white px-8 py-3 rounded-full hover:bg-wedding-gold transition-colors duration-300 shadow-md text-xs uppercase tracking-widest font-bold"
                            >
                                Lihat Lokasi
                            </motion.a>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Event;
