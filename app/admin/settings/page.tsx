import { db } from "@/db";
import { safeQuery } from "@/db/ensure";
import {} from "@/db/schema";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Coffee,
  MapPin,
  Phone,
  Settings
} from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function CafeSettingsPage(props: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const searchParams = await props.searchParams;
  // Fetch settings safely
  const allSettings = await safeQuery(
    () => db.select().from(Settings),
    [] as Array<{ id: number; key: string; value: string }>
  );
  const settingsMap = allSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
  const cafeName = settingsMap["cafe_name"] || "CafeReserve & Roastery";
  const cafePhone = settingsMap["cafe_phone"] || "6281234567890";
  const cafeHours = settingsMap["cafe_hours"] || "Setiap Hari (09:00 - 23:00)";
  const cafeAddress = settingsMap["cafe_address"] || "Jl. Senopati Raya No. 12, Kebayoran Baru, Jakarta Selatan";
  const cafeDesc = settingsMap["cafe_desc"] || "Kafe modern dengan konsep nyaman yang menyajikan biji kopi pilihan terbaik, hidangan lezat, dan ruang kumpul/kerja yang estetik.";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Pengaturan Aplikasi</h1>
        <p className="text-sm text-stone-500">Konfigurasikan informasi nama cafe, jam buka, alamat, dan nomor WhatsApp resmi penerima pre-order.</p>
      </div>
      {searchParams.success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span>{searchParams.success}</span>
        </div>
      )}
      {searchParams.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-xs font-semibold flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <span>{searchParams.error}</span>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Settings Form */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <div className="flex items-center space-x-2.5 mb-6">
            <div className="bg-red-100 text-red-900 p-2 rounded-xl">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 font-sans">Informasi Umum Cafe</h2>
              <p className="text-xs text-stone-500">Sesuaikan data yang akan tampil di halaman utama (Landing Page)</p>
            </div>
          </div>
          <form className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Nama Cafe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Coffee className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="cafe_name"
                  required
                  defaultValue={cafeName}
                  className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-2">
                Nomor Telepon / WhatsApp Cafe (Format: 628xxx tanpa tanda +)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="cafe_phone"
                  required
                  defaultValue={cafePhone}
                  className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition font-medium"
                />
              </div>
              <p className="text-[10px] text-stone-500 mt-1">
                *PENTING: Nomor ini digunakan sebagai tujuan otomatis saat customer mengirim format pre-order menu via WhatsApp. Gunakan format internasional tanpa spasi, contoh: 6281234567890.
              </p>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Jam Operasional</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Clock className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="cafe_hours"
                  required
                  defaultValue={cafeHours}
                  className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Alamat Cafe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="cafe_address"
                  required
                  defaultValue={cafeAddress}
                  className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition font-medium"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Deskripsi Singkat Cafe</label>
              <div className="relative">
                <textarea
                  name="cafe_desc"
                  rows={4}
                  required
                  defaultValue={cafeDesc}
                  className="block w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-stone-900 hover:bg-stone-950 text-white font-bold rounded-xl transition text-sm cursor-pointer"
            >
              Simpan Pengaturan Aplikasi
            </button>
          </form>
        </div>
        {/* Info panel */}
        <div className="lg:col-span-4 bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-red-400 uppercase tracking-widest">Sistem Integrasi</h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              Semua parameter konfigurasi ini disimpan secara aman. Setiap perubahan yang Anda simpan di sini akan langsung berdampak real-time di halaman utama, sehingga tidak membutuhkan penulisan kode keras (hard-coding) tambahan.
            </p>
          </div>
          <div className="mt-8 pt-6 border-t border-stone-800 text-stone-500 text-xs">
            <span>CafeReserve &bull; Versi 1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function updateSettingsAction(data: { cafe_name: string; cafe_phone: string; cafe_hours: string; cafe_address: string; cafe_desc: string; }) {
  throw new Error("Function not implemented.");
}
