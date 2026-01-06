"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Download, AlertCircle, XCircle } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const RegisterForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [guestId, setGuestId] = useState("");
    const [uniqueCode, setUniqueCode] = useState("");
    const [formData, setFormData] = useState({
        phone: "",
        guests: "1",
        attendance: "Hadir",
    });
    // Store array of guest names. Index 0 is the main guest.
    const [guestNames, setGuestNames] = useState<string[]>([""]);
    const [validationError, setValidationError] = useState("");
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Update guestNames array size when guest count changes
    useEffect(() => {
        const count = parseInt(formData.guests);
        setGuestNames(prev => {
            const newNames = [...prev];
            if (newNames.length < count) {
                // Add empty strings for new slots
                for (let i = newNames.length; i < count; i++) {
                    newNames.push("");
                }
            } else if (newNames.length > count) {
                // Remove extra slots
                return newNames.slice(0, count);
            }
            return newNames;
        });
    }, [formData.guests]);

    const handleNameChange = (index: number, value: string) => {
        const newNames = [...guestNames];
        newNames[index] = value;
        setGuestNames(newNames);
        // Clear error when user types
        if (validationError) setValidationError("");
    };

    const downloadQRCode = () => {
        const qrCanvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
        if (!qrCanvas) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Dimensi E-Ticket (Portrait)
        const width = 500;
        const height = 900;
        canvas.width = width;
        canvas.height = height;

        // 1. Background Cream/White
        ctx.fillStyle = "#FDFBF7";
        ctx.fillRect(0, 0, width, height);

        // 2. Decorative Borders (Gold)
        ctx.strokeStyle = "#C5A059";
        ctx.lineWidth = 15;
        ctx.strokeRect(0, 0, width, height);

        ctx.lineWidth = 2;
        ctx.strokeRect(25, 25, width - 50, height - 50);

        // 3. Header
        ctx.fillStyle = "#1A1A1A";
        ctx.textAlign = "center";

        ctx.font = "bold 28px serif";
        ctx.fillText("DIGITAL INVITATION", width / 2, 90);

        ctx.font = "italic 18px serif";
        ctx.fillText("The Wedding of Romeo & Juliet", width / 2, 125);

        // 4. Guest Info Section (Dynamic Layout)
        let currentY = 180;

        ctx.fillStyle = "#C5A059";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("GUEST LIST", width / 2, currentY);
        currentY += 40;

        ctx.fillStyle = "#1A1A1A";
        ctx.font = "bold 24px sans-serif";

        // Draw all guest names
        // Draw all guest names
        const validNames = guestNames.filter(name => name.trim() !== "");

        if (validNames.length === 1) {
            ctx.fillText(validNames[0].toUpperCase(), width / 2, currentY);
            currentY += 35;
        } else {
            // 2 Column Layout
            const col1X = width / 2 - 110;
            const col2X = width / 2 + 110;

            validNames.forEach((name, index) => {
                const isLeft = index % 2 === 0;
                const x = isLeft ? col1X : col2X;
                // Only increment Y if it's a left item (start of row) 
                // BUT we actually increment after a row completes or for the left item we stay on same line
                // Better logic: Calculate row index
                const row = Math.floor(index / 2);
                const y = currentY + (row * 35);

                ctx.fillText(name.toUpperCase(), x, y);
            });

            // Advance Y by number of rows
            currentY += Math.ceil(validNames.length / 2) * 35;
        }

        // Draw Total Guests
        currentY += 5;
        ctx.fillStyle = "#555555";
        ctx.font = "16px sans-serif";
        ctx.fillText(`Total: ${formData.guests} Tamu`, width / 2, currentY);
        currentY += 35;

        // Show unique code
        ctx.fillStyle = "#C5A059";
        ctx.font = "bold 24px monospace";
        ctx.fillText(`CODE: ${uniqueCode}`, width / 2, currentY);
        currentY += 40; // Spacing before QR

        // 5. QR Code Area (Dengan bingkai)
        // Ensure standard spacing for QR code even with few guests to maintain balance
        const minQrY = 320;
        const qrY = Math.max(currentY, minQrY);
        const qrSize = 300;
        const qrX = (width - qrSize) / 2;

        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(0,0,0,0.1)";
        ctx.shadowBlur = 20;
        ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
        ctx.shadowBlur = 0;

        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

        // 6. Footer (Dynamic based on QR position)
        const footerStartY = qrY + qrSize + 60;

        ctx.fillStyle = "#1A1A1A";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("SAVE THE DATE", width / 2, footerStartY);

        ctx.font = "18px sans-serif";
        ctx.fillText("Senin, 04 Januari 2027", width / 2, footerStartY + 30);
        ctx.fillText("Grand Ballroom Jakarta", width / 2, footerStartY + 60);

        // 7. Footer Note
        ctx.fillStyle = "#C5A059";
        ctx.font = "11px sans-serif";
        ctx.fillText("Harap tunjukkan Kode QR ini pada saat memasuki ruangan", width / 2, height - 35);

        // Download logic
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            const safeName = (guestNames[0] || "guest").replace(/[^a-z0-9]/gi, '_');
            downloadLink.download = `E-Ticket-${safeName}.png`;
            downloadLink.click();
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }, "image/png");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError("");

        // STRICT VALIDATION: Check if ANY guest name is empty
        const emptyIndex = guestNames.findIndex(name => name.trim() === "");
        if (emptyIndex !== -1) {
            setValidationError(`Silakan isi nama Tamu #${emptyIndex + 1}. Semua nama wajib diisi!`);
            // Scroll to form top or let user see notification
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/rsvp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: guestNames[0], // Main guest name for backward compatibility
                    guest_names: guestNames, // Array of all names
                    phone: formData.phone,
                    total_guests: parseInt(formData.guests),
                    attendance: formData.attendance,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Terjadi kesalahan');

            if (data && data.id) {
                setGuestId(data.id);
                setUniqueCode(data.unique_code || "---");
                setIsSubmitted(true);
            }
        } catch (error: any) {
            console.error("Error submitting RSVP:", error);
            setToast({ type: 'error', message: error.message || "Terjadi kesalahan saat mengirim konfirmasi." });
            setTimeout(() => setToast(null), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="rsvp" className="py-24 md:py-32 bg-wedding-cream relative">
            <div className="container mx-auto px-4">
                <div className="max-w-xl mx-auto bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-wedding-gold/10 overflow-hidden relative">
                    {/* Decorative Corner */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-wedding-pink/20 rounded-bl-full -mr-8 -mt-8" />

                    <AnimatePresence mode="wait">
                        {!isSubmitted ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                            >
                                <div className="text-center mb-10">
                                    <h2 className="font-wedding text-4xl text-wedding-dark mb-4">Konfirmasi Kehadiran</h2>
                                    <p className="text-wedding-dark/60 text-sm">Mohon isi formulir di bawah ini untuk konfirmasi kehadiran Anda.</p>
                                </div>

                                {validationError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3"
                                    >
                                        <AlertCircle className="shrink-0 mt-0.5" size={18} />
                                        <p className="text-sm font-medium">{validationError}</p>
                                    </motion.div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">

                                    <div className="mb-6">
                                        <label className="block text-xs font-bold uppercase tracking-widest text-wedding-gold mb-2">Jumlah Tamu</label>
                                        <select
                                            className="w-full bg-wedding-cream/30 border-b-2 border-wedding-gold/20 py-3 px-4 focus:border-wedding-gold outline-none transition-colors duration-300 text-wedding-dark"
                                            value={formData.guests}
                                            onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                        >
                                            <option value="1">1 Orang</option>
                                            <option value="2">2 Orang</option>
                                            <option value="3">3 Orang</option>
                                            <option value="4">4 Orang</option>
                                        </select>
                                    </div>

                                    {/* DYNAMIC GUEST INPUTS */}
                                    <div className="space-y-4">
                                        {guestNames.map((name, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <label className="block text-xs font-bold uppercase tracking-widest text-wedding-gold mb-2">
                                                    Nama Tamu {index + 1} {index === 0 && "(Utama)"}
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`w-full bg-wedding-cream/30 border-b-2 py-3 px-4 outline-none transition-colors duration-300 text-wedding-dark ${validationError && name.trim() === ""
                                                        ? "border-red-400 bg-red-50"
                                                        : "border-wedding-gold/20 focus:border-wedding-gold"
                                                        }`}
                                                    placeholder={index === 0 ? "Contoh: Romeo" : `Nama Tamu ke-${index + 1}`}
                                                    value={guestNames[index]}
                                                    onChange={(e) => handleNameChange(index, e.target.value)}
                                                />
                                                {validationError && name.trim() === "" && (
                                                    <p className="text-[10px] text-red-500 font-bold mt-1 ml-1 uppercase tracking-wider animate-pulse">
                                                        * Nama tamu wajib diisi
                                                    </p>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>



                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={isLoading}
                                        className="w-full bg-wedding-dark text-white py-4 rounded-full font-bold uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-2 hover:bg-wedding-gold transition-colors duration-300 shadow-xl disabled:opacity-50"
                                    >
                                        {isLoading ? "Mengirim..." : (
                                            <>Kirim Konfirmasi <Send size={18} /></>
                                        )}
                                    </motion.button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-20"
                            >
                                <CheckCircle2 size={80} className="text-wedding-gold mx-auto mb-6" />
                                <h3 className="font-wedding text-4xl text-wedding-dark mb-4">Terima Kasih!</h3>
                                <p className="text-wedding-dark/60 mb-8 px-8">
                                    Konfirmasi kehadiran Anda telah kami terima. Silakan simpan Kode QR di bawah ini untuk akses masuk acara.
                                </p>

                                <div className="bg-white p-6 rounded-3xl shadow-lg border border-wedding-gold/10 inline-block mb-3">
                                    <QRCodeCanvas
                                        id="qr-code-canvas"
                                        value={guestId}
                                        size={256}
                                        level="H"
                                        bgColor="#FFFFFF"
                                        fgColor="#C5A059"
                                        includeMargin={false}
                                    />
                                    <div className="mt-4 flex flex-col items-center gap-1">
                                        <p className="text-[10px] font-bold text-wedding-gold uppercase tracking-widest">Entry ID: {guestId.slice(0, 8)}</p>
                                        <div className="bg-wedding-cream px-4 py-2 rounded-lg border border-wedding-gold/20">
                                            <p className="text-xs text-wedding-dark/60 font-medium mb-1">Backup Code</p>
                                            <p className="text-2xl font-mono font-bold text-wedding-dark tracking-widest">{uniqueCode}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-8">
                                    <button
                                        onClick={downloadQRCode}
                                        className="inline-flex items-center gap-2 text-wedding-dark bg-wedding-gold/10 hover:bg-wedding-gold/20 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-colors duration-300"
                                    >
                                        <Download size={14} /> Simpan Kode QR
                                    </button>
                                </div>

                                <button
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setValidationError("");
                                        setGuestNames([""]);
                                        setFormData({ ...formData, guests: "1" });
                                    }}
                                    className="text-wedding-gold font-bold uppercase tracking-widest text-xs border-b border-wedding-gold"
                                >
                                    Isi Kembali
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Custom Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 50, x: '-50%' }}
                        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[320px] ${toast.type === 'success' ? 'bg-white border-l-4 border-green-500' : 'bg-white border-l-4 border-red-500'
                            }`}
                    >
                        <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {toast.type === 'success' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800 text-sm">{toast.type === 'success' ? 'Berhasil' : 'Error'}</p>
                            <p className="text-slate-500 text-xs">{toast.message}</p>
                        </div>
                        <button onClick={() => setToast(null)} className="ml-auto text-slate-400 hover:text-slate-600">
                            <XCircle size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default RegisterForm;
