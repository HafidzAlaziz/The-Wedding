"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, QrCode, Search, CheckCircle, XCircle, Clock, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<"list" | "scan">("list");
    const [guests, setGuests] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [scanResult, setScanResult] = useState<{ success: boolean; message: string; guestName?: string; guestNames?: string[]; totalGuests?: number } | null>(null);
    const [isCameraStarted, setIsCameraStarted] = useState(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [showActivationPrompt, setShowActivationPrompt] = useState(true);
    const [cameraNotification, setCameraNotification] = useState<{ type: 'requesting' | 'success' | 'error'; message: string } | null>(null);
    const [manualCode, setManualCode] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const scannerRef = useRef<Html5Qrcode | null>(null);


    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const startCamera = async (isRetry = false) => {
        console.log("Attempting to start camera...");
        setCameraError(null);
        setIsCameraStarted(false);
        setShowActivationPrompt(false);

        // Show permission request notification
        setCameraNotification({ type: 'requesting', message: 'Meminta izin akses kamera...' });

        // Cleanup any existing scanner
        if (scannerRef.current) {
            try {
                if (scannerRef.current.isScanning) {
                    await scannerRef.current.stop();
                }
            } catch (e) {
                console.error("Error stopping existing scanner:", e);
            }
            scannerRef.current = null;
        }

        // Add a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            if (!isCameraStarted) {
                console.error("Camera startup timed out after 10 seconds");
                const errorMsg = "Waktu aktivasi kamera habis. Silakan coba lagi atau pastikan izin kamera diberikan.";
                setCameraError(errorMsg);
                setCameraNotification({ type: 'error', message: errorMsg });
                setTimeout(() => setCameraNotification(null), 5000);
            }
        }, 10000);

        try {
            const element = document.getElementById("reader");
            if (!element) return;

            scannerRef.current = new Html5Qrcode("reader", {
                formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                verbose: false
            });
            const config = {
                fps: 60,
                qrbox: (viewfinderWidth: number, viewfinderHeight: number) => {
                    // Larger scan area for better sensitivity
                    return {
                        width: Math.floor(viewfinderWidth * 0.8),
                        height: Math.floor(viewfinderHeight * 0.8)
                    };
                },
                aspectRatio: 1.0
            };

            // Try to start with environment facing mode
            await scannerRef.current.start(
                { facingMode: "environment" },
                config,
                (decodedText) => onScanSuccess(decodedText),
                undefined
            );

            clearTimeout(timeout);
            setIsCameraStarted(true);
            console.log("Camera started successfully");

            // Show success notification
            setCameraNotification({ type: 'success', message: 'Kamera berhasil diaktifkan!' });
            setTimeout(() => setCameraNotification(null), 3000);
        } catch (err: any) {
            clearTimeout(timeout);
            console.error("Failed to start camera:", err);

            let errorMsg = "Gagal mengakses kamera.";
            const errorMessage = typeof err === 'string' ? err : err.message || "";
            const errorName = err.name || "";

            if (errorName === "NotAllowedError" || errorMessage.includes("NotAllowedError") || errorMessage.includes("Permission denied")) {
                errorMsg = "Izin kamera ditolak. Silakan klik ikon gembok di browser dan izinkan akses kamera.";
            } else if (errorName === "NotFoundError" || errorMessage.includes("NotFoundError")) {
                errorMsg = "Kamera tidak ditemukan di perangkat ini.";
            } else if (errorMessage) {
                errorMsg = `Error: ${errorMessage}`;
            }

            setCameraError(errorMsg);
            setIsCameraStarted(false);

            // Show error notification
            setCameraNotification({ type: 'error', message: errorMsg });
            setTimeout(() => setCameraNotification(null), 5000);
        }
    };

    useEffect(() => {
        // Reset activation prompt when switching to scan tab
        if (activeTab === "scan") {
            setShowActivationPrompt(true);
            setCameraNotification(null);
        }

        return () => {
            if (scannerRef.current) {
                if (scannerRef.current.isScanning) {
                    scannerRef.current.stop().catch(err => {
                        console.error("Failed to stop camera on cleanup:", err);
                    });
                }
                scannerRef.current = null;
            }
            setIsCameraStarted(false);
        };
    }, [activeTab]);

    // Auto-fetch guests on component mount
    useEffect(() => {
        fetchGuests();
    }, []);


    const fetchGuests = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/guests');
            const data = await response.json();
            if (response.ok) {
                setGuests(data || []);
            }
        } catch (error) {
            console.error("Error fetching guests:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteGuest = async (id: string, name: string) => {
        if (!confirm(`Apakah Anda yakin ingin menghapus data tamu "${name}"?`)) return;

        try {
            const response = await fetch(`/api/admin/guests/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchGuests();
            } else {
                const data = await response.json();
                alert(data.error || "Gagal menghapus tamu");
            }
        } catch (error) {
            console.error("Error deleting guest:", error);
            alert("Terjadi kesalahan jaringan.");
        }
    };

    const handleCheckIn = async (id: string) => {
        try {
            const response = await fetch('/api/admin/check-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const data = await response.json();

            if (response.ok) {
                // Success: Show welcome popup with guest name
                setScanResult({
                    success: true,
                    message: data.message,
                    guestName: data.guestName || "Tamu",
                    guestNames: data.guestNames || [],
                    totalGuests: data.totalGuests || 1
                });
                fetchGuests();
                // Reset scan result after 3 seconds from 5 seconds
                setTimeout(() => setScanResult(null), 3000);
            } else {
                // Error: Show notification
                setScanResult({ success: false, message: data.error || "Gagal check-in" });
                setTimeout(() => setScanResult(null), 3000);
            }
        } catch (error) {
            setScanResult({ success: false, message: "Terjadi kesalahan jaringan." });
            setTimeout(() => setScanResult(null), 3000);
        }
    };

    const [isProcessingManual, setIsProcessingManual] = useState(false);

    const handleManualCheckIn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualCode.trim() || isProcessingManual) return;

        // Reset states
        setScanResult(null);
        setIsProcessingManual(true);

        try {
            const response = await fetch('/api/admin/check-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ unique_code: manualCode.trim() }),
            });
            const data = await response.json();

            if (response.ok) {
                // Success
                setScanResult({
                    success: true,
                    message: data.message,
                    guestName: data.guestName || "Tamu",
                    guestNames: data.guestNames || [],
                    totalGuests: data.totalGuests || 1
                });
                setManualCode(""); // Clear input on success
                fetchGuests();
                setTimeout(() => setScanResult(null), 3000);
            } else {
                // Error
                setScanResult({ success: false, message: data.error || "Gagal check-in" });
                setTimeout(() => setScanResult(null), 3000);
            }
        } catch (error) {
            setScanResult({ success: false, message: "Terjadi kesalahan jaringan." });
            setTimeout(() => setScanResult(null), 3000);
        } finally {
            setIsProcessingManual(false);
        }
    };

    async function onScanSuccess(decodedText: string) {
        await handleCheckIn(decodedText);
    }

    function onScanFailure(error: any) {
        // console.warn(`Code scan error = ${error}`);
    }

    const filteredGuests = guests.filter(g =>
        (g.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (g.unique_code?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(filteredGuests.length / itemsPerPage);
    const paginatedGuests = filteredGuests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Reset to page 1 when searching
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const stats = {
        total: guests.length,
        present: guests.filter(g => g.is_present).length,
        notPresent: guests.filter(g => !g.is_present).length,
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-500">Manajemen Tamu Undangan Pernikahan</p>
                    </div>

                    <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200">
                        <button
                            onClick={() => setActiveTab("list")}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${activeTab === "list" ? "bg-wedding-dark text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                            <Users size={18} /> Data Tamu
                        </button>
                        <button
                            onClick={() => setActiveTab("scan")}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all ${activeTab === "scan" ? "bg-wedding-dark text-white shadow-md" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                            <QrCode size={18} /> Scan QR
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === "list" ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                        >
                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                                    <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
                                        <Users size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Total Terdaftar</p>
                                        <p className="text-2xl font-bold">{stats.total}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-xl text-green-600">
                                        <CheckCircle size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Hadir di Lokasi</p>
                                        <p className="text-2xl font-bold">{stats.present}</p>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
                                    <div className="bg-amber-100 p-3 rounded-xl text-amber-600">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 uppercase font-bold tracking-wider">Belum Datang</p>
                                        <p className="text-2xl font-bold">{stats.notPresent}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                                    <Search className="text-slate-400" size={20} />
                                    <input
                                        type="text"
                                        placeholder="Cari nama atau nomor telepon..."
                                        className="w-full outline-none text-slate-700 bg-transparent"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button onClick={fetchGuests} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-md transition-colors text-slate-600">Refresh</button>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                                                <th className="px-6 py-4 font-bold text-center">No</th>
                                                <th className="px-6 py-4 font-bold">Kode</th>
                                                <th className="px-6 py-4 font-bold">Nama Tamu</th>
                                                <th className="px-6 py-4 font-bold">Jumlah</th>
                                                <th className="px-6 py-4 font-bold">Presensi</th>
                                                <th className="px-6 py-4 font-bold text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {isLoading ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">Memuat data...</td>
                                                </tr>
                                            ) : filteredGuests.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">Tamu tidak ditemukan.</td>
                                                </tr>
                                            ) : paginatedGuests.map((guest, index) => (
                                                <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 text-center text-slate-400 text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                                    <td className="px-6 py-4 font-mono font-bold text-wedding-gold text-xs">{guest.unique_code || "-"}</td>
                                                    <td className="px-6 py-4 relative group">
                                                        <div className="font-semibold text-slate-800">{guest.name}</div>
                                                        {guest.guest_names && Array.isArray(guest.guest_names) && guest.guest_names.length > 1 && (
                                                            <div className="text-xs text-slate-500 mt-1">
                                                                + {guest.guest_names.slice(1).join(", ")}
                                                            </div>
                                                        )}
                                                        {/* Tooltip for all names */}
                                                        {guest.guest_names && Array.isArray(guest.guest_names) && (
                                                            <div className="absolute left-6 top-full mt-2 hidden group-hover:block z-20 bg-white p-3 rounded-lg shadow-xl border border-slate-100 min-w-[200px]">
                                                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Daftar Tamu:</p>
                                                                <ul className="text-xs space-y-1">
                                                                    {guest.guest_names.map((name: string, idx: number) => (
                                                                        <li key={idx} className="text-slate-700">• {name || "(Tanpa Nama)"}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">{guest.total_guests} Orang</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            {guest.is_present ? (
                                                                <>
                                                                    <CheckCircle className="text-green-500" size={16} />
                                                                    <span className="text-xs text-green-600">Sudah Hadir</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <XCircle className="text-slate-300" size={16} />
                                                                    <span className="text-xs text-slate-400">Belum Hadir</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        {guest.checkInTime && (
                                                            <p className="text-[10px] text-slate-400 mt-1">{new Date(guest.checkInTime).toLocaleTimeString()}</p>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button
                                                            onClick={() => handleDeleteGuest(guest.id, guest.name)}
                                                            className="text-red-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                            title="Hapus Tamu"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                                        <p className="text-sm text-slate-500">
                                            Menampilkan <span className="font-bold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}</span> - <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredGuests.length)}</span> dari <span className="font-bold text-slate-700">{filteredGuests.length}</span> tamu
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                disabled={currentPage === 1}
                                                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
                                            >
                                                <ChevronLeft size={18} />
                                            </button>

                                            <div className="flex items-center gap-1">
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentPage(i + 1)}
                                                        className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${currentPage === i + 1 ? "bg-wedding-dark text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                disabled={currentPage === totalPages}
                                                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-all"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="scan"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="space-y-12 pb-12"
                        >
                            {/* Title Section */}
                            <div className="text-center">
                                <h2 className="text-4xl font-extrabold text-slate-900 mb-2">Presensi</h2>
                                <div className="h-1.5 w-20 bg-wedding-dark mx-auto rounded-full"></div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                {/* Left Side: Clock & Date */}
                                <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 lg:pl-12">
                                    <div className="space-y-1">
                                        <h3 className="text-7xl md:text-8xl font-black text-slate-800 tracking-tighter tabular-nums drop-shadow-sm">
                                            {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </h3>
                                        <p className="text-xl md:text-2xl text-slate-500 font-medium">
                                            {currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>

                                    <div className="hidden lg:flex items-start gap-4 pt-12 max-w-sm">
                                        <div className="bg-wedding-dark/10 p-3 rounded-2xl text-wedding-dark">
                                            <QrCode size={24} />
                                        </div>
                                        <div className="text-slate-500 space-y-1">
                                            <p className="font-bold text-slate-700">Scan QR Code</p>
                                            <p className="text-sm leading-relaxed">Arahkan kamera ke Kode QR Tamu untuk melakukan verifikasi kehadiran secara otomatis.</p>
                                        </div>
                                    </div>

                                    {/* Manual Check-in Form */}
                                    <div className="w-full max-w-sm pt-8">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                            <h3 className="font-bold text-slate-800 mb-4 text-center">Input Manual Kode Unik</h3>
                                            <form onSubmit={handleManualCheckIn} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 outline-none focus:border-wedding-gold font-mono uppercase text-center tracking-widest font-bold"
                                                    placeholder="XXXXX"
                                                    value={manualCode}
                                                    onChange={(e) => setManualCode(e.target.value)}
                                                    maxLength={8}
                                                />
                                                <button
                                                    type="submit"
                                                    disabled={!manualCode.trim() || isProcessingManual}
                                                    className="bg-wedding-dark text-white px-6 py-2 rounded-lg font-bold uppercase text-xs tracking-wider hover:bg-wedding-gold transition-colors disabled:opacity-50 whitespace-nowrap min-w-[100px] flex items-center justify-center"
                                                >
                                                    {isProcessingManual ? (
                                                        <div
                                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                                            style={{ animationDuration: '0.5s' }}
                                                        ></div>
                                                    ) : (
                                                        "Check-In"
                                                    )}
                                                </button>
                                            </form>
                                            <p className="text-center text-xs text-slate-400 mt-3">
                                                Atau scan QR Code di sebelah kanan.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Scanner */}
                                <div className="relative w-full max-w-md mx-auto px-4 lg:px-0">
                                    <div className="bg-slate-900 rounded-[3rem] shadow-2xl border-8 border-white overflow-hidden aspect-square relative z-10 flex items-center justify-center">
                                        <div id="reader" className="w-full h-full absolute inset-0"></div>

                                        {!isCameraStarted && (
                                            <div className="relative z-20 text-center p-8">
                                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-slate-700">
                                                    <QrCode className="w-10 h-10 text-slate-400" />
                                                </div>
                                                {cameraError ? (
                                                    <div className="flex flex-col items-center">
                                                        <p className="text-slate-400 text-sm mb-6 leading-relaxed max-w-[240px] mx-auto">
                                                            {cameraError}
                                                        </p>
                                                        <div className="flex gap-3">
                                                            <button
                                                                onClick={() => setActiveTab("list")}
                                                                className="px-6 py-2 bg-slate-800 text-slate-400 rounded-full text-xs font-bold uppercase tracking-widest border border-slate-700 hover:bg-slate-700 transition-colors"
                                                            >
                                                                Tutup
                                                            </button>
                                                            <button
                                                                onClick={() => startCamera(true)}
                                                                className="px-6 py-2 bg-slate-100 text-slate-900 rounded-full text-xs font-bold uppercase tracking-widest border border-white hover:bg-white transition-colors"
                                                            >
                                                                Coba Lagi
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4"></div>
                                                        <p className="text-white font-medium">Memulai Kamera...</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Decorative Elements */}
                                    <div className="absolute -inset-4 border-2 border-wedding-dark/10 rounded-[4rem] pointer-events-none"></div>
                                    <div className="absolute inset-4 border-2 border-wedding-dark/30 rounded-[2.5rem] pointer-events-none z-20"></div>

                                    {/* Pulse Effect */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-wedding-dark/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
                                </div>
                            </div>



                            {/* Scan Feedback Overlay */}
                            <AnimatePresence>
                                {scanResult && (
                                    <>
                                        {scanResult.success ? (
                                            // Success: Centered Welcome Popup
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                                            >
                                                <motion.div
                                                    initial={{ y: 50, scale: 0.9 }}
                                                    animate={{ y: 0, scale: 1 }}
                                                    className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl text-center border-4 border-wedding-gold/20 relative overflow-hidden"
                                                >
                                                    {/* Decorative background elements */}
                                                    <div className="absolute top-0 left-0 w-64 h-64 bg-wedding-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                                                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

                                                    <div className="relative z-10 flex flex-col items-center justify-center">
                                                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce-slow shadow-md">
                                                            <CheckCircle className="text-green-600 w-12 h-12" />
                                                        </div>
                                                        <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
                                                            Selamat Datang!
                                                        </h2>
                                                        <div className="py-6 my-6 border-y-2 border-slate-100 w-full">
                                                            {scanResult.guestNames && scanResult.guestNames.length > 0 ? (
                                                                <div className="flex flex-col items-center">
                                                                    <div className={`${scanResult.guestNames.length > 1 ? 'grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2' : ''} w-full max-w-lg`}>
                                                                        {scanResult.guestNames.map((name, idx) => (
                                                                            <p key={idx} className="text-2xl font-bold text-wedding-dark leading-tight break-words py-1">
                                                                                {name}
                                                                            </p>
                                                                        ))}
                                                                    </div>
                                                                    {scanResult.totalGuests && scanResult.totalGuests > 1 && (
                                                                        <div className="mt-6 inline-block bg-slate-100 px-4 py-1 rounded-full">
                                                                            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                                                                                Total: {scanResult.totalGuests} Tamu
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <p className="text-3xl font-bold text-wedding-dark mb-2 leading-tight break-words">
                                                                    {scanResult.guestName}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="bg-slate-50 rounded-xl p-4 inline-block shadow-sm">
                                                            <p className="text-base text-slate-600 font-bold flex items-center gap-2">
                                                                <CheckCircle className="text-green-500 w-5 h-5" />
                                                                Silakan masuk ke ruangan acara
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            </motion.div>
                                        ) : (
                                            // Error: Bottom Notification
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                className="fixed bottom-12 left-4 right-4 md:left-auto md:right-8 md:w-96 p-6 rounded-2xl shadow-2xl flex items-center gap-4 border z-50 bg-red-600 border-red-500 text-white"
                                            >
                                                <div className="bg-white/20 p-3 rounded-xl">
                                                    <XCircle size={32} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg">Scan Gagal</h4>
                                                    <p className="text-white/90 leading-tight">{scanResult.message}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </>
                                )}
                            </AnimatePresence>

                            {/* Camera Activation Prompt */}
                            <AnimatePresence>
                                {showActivationPrompt && activeTab === "scan" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="fixed top-8 left-4 right-4 md:left-auto md:right-8 md:w-96 p-6 rounded-2xl shadow-2xl border z-50 bg-blue-600 border-blue-500 text-white"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="bg-white/20 p-3 rounded-xl flex-shrink-0">
                                                <QrCode size={32} />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg mb-1">Aktifkan Kamera</h4>
                                                <p className="text-white/90 text-sm leading-tight mb-4">Klik tombol di bawah untuk mengaktifkan kamera dan mulai scan QR Code.</p>
                                                <button
                                                    onClick={() => startCamera()}
                                                    className="w-full bg-white text-blue-600 font-bold py-2.5 px-4 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <QrCode size={18} />
                                                    Aktifkan Kamera
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Camera Permission Notification */}
                            <AnimatePresence>
                                {cameraNotification && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className={`fixed top-8 left-4 right-4 md:left-auto md:right-8 md:w-96 p-6 rounded-2xl shadow-2xl flex items-center gap-4 border z-50 ${cameraNotification.type === 'requesting' ? "bg-blue-600 border-blue-500 text-white" :
                                            cameraNotification.type === 'success' ? "bg-green-600 border-green-500 text-white" :
                                                "bg-red-600 border-red-500 text-white"
                                            }`}
                                    >
                                        <div className="bg-white/20 p-3 rounded-xl">
                                            {cameraNotification.type === 'requesting' && (
                                                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            )}
                                            {cameraNotification.type === 'success' && <CheckCircle size={32} />}
                                            {cameraNotification.type === 'error' && <XCircle size={32} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg">
                                                {cameraNotification.type === 'requesting' && "Meminta Izin Kamera"}
                                                {cameraNotification.type === 'success' && "Kamera Aktif"}
                                                {cameraNotification.type === 'error' && "Gagal Mengaktifkan Kamera"}
                                            </h4>
                                            <p className="text-white/90 leading-tight">{cameraNotification.message}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="lg:hidden text-center text-slate-400 text-sm mt-8">
                                <QrCode size={20} className="inline-block mr-2" />
                                Arahkan kamera ke Kode QR Tamu
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx global>{`
                #reader button {
                    background-color: #0F172A !important;
                    color: white !important;
                    border: 2px solid #C5A059 !important;
                    padding: 12px 24px !important;
                    border-radius: 12px !important;
                    font-size: 14px !important;
                    font-weight: 800 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.05em !important;
                    cursor: pointer !important;
                    margin: 10px 0 !important;
                    transition: all 0.2s ease !important;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
                }
                #reader button:hover {
                    background-color: #C5A059 !important;
                    color: #0F172A !important;
                    transform: translateY(-1px) !important;
                }
                #reader img {
                    display: none !important;
                }
                #reader {
                    border: none !important;
                    height: 100% !important;
                    width: 100% !important;
                    position: absolute !important;
                    top: 0 !important;
                    left: 0 !important;
                    overflow: hidden !important;
                }
                #reader video {
                    object-fit: cover !important;
                    width: 100% !important;
                    height: 100% !important;
                }
            `}</style>
        </div>
    );
}
