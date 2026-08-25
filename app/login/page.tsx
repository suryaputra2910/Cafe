"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Coffee, ArrowLeft, KeyRound, Mail, AlertCircle, Sparkles, Check } from "lucide-react";
import { loginAction } from "../actions";
export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // States for input fields
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const handleQuickFill = (role: "admin" | "customer") => {
    if (role === "admin") {
      setEmailInput("GAdmin@cafe.com");
      setPasswordInput("AdminPassword123!");
    } else {
      setEmailInput("Gustavos@gmail.com");
      setPasswordInput("Gustavos123!");
    }
    setError(null);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      // Ensure exact case is preserved for Railway API
      formData.set("email", emailInput);
      formData.set("password", passwordInput);
      const res = await loginAction(null, formData);
      if (res?.error) {
        setError(res.error);
      } else if (res?.success && res.user) {
        if (res.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/customer");
        }
        router.refresh();
      }
    } catch (err: any) {
      setError("Terjadi kesalahan: " + (err?.message || "Silakan coba lagi."));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col lg:flex-row">
      
      {/* Left decorative column */}
      <div className="hidden lg:flex lg:w-1/2 bg-stone-900 relative items-center justify-center text-white p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800" 
            alt="Warm coffee pouring" 
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
            Selamat Datang di <br />
            <span className="text-amber-400">CafeReserve</span>
          </h2>
          <p className="text-stone-300 leading-relaxed text-sm mb-6">
            Pesan tempat duduk favorit Anda dan hidangan kopi spesial sebelum tiba di lokasi. Waktu berharga Anda pantas dinikmati dengan kenyamanan maksimal.
          </p>
          <div className="border-t border-stone-800 pt-6 mt-8">
            <div className="flex items-center space-x-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="h-4 w-4" />
              <span>Saran Akses Cepat</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              Gunakan widget login otomatis di sebelah kanan untuk mencoba fitur sebagai Pelanggan atau Pengelola Kafe secara instan tanpa perlu mendaftar ulang.
            </p>
          </div>
        </div>
      </div>
      {/* Right form column */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 py-12 bg-white relative">
        <div className="mx-auto w-full max-w-md">
          
          {/* Mobile Back Header */}
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
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">Masuk ke Akun Anda</h1>
            <p className="mt-1.5 text-sm text-stone-500">
              Belum punya akun?{" "}
              <Link href="/register" className="font-semibold text-amber-800 hover:text-amber-900 underline">
                Daftar sekarang gratis
              </Link>
            </p>
          </div>
          {/* Alert Error */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 flex items-start space-x-3 text-sm animate-shake">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Gagal Masuk:</span>
                <p className="mt-0.5 text-red-700">{error}</p>
              </div>
            </div>
          )}
          {/* Form */}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
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
                  autoComplete="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Masukkan email anda"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-bold text-stone-700 uppercase">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline"
                >
                  Lupa Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl shadow-md disabled:opacity-50 transition text-sm cursor-pointer"
            >
              {isSubmitting ? "Sedang Memproses..." : "Masuk Sekarang"}
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
