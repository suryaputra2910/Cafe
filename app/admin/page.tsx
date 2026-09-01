import { railwayGetBookings, railwayGetCustomers, railwayGetTables } from "@/lib/railway";
import {
  BookOpen,
  ChevronRight,
  Coffee,
  Grid3x3,
  Settings,
  ShieldCheck,
  Users2,
  UtensilsCrossed
} from "lucide-react";
import Link from "next/link";
import { getSession } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return null; // Layout will redirect
  }

  // Fetch real data from Railway API
  let stats = {
    tables: 0,
    customers: 0,
    bookings: 0,
    tablesByStatus: { available: 0, reserved: 0, occupied: 0 }
  };

  try {
    const [tables, customers, bookings] = await Promise.all([
      railwayGetTables(session.accessToken),
      railwayGetCustomers(session.accessToken),
      railwayGetBookings(session.accessToken, true) // Admin bookings
    ]);

    stats.tables = tables.length;
    stats.customers = customers.length;
    stats.bookings = bookings.length;

    // Count tables by status
    tables.forEach(t => {
      const status = (t.status || "available").toLowerCase();
      if (status === "available") stats.tablesByStatus.available++;
      else if (status === "reserved") stats.tablesByStatus.reserved++;
      else if (status === "occupied") stats.tablesByStatus.occupied++;
    });
  } catch (err) {
    // Silent fail - show what we can
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-stone-900 to-stone-800 rounded-3xl p-8 sm:p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-2">
              <Coffee className="h-5 w-5 text-amber-400" />
            </div>
            <span className="text-sm font-semibold text-amber-400 uppercase tracking-wider">CafeReserve Admin</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3">
          Manajemen Cafe
          </h1>
          <p className="text-stone-300 text-lg max-w-2xl leading-relaxed">
            Pantau status reservasi, meja, dan customer secara real-time. Semua data akan tersinkronisasi langsung.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tables Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Grid3x3 className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +{stats.tablesByStatus.available}
            </span>
          </div>
          <span className="block text-sm text-stone-500 font-semibold mb-1">Total Meja</span>
          <span className="text-3xl font-black text-stone-900">{stats.tables}</span>
          <p className="text-xs text-stone-400 mt-3">
            {stats.tablesByStatus.available} tersedia • {stats.tablesByStatus.reserved} dipesan
          </p>
        </div>

        {/* Customers Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 p-3 rounded-xl">
              <Users2 className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-xs font-bold text-stone-400 px-2 py-1">Customer</span>
          </div>
          <span className="block text-sm text-stone-500 font-semibold mb-1">Total Customer</span>
          <span className="text-3xl font-black text-stone-900">{stats.customers}</span>
          <p className="text-xs text-stone-400 mt-3">
            Registered members pada platform
          </p>
        </div>

        {/* Bookings Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-50 p-3 rounded-xl">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
            <span className="text-xs font-bold text-stone-400 px-2 py-1">Total</span>
          </div>
          <span className="block text-sm text-stone-500 font-semibold mb-1">Semua Reservasi</span>
          <span className="text-3xl font-black text-stone-900">{stats.bookings}</span>
          <p className="text-xs text-stone-400 mt-3">
            Seluruh booking (pending, approved, rejected)
          </p>
        </div>

        {/* Settings Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 hover:shadow-md transition">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-amber-50 p-3 rounded-xl">
              <Settings className="h-6 w-6 text-amber-600" />
            </div>
            <span className="text-xs font-bold text-stone-400 px-2 py-1">Setup</span>
          </div>
          <span className="block text-sm text-stone-500 font-semibold mb-1">Pengaturan Cafe</span>
          <p className="text-xs text-stone-600 mt-4">
            Kelola informasi cafe, nomor WA, dan pengaturan sistem
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bookings Management */}
        <Link 
          href="/admin/bookings"
          className="group bg-white rounded-3xl p-8 border border-stone-200 hover:shadow-lg hover:border-orange-300 transition"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-50 p-3 rounded-xl">
              <BookOpen className="h-6 w-6 text-orange-600" />
            </div>
            <ChevronRight className="h-5 w-5 text-stone-300 group-hover:text-orange-600 transition" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">Kelola Reservasi</h3>
          <p className="text-sm text-stone-600 mb-4">
            Approve, reject, atau selesaikan booking dari customer
          </p>
          <span className="inline-flex items-center text-sm font-semibold text-orange-600 group-hover:translate-x-1 transition">
            Buka → 
          </span>
        </Link>

        {/* Tables Management */}
        <Link 
          href="/admin/tables"
          className="group bg-white rounded-3xl p-8 border border-stone-200 hover:shadow-lg hover:border-blue-300 transition"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Grid3x3 className="h-6 w-6 text-blue-600" />
            </div>
            <ChevronRight className="h-5 w-5 text-stone-300 group-hover:text-blue-600 transition" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">Kelola Meja</h3>
          <p className="text-sm text-stone-600 mb-4">
            Tambah, edit, atau hapus meja cafe
          </p>
          <span className="inline-flex items-center text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition">
            Buka →
          </span>
        </Link>

        {/* Customers Management */}
        <Link 
          href="/admin/customers"
          className="group bg-white rounded-3xl p-8 border border-stone-200 hover:shadow-lg hover:border-purple-300 transition"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-50 p-3 rounded-xl">
              <Users2 className="h-6 w-6 text-purple-600" />
            </div>
            <ChevronRight className="h-5 w-5 text-stone-300 group-hover:text-purple-600 transition" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-2">Kelola Customer</h3>
          <p className="text-sm text-stone-600 mb-4">
            Lihat, edit, atau hapus data customer
          </p>
          <span className="inline-flex items-center text-sm font-semibold text-purple-600 group-hover:translate-x-1 transition">
            Buka →
          </span>
        </Link>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Admins */}
        <Link 
          href="/admin/admins"
          className="group bg-white rounded-2xl p-6 border border-stone-200 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-50 p-2.5 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-red-600" />
            </div>
            <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-red-600 transition" />
          </div>
          <h3 className="font-bold text-stone-900 mb-1">Admin</h3>
          <p className="text-xs text-stone-600">Kelola akun administrator</p>
        </Link>

        {/* Menu */}
        {/* <Link 
          href="/admin/menu"
          className="group bg-white rounded-2xl p-6 border border-stone-200 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-50 p-2.5 rounded-lg">
              <UtensilsCrossed className="h-5 w-5 text-green-600" />
            </div>
            <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-green-600 transition" />
          </div>
          <h3 className="font-bold text-stone-900 mb-1">Menu</h3>
          <p className="text-xs text-stone-600">Kelola menu cafe</p>
        </Link> */}

        {/* Settings */}
        <Link 
          href="/admin/settings"
          className="group bg-white rounded-2xl p-6 border border-stone-200 hover:shadow-md transition"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="bg-amber-50 p-2.5 rounded-lg">
              <Settings className="h-5 w-5 text-amber-600" />
            </div>
            <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-amber-600 transition" />
          </div>
          <h3 className="font-bold text-stone-900 mb-1">Pengaturan</h3>
          <p className="text-xs text-stone-600">Konfigurasi sistem cafe</p>
        </Link>
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <h3 className="font-bold text-blue-900 mb-2 flex items-center">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-200 text-blue-900 rounded-full text-xs font-bold mr-2">ℹ</span>
          Catatan Integrasi
        </h3>
        <p className="text-sm text-blue-800 leading-relaxed">
          Semua data (meja, customer, booking, admin) tersinkronisasi real-time dengan Railway API. Perubahan akan langsung tercermin di semua bagian sistem.
        </p>
      </div>
    </div>
  );
}
