import { getSession, updateProfileAction } from "../actions";
import { railwayGetBookings } from "@/lib/railway";
import { revalidatePath } from "next/cache";
import { 
  User, 
  Phone, 
  Calendar, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function CustomerDashboardPage(props: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const searchParams = await props.searchParams;
  // Bookings are sourced exclusively from Railway - GET /bookings.
  const rwBookings = await railwayGetBookings(session.accessToken);
  const userBookings: Array<{ id: number; status: string }> = rwBookings.map((rwB) => ({
    id: rwB.id,
    status: rwB.status ? rwB.status.toUpperCase() : "PENDING",
  }));
  // Calculate statistics from Railway backend status
  const total = userBookings.length;
  const pending = userBookings.filter(
    (b) => b.status === "PENDING" || b.status === "pending"
  ).length;
  const confirmed = userBookings.filter(
    (b) =>
      b.status === "CONFIRMED" ||
      b.status === "APPROVED" ||
      b.status === "confirmed" ||
      b.status === "approved"
  ).length;
  const completed = userBookings.filter(
    (b) => b.status === "COMPLETED" || b.status === "completed"
  ).length;
  // Form action handler for profile updates
  async function handleProfileUpdate(formData: FormData) {
    "use server";
    const res = await updateProfileAction(formData);
    if (res?.error) {
      redirect(`/customer?error=${encodeURIComponent(res.error)}`);
    } else {
      revalidatePath("/customer");
      redirect(`/customer?success=Profil+berhasil+diperbarui%21`);
    }
  }
  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <span className="text-amber-300 text-xs font-bold uppercase tracking-widest block mb-2">
            Selamat Datang Kembali
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            Halo, {session.name}!
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Pesan tempat duduk impian Anda untuk kumpul keluarga, kencan romantis, atau kerja santai (WFC). Semuanya berada di ujung jari Anda.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link 
              href="/customer/booking" 
              className="inline-flex items-center px-5 py-2.5 bg-white text-amber-950 text-xs font-bold rounded-xl hover:bg-stone-100 transition shadow-sm"
            >
              <span>Booking Meja Sekarang</span>
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
            <Link 
              href="/customer/my-bookings" 
              className="inline-flex items-center px-5 py-2.5 bg-amber-700/50 text-white border border-amber-500/30 text-xs font-bold rounded-xl hover:bg-amber-700/70 transition"
            >
              <span>Lihat Booking Saya</span>
            </Link>
          </div>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-900 shrink-0">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs text-stone-500 font-medium">Total Booking</span>
            <span className="text-xl font-extrabold text-stone-900">{total}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-yellow-100 text-yellow-900 shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs text-stone-500 font-medium">Menunggu Konfirmasi</span>
            <span className="text-xl font-extrabold text-stone-900">{pending}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-green-100 text-green-900 shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs text-stone-500 font-medium">Telah Dikonfirmasi</span>
            <span className="text-xl font-extrabold text-stone-900">{confirmed}</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-stone-100 text-stone-900 shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-xs text-stone-500 font-medium">Kunjungan Selesai</span>
            <span className="text-xl font-extrabold text-stone-900">{completed}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Profile Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-amber-100 text-amber-900 p-2.5 rounded-xl">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Kelola Profil</h2>
              <p className="text-xs text-stone-500">Perbarui informasi kontak pribadi Anda</p>
            </div>
          </div>
          {searchParams.success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>{searchParams.success}</span>
            </div>
          )}
          {searchParams.error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-xs font-semibold flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <span>{searchParams.error}</span>
            </div>
          )}
          <form action={handleProfileUpdate} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={session.name}
                  className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Alamat Email (Tidak Dapat Diubah)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <ShieldCheck className="h-4 w-4 text-stone-400" />
                </div>
                <input
                  type="email"
                  disabled
                  value={session.email}
                  className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-100 bg-stone-50 text-stone-500 text-sm focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Nomor Telepon (WhatsApp)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  required
                  defaultValue={session.phone || ""}
                  className="block w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl transition text-sm cursor-pointer"
            >
              Simpan Perubahan Profil
            </button>
          </form>
        </div>
        {/* Quick Guide and Instructions */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-stone-900 text-md mb-3 flex items-center">
              <ShieldCheck className="h-5 w-5 mr-1.5 text-amber-700" />
              Petunjuk Reservasi Cafe
            </h3>
            <ul className="space-y-4 text-xs text-stone-600 mt-4">
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-900 h-5 w-5 rounded-full flex items-center justify-center font-bold shrink-0 mr-3 text-[15px]">1</span>
                <div>
                  <strong className="block text-stone-900 mb-0.5">Buka Menu Booking Meja</strong>
                  Pilih waktu kunjungan, tentukan meja favorit, dan masukkan jumlah tamu sesuai kapasitas meja.
                </div>
              </li>
              <li className="flex items-start">
                <span className="bg-amber-100 text-amber-900 h-5 w-5 rounded-full flex items-center justify-center font-bold shrink-0 mr-3 text-[15px]">2</span>
                <div>
                  <strong className="block text-stone-900 mb-0.5">Selesaikan via WhatsApp</strong>
                  Setelah submit, Anda akan mendapatkan kode booking. Anda dapat melakukan pre-order via WhatsApp resmi kami hanya dengan mengklik tombol WhatsApp yang tersedia di riwayat booking.
                </div>
              </li>
            </ul>
          </div>
          <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-4 mt-6">
            <span className="text-amber-950 font-bold block text-xs mb-1">Butuh Bantuan Mendesak?</span>
            <p className="text-[12px] text-stone-600 leading-normal">
              Hubungi CS CafeReserve via telepon atau WhatsApp resmi di +6283857642962 jika Anda ingin melakukan perubahan jadwal dadakan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}