import AdminNav from "@/components/AdminNav";
import { railwayGetCustomers, railwayGetTables } from "@/lib/railway";
import {
  AlertCircle,
  Grid3X3,
  Users2
} from "lucide-react";
import { getSession } from "../../actions";

export const dynamic = "force-dynamic";

export default async function CafeReportsPage() {
  const session = await getSession();
  const rwTables = session?.accessToken ? await railwayGetTables(session.accessToken) : [];
  const rwCustomers = session?.accessToken ? await railwayGetCustomers(session.accessToken) : [];

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
        </div>
      </div>
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex items-center w-fit">
        <div className="bg-green-50 text-green-800 p-4 rounded-2xl shrink-0">
          <Users2 className="h-6 w-6" />
        </div>
        <div>
          <span className="block text-xs text-stone-500 font-bold uppercase tracking-wider">Jumlah Customer Terdaftar</span>
          <span className="text-2xl font-black text-stone-900 mt-1 block">{rwCustomers.length} Customer</span>
        </div>
      </div>
    </div>
  );
}
