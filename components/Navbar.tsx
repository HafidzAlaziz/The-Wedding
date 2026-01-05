"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
    { name: "Home", href: "#" },
    { name: "Mempelai", href: "#about" },
    { name: "Acara", href: "#event" },
    { name: "Galeri", href: "#gallery" },
    { name: "RSVP", href: "#rsvp" },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        if (href === "#") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
        setIsOpen(false);
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ease-in-out ${isScrolled
                ? "bg-white/80 backdrop-blur-xl shadow-sm py-4 border-b border-wedding-gold/10"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <motion.a
                    href="#"
                    className={`font-wedding text-2xl md:text-3xl ${isScrolled ? "text-wedding-gold" : "text-white"
                        }`}
                    whileHover={{ scale: 1.05 }}
                >
                    R&J
                </motion.a>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => scrollToSection(e, link.href)}
                            className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-300 hover:text-wedding-gold ${isScrolled ? "text-wedding-dark/80" : "text-white/80"
                                }`}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button
                    className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? "text-wedding-dark" : "text-white"
                        }`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-wedding-gold/10 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => scrollToSection(e, link.href)}
                                    className="text-xs uppercase tracking-widest font-bold text-wedding-dark/70 hover:text-wedding-gold transition-colors"
                                >
                                    {link.name}
                                </a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
