"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

const RegisterForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [guestId, setGuestId] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        guests: "1",
        attendance: "Hadir",
    });

    const downloadQRCode = () => {
        const qrCanvas = document.getElementById("qr-code-canvas") as HTMLCanvasElement;
        if (!qrCanvas) return;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Dimensi E-Ticket (Portrait)
        const width = 500;
        const height = 800;
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

        // 4. Guest Info Section
        ctx.fillStyle = "#C5A059";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("GUEST NAME", width / 2, 200);

        ctx.fillStyle = "#1A1A1A";
        ctx.font = "bold 32px sans-serif";
        ctx.fillText(formData.name.toUpperCase(), width / 2, 250);

        // 5. QR Code Area (Dengan bingkai)
        const qrSize = 300;
        const qrX = (width - qrSize) / 2;
        const qrY = 320;

        ctx.fillStyle = "#FFFFFF";
        ctx.shadowColor = "rgba(0,0,0,0.1)";
        ctx.shadowBlur = 20;
        ctx.fillRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
        ctx.shadowBlur = 0;

        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

        // 6. Event Details
        ctx.fillStyle = "#1A1A1A";
        ctx.font = "bold 14px sans-serif";
        ctx.fillText("SAVE THE DATE", width / 2, 680);

        ctx.font = "18px sans-serif";
        ctx.fillText("Senin, 04 Januari 2027", width / 2, 710);
        ctx.fillText("Grand Ballroom Jakarta", width / 2, 740);

        // 7. Footer
        ctx.fillStyle = "#C5A059";
        ctx.font = "11px sans-serif";
        ctx.fillText("Harap tunjukkan Kode QR ini pada saat memasuki ruangan", width / 2, 775);

        // Download logic
        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            const safeName = formData.name.replace(/[^a-z0-9]/gi, '_');
            downloadLink.download = `E-Ticket-${safeName}.png`;
            downloadLink.click();
            setTimeout(() => URL.revokeObjectURL(url), 100);
        }, "image/png");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/rsvp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    total_guests: parseInt(formData.guests),
                    attendance: formData.attendance,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Terjadi kesalahan');

            if (data && data.id) {
                setGuestId(data.id);
                setIsSubmitted(true);
            }
        } catch (error: any) {
            console.error("Error submitting RSVP:", error);
            alert(error.message || "Terjadi kesalahan saat mengirim konfirmasi. Silakan coba lagi.");
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

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-wedding-gold mb-2">Nama Lengkap</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-wedding-cream/30 border-b-2 border-wedding-gold/20 py-3 px-4 focus:border-wedding-gold outline-none transition-colors duration-300 text-wedding-dark"
                                            placeholder="Contoh: John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-wedding-gold mb-2">No. WhatsApp</label>
                                        <input
                                            type="tel"
                                            required
                                            className="w-full bg-wedding-cream/30 border-b-2 border-wedding-gold/20 py-3 px-4 focus:border-wedding-gold outline-none transition-colors duration-300 text-wedding-dark"
                                            placeholder="Contoh: 081234567890"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
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
                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-widest text-wedding-gold mb-2">Konfirmasi</label>
                                            <select
                                                className="w-full bg-wedding-cream/30 border-b-2 border-wedding-gold/20 py-3 px-4 focus:border-wedding-gold outline-none transition-colors duration-300 text-wedding-dark"
                                                value={formData.attendance}
                                                onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                                            >
                                                <option value="Hadir">Hadir</option>
                                                <option value="Tidak Hadir">Tidak Hadir</option>
                                                <option value="Masih Ragu">Masih Ragu</option>
                                            </select>
                                        </div>
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
                                    <p className="mt-4 text-[10px] font-bold text-wedding-gold uppercase tracking-widest">Entry ID: {guestId.slice(0, 8)}</p>
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
                                    onClick={() => setIsSubmitted(false)}
                                    className="text-wedding-gold font-bold uppercase tracking-widest text-xs border-b border-wedding-gold"
                                >
                                    Isi Kembali
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
};

export default RegisterForm;
