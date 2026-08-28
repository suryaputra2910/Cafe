import { getSession } from "../actions";
import { railwayGetTables, railwayGetCustomers } from "@/lib/railway";
import { 
  CalendarRange, 
  Grid3X3, 
  Users2, 
  AlertCircle, 
  Sparkles,
  Utensils
} from "lucide-react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  let totalTablesCount = 0;
  let totalCustomersCount = 0;

  // Tables (GET /tables) and customers (GET /customer) are both documented,
  // reliable endpoints - these counts are real.
  if (session?.accessToken) {
    const [rwTables, rwCustomers] = await Promise.all([
      railwayGetTables(session.accessToken),
      railwayGetCustomers(session.accessToken),
    ]);
    totalTablesCount = rwTables.length;
    totalCustomersCount = rwCustomers.length;
  }

  // NOTE: there is no documented endpoint for an admin to list every
  // customer's bookings (only GET /bookings - the caller's own bookings -
  // and PATCH /admin/bookings/:id/approve|reject are documented). Rather
  // than call an unverified endpoint and show booking counts that might be
  // silently wrong, this dashboard is honest about the gap - see the
  // notice below and app/admin/bookings/page.tsx, which offers a manual
  // approve/reject-by-ID tool as the documented-endpoint-only workaround.

  return (
    <div className="space-y-8">
      <AdminNav active="/admin" />
      {/* Welcome Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-semibold mb-3 uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Dashboard Pengelola Cafe (Admin)</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Selamat Datang di Portal Pengaturan CafeReserve
          </h1>
          <p className="text-stone-300 text-sm leading-relaxed">
            Gunakan portal ini untuk mengelola kapasitas meja cafe dan data pelanggan yang tersinkronisasi dengan Railway API.
          </p>
        </div>
      </div>
      {/* Metrics Grid - only real, documented-endpoint-backed counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-xs text-stone-500 font-bold uppercase tracking-wider">Jumlah Meja</span>
              <span className="text-3xl font-black text-blue-600 mt-1 block">{totalTablesCount}</span>
            </div>
            <div className="bg-blue-50 text-blue-800 p-2.5 rounded-xl">
              <Grid3X3 className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex justify-between items-start">
            <div>
              <span className="block text-xs text-stone-500 font-bold uppercase tracking-wider">Total Customer</span>
              <span className="text-3xl font-black text-purple-600 mt-1 block">{totalCustomersCount}</span>
            </div>
            <div className="bg-purple-50 text-purple-800 p-2.5 rounded-xl">
              <Users2 className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
      {/* Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Booking management pointer */}
        <div className="lg:col-span-12 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-bold text-stone-900 flex items-center">
                <CalendarRange className="h-5 w-5 mr-2 text-red-600" />
                Kelola Reservasi
              </h2>
              <p className="text-xs text-stone-500">
                Approve atau reject booking menggunakan ID dari kode reservasi (contoh: BK-123 pada konfirmasi WhatsApp customer).
              </p>
            </div>
            <Link 
              href="/admin/bookings" 
              className="inline-flex items-center px-4 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-xl transition shrink-0"
            >
              Buka Halaman Booking
            </Link>
          </div>
        </div>
        {/* Quick Tips Box */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-sm mb-3 flex items-center">
              <Utensils className="h-5 w-5 mr-1.5 text-red-600" />
              Alur Manajemen Reservasi
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Setiap kali customer membuat reservasi di Railway API, status pemesanan berada di kondisi <strong>PENDING</strong>. Admin dapat menyetujui atau menolak booking (menggunakan ID booking) untuk mengubah status secara real-time di Railway API.
            </p>
          </div>
          <div className="bg-red-50 border border-red-200/50 rounded-2xl p-4 mt-4">
            <span className="text-red-950 font-bold block text-xs mb-1">Status Penjelasan</span>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              <strong>PENDING:</strong> Menunggu verifikasi admin.<br />
              <strong>APPROVED:</strong> Reservasi telah disetujui admin.<br />
              <strong>REJECTED:</strong> Reservasi telah ditolak admin.
            </p>
          </div>
        </div>
        {/* Cafe Information Card */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-sm mb-3 flex items-center">
              <Sparkles className="h-5 w-5 mr-1.5 text-amber-700" />
              Status Integrasi
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Sistem terhubung dengan Railway API untuk data meja dan customer. Fitur booking bergantung pada endpoint yang tersedia di Postman collection - lihat catatan di atas untuk keterbatasan yang berlaku saat ini.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
