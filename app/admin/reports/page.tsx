import { getSession } from "../../actions";
import { railwayGetTables } from "@/lib/railway";
import AdminNav from "@/components/AdminNav";
import { 
  BarChart3, 
  AlertCircle,
  Grid3X3,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CafeReportsPage() {
  const session = await getSession();
  const rwTables = session?.accessToken ? await railwayGetTables(session.accessToken) : [];

  // NOTE: booking-derived analytics (table popularity, busy hours, status
  // distribution, total bookings) all require seeing every customer's
  // bookings. There is no documented endpoint for that (only GET /bookings -
  // the caller's own bookings - and PATCH /admin/bookings/:id/approve|reject
  // are documented). Rather than compute and display statistics from an
  // unverified/likely-incomplete data source, this page is upfront about
  // the gap instead of showing numbers that could be silently wrong.

  return (
    <div className="space-y-8">
      <AdminNav active="/admin/reports" />
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Laporan & Analisis Cafe</h1>
        <p className="text-sm text-stone-500">Statistik performa cafe berdasarkan data Railway API.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
        <AlertCircle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">Laporan booking belum bisa ditampilkan.</p>
          <p>
            Statistik seperti meja terpopuler, jam kunjungan teramai, dan distribusi status booking
            membutuhkan akses ke seluruh data booking pelanggan. API Railway yang terdokumentasi tidak
            menyediakan endpoint untuk itu: tidak ada <code className="font-mono bg-amber-100 px-1 rounded">GET /admin/bookings</code>
            {" "}pada Postman collection/spesifikasi yang diberikan - yang tersedia hanya{" "}
            <code className="font-mono bg-amber-100 px-1 rounded">GET /bookings</code> untuk booking milik akun yang login,
            dan <code className="font-mono bg-amber-100 px-1 rounded">PATCH /admin/bookings/:id/approve</code>/<code className="font-mono bg-amber-100 px-1 rounded">reject</code>.
          </p>
          <p>
            Mohon konfirmasi ke tim backend apakah endpoint listing booking untuk admin memang belum ada,
            atau tersedia dengan path lain yang belum didokumentasikan - laporan ini akan diaktifkan kembali
            setelah endpoint tersebut dikonfirmasi.
          </p>
        </div>
      </div>

      {/* The one reliable, documented-endpoint-backed number available here */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center space-x-5 w-fit">
        <div className="bg-blue-50 text-blue-800 p-4 rounded-2xl shrink-0">
          <Grid3X3 className="h-6 w-6" />
        </div>
        <div>
          <span className="block text-xs text-stone-500 font-bold uppercase tracking-wider">Jumlah Meja Terdaftar</span>
          <span className="text-2xl font-black text-stone-900 mt-1 block">{rwTables.length} Meja</span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Dari GET /tables di Railway API</span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-xs text-center text-stone-400">
        <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm italic">Grafik meja terpopuler, jam ramai, dan distribusi status akan muncul di sini setelah endpoint booking untuk admin tersedia.</p>
      </div>
    </div>
  );
}
