"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Calendar as CalendarIcon, 
  Clock as ClockIcon, 
  Users as UsersIcon, 
  MapPin as MapPinIcon, 
  ArrowRight, 
  AlertCircle,
  CheckCircle,
  Lock,
  Sparkles,
  LogIn,
  UserPlus
} from "lucide-react";

interface Table {
  id: number;
  number: string;
  capacity: number;
  location: string;
  status: string;
  description: string | null;
}

interface HomepageReservationFormProps {
  tables: Table[];
  isLoggedIn: boolean;
  isCustomer: boolean;
}

export default function HomepageReservationForm({
  tables,
  isLoggedIn,
  isCustomer,
}: HomepageReservationFormProps) {
  const router = useRouter();

  // Fields state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [guests, setGuests] = useState(2);
  const [area, setArea] = useState("Semua");
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  // If user is NOT logged in as customer, show friendly prompt without exposing table selection
  if (!isCustomer) {
    return (
      <div className="bg-white rounded-3xl border border-stone-200/90 p-8 md:p-12 shadow-sm text-center max-w-3xl mx-auto">
        <div className="inline-flex p-4 bg-amber-100/70 text-amber-900 rounded-2xl mb-6 shadow-xs">
          <Lock className="h-8 w-8 text-amber-800" />
        </div>
        
        <h3 className="text-2xl md:text-3xl font-extrabold text-stone-900 tracking-tight mb-3">
          Reservasi Khusus Customer CafeReserve
        </h3>
        
        <p className="text-stone-600 text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed">
          Silakan login sebagai customer untuk melakukan reservasi meja, memilih posisi tempat duduk favorit, dan melihat ketersediaan kursi secara langsung.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/login?redirect=/reservasi"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition text-sm cursor-pointer gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Login Customer</span>
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-xl border border-stone-200 transition text-sm cursor-pointer gap-2"
          >
            <UserPlus className="h-4 w-4 text-stone-600" />
            <span>Daftar Akun Baru</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-green-600" /> Real-time status meja
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-green-600" /> Bebas pilih area indoor & outdoor
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-green-600" /> Konfirmasi admin transparan
          </span>
        </div>
      </div>
    );
  }

  // Filter tables based on area and guests
  const filteredTables = tables.filter((t) => {
    if (area !== "Semua" && t.location.toLowerCase() !== area.toLowerCase()) {
      return false;
    }
    return true;
  });

  const handleProceed = (tableId: number) => {
    if (!date) {
      alert("Silakan pilih tanggal kunjungan terlebih dahulu.");
      return;
    }
    router.push(`/reservasi?tableId=${tableId}&date=${date}&time=${time}&guests=${guests}`);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/80 p-6 md:p-8 shadow-sm space-y-8">
      {/* Search / Filter Filter Row */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-700" />
              Pilih Meja yang Tersedia
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Data langsung tersinkronisasi dengan sistem CafeReserve backend.
            </p>
          </div>

          {/* Area Filter */}
          <div className="flex flex-wrap gap-1.5">
            {["Semua", "Indoor", "Outdoor", "VIP Room"].map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setArea(a)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  area === a
                    ? "bg-amber-800 text-white shadow-xs"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-2 flex items-center">
              <CalendarIcon className="h-3.5 w-3.5 mr-1.5 text-amber-800" />
              Tanggal Kunjungan
            </label>
            <input 
              type="date" 
              required
              min={new Date().toISOString().split("T")[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/40 text-stone-900 bg-stone-50 font-medium" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-2 flex items-center">
              <ClockIcon className="h-3.5 w-3.5 mr-1.5 text-amber-800" />
              Jam Kedatangan
            </label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/40 text-stone-900 bg-stone-50 font-medium"
            >
              {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"].map((t) => (
                <option key={t} value={t}>{t} WIB</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase mb-2 flex items-center">
              <UsersIcon className="h-3.5 w-3.5 mr-1.5 text-amber-800" />
              Jumlah Tamu
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value, 10))}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/40 text-stone-900 bg-stone-50 font-medium"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                <option key={n} value={n}>{n} Orang</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTables.map((t) => {
            const isAvailable = true; // Conflicts are date/time specific, checked during booking
            const isSelected = selectedTableId === t.id;
            const isTooSmall = guests > t.capacity;

            return (
              <div
                key={t.id}
                onClick={() => {
                  if (isAvailable && !isTooSmall) {
                    setSelectedTableId(t.id);
                  }
                }}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between relative ${
                  !isAvailable || isTooSmall
                    ? "bg-stone-100/80 border-stone-200 opacity-60 cursor-not-allowed"
                    : isSelected
                    ? "bg-amber-50/40 border-amber-800 ring-2 ring-amber-800/30 cursor-pointer shadow-md"
                    : "bg-stone-50/50 border-stone-200/80 hover:border-amber-700 hover:bg-white cursor-pointer shadow-2xs"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className={`font-extrabold text-base ${isSelected ? "text-amber-900" : "text-stone-900"}`}>
                      {t.number}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider bg-green-100 text-green-800 border border-green-200`}>
                        Tersedia
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-500 mt-2">
                    {t.description || `Meja kafe area ${t.location}`}
                  </p>

                  <div className="flex items-center justify-between text-xs text-stone-600 mt-3 pt-2 border-t border-stone-200/50">
                    <span className="font-semibold">Kapasitas: Maks {t.capacity} Orang</span>
                    <span className="text-[10px] text-amber-900 font-bold bg-amber-100/60 px-2 py-0.5 rounded">
                      {t.location}
                    </span>
                  </div>

                  {isTooSmall && (
                    <span className="text-[10px] text-red-600 font-semibold block mt-1">
                      *Tamu ({guests}) melebihi kapasitas ({t.capacity})
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/60">
                  <button
                    type="button"
                    disabled={!isAvailable || isTooSmall}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProceed(t.id);
                    }}
                    className={`w-full py-2.5 text-xs font-bold rounded-xl flex items-center justify-center transition gap-1.5 ${
                      !isAvailable || isTooSmall
                        ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                        : isSelected
                        ? "bg-amber-800 text-white hover:bg-amber-900 shadow-xs cursor-pointer"
                        : "bg-stone-900 hover:bg-stone-950 text-white cursor-pointer"
                    }`}
                  >
                    <span>{isSelected ? "Lanjut Reservasi Meja Ini" : "Pesan Meja Ini"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTables.length === 0 && (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-sm">
            Tidak ada meja ditemukan untuk filter yang dipilih.
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-stone-100 gap-4 text-xs text-stone-500">
        <p>
          Ingin melihat denah cafe lengkap atau menambahkan catatan khusus?
        </p>
        <Link
          href="/reservasi"
          className="inline-flex items-center text-amber-800 font-bold hover:underline"
        >
          <span>Buka Halaman Reservasi Lengkap</span>
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
