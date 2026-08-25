"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Coffee, ArrowLeft, KeyRound, Mail, User, Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { registerAction } from "../actions";
export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      const res = await registerAction(null, formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success) {
        setSuccessMessage(res.message || "Registrasi berhasil! Mengalihkan ke halaman login...");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (err: any) {
      setError("Terjadi kesalahan: " + (err?.message || "Silakan coba lagi."));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col lg:flex-row">
      
      {/* Decorative column */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 relative items-center justify-center text-white p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800" 
            alt="Barista brewing coffee" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-stone-900/40" />
        
        <div className="relative z-10 max-w-md">
          <Link href="/" className="inline-flex items-center space-x-2 text-amber-400 font-semibold mb-12 hover:text-amber-300 transition">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="bg-amber-800 text-white p-3 rounded-2xl w-fit mb-6">
            <Coffee className="h-8 w-8" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Bergabung Bersama <br />
            Kami di CafeReserve
          </h2>
          <p className="text-stone-300 leading-relaxed text-sm">
            Dapatkan hak akses eksklusif untuk memilih posisi meja terbaik, memesan hidangan favorit secara instan via WhatsApp pre-order, dan lacak riwayat kunjungan Anda.
          </p>
        </div>
      </div>
      {/* Form column */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12 bg-white relative">
        <div className="mx-auto w-full max-w-md">
          
          {/* Mobile header */}
          <div className="lg:hidden mb-8 flex justify-between items-center">
            <Link href="/" className="inline-flex items-center space-x-1 text-sm font-semibold text-stone-600 hover:text-amber-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Beranda</span>
            </Link>
            <div className="flex items-center space-x-1 font-bold text-stone-900">
              <Coffee className="h-5 w-5 text-amber-800" />
              <span>CafeReserve</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Daftar Akun Baru</h1>
            <p className="mt-1.5 text-sm text-stone-500">
              Sudah memiliki akun?{" "}
              <Link href="/login" className="font-semibold text-amber-800 hover:text-amber-900 underline">
                Masuk ke akun Anda
              </Link>
            </p>
          </div>
          {/* Success Banner */}
          {successMessage && (
            <div className="mt-6 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-start space-x-3 text-sm">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Berhasil:</span>
                <p className="mt-0.5 text-green-700">{successMessage}</p>
              </div>
            </div>
          )}
          {/* Alert Error */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-start space-x-3 text-sm animate-shake">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Gagal Mendaftar:</span>
                <p className="mt-0.5 text-red-700">{error}</p>
              </div>
            </div>
          )}
          {/* Form */}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-stone-700 uppercase mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Gustavos"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-stone-700 uppercase mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Gustavos@gmail.com"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
            </div>
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-stone-700 uppercase mb-2">
                Nomor Telepon (WhatsApp)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="081234567890"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-stone-700 uppercase mb-2">
                Kata Sandi (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password minimal 6 karakter"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
            </div>
            <div className="text-xs text-stone-500 leading-normal">
              Dengan mengeklik daftar, Anda menyetujui bahwa informasi meja dan menu yang dipesan akan disimpan secara aman di server kami.
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition text-sm cursor-pointer"
            >
              {isSubmitting ? "Sedang Mendaftar..." : "Daftar Akun Baru"}
            </button>
          </form>
          {/* Footer note */}
          <p className="mt-8 text-center text-xs text-stone-400">
            Sistem Reservasi CafeReserve &bull; Powered by Railway API
          </p>
        </div>
      </div>
    </div>
  );
}