"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
    { name: "Home", href: "#home" },
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

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // 1. Prevent Default Anchor Jump
        e.preventDefault();

        // 2. Close Menu Immediately
        setIsOpen(false);

        // 3. Manual Scroll Logic
        setTimeout(() => {
            const targetId = href.replace("#", "");
            const element = document.getElementById(targetId);

            if (element) {
                const navHeight = 80;
                const elementPosition = element.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = elementPosition - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Update URL without jumping
                window.history.pushState(null, "", href);
            } else if (href === "#home") {
                window.scrollTo({ top: 0, behavior: "smooth" });
                window.history.pushState(null, "", "#home");
            }
        }, 100); // Small delay to allow menu close animation to start/finish
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ease-in-out ${isScrolled || isOpen
                ? "bg-white shadow-md py-4"
                : "bg-transparent py-6"
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center relative z-[10000]">
                {/* Logo */}
                <motion.a
                    href="#home"
                    onClick={(e) => handleLinkClick(e, "#home")}
                    className={`font-wedding text-2xl md:text-3xl ${isScrolled || isOpen ? "text-wedding-dark" : "text-white"
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
                            onClick={(e) => handleLinkClick(e, link.href)}
                            className={`text-xs uppercase tracking-widest font-semibold transition-colors duration-300 hover:text-wedding-gold ${isScrolled ? "text-wedding-dark/80" : "text-white/80"
                                }`}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <button
                    className={`md:hidden p-2 rounded-lg transition-colors relative z-[10001] ${isScrolled || isOpen ? "text-wedding-dark" : "text-white"
                        }`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu - Fullscreen Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 bg-white z-[9998] pt-24 px-6 md:hidden flex flex-col h-screen"
                    >
                        <div className="flex flex-col gap-6 items-center justify-center h-full pb-24">
                            {navLinks.map((link, index) => (
                                <motion.a
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleLinkClick(e, link.href)}
                                    className="text-xl uppercase tracking-[0.2em] font-bold text-wedding-dark hover:text-wedding-gold transition-colors py-4 w-full text-center border-b border-wedding-gold/10"
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
