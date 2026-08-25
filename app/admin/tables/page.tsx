import { getSession, createTableAction, updateTableAction } from "../../actions";
import { railwayGetTables } from "@/lib/railway";
import { revalidatePath } from "next/cache";
import { 
  Grid3X3, 
  Plus, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Clock
} from "lucide-react";
import { redirect } from "next/navigation";
import AdminNav from "@/components/AdminNav";
export const dynamic = "force-dynamic";
export default async function ManageTablesPage(props: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const session = await getSession();
  const searchParams = await props.searchParams;
  // Tables come exclusively from Railway - GET /tables. No local fallback:
  // if Railway is empty or unreachable, that's shown as-is rather than
  // presenting fabricated tables.
  const rwTables = session?.accessToken ? await railwayGetTables(session.accessToken) : [];
  const allTables = rwTables.map((rwT) => ({
    id: rwT.id,
    rawNumber: rwT.number,
    number: `Meja ${String(rwT.number).padStart(2, "0")}`,
    capacity: rwT.capacity,
    status: rwT.status ? rwT.status.toLowerCase() : "available",
  }));
  // Server action handlers
  async function handleAddTable(formData: FormData) {
    "use server";
    const res = await createTableAction(formData);
    if (res?.error) {
      redirect(`/admin/tables?error=${encodeURIComponent(res.error)}`);
    } else {
      revalidatePath("/admin/tables");
      redirect(`/admin/tables?success=Meja+berhasil+ditambahkan%21`);
    }
  }
  // NOTE: there is no DELETE /tables endpoint in the documented Railway API,
  // so table deletion is intentionally not offered here - only status changes
  // and capacity edits, which are both backed by PATCH /tables/:tableId.
  async function handleToggleStatus(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("tableId") as string, 10);
    const capacity = parseInt(formData.get("capacity") as string, 10);
    const currentStatus = formData.get("status") as string;
    // We only know the statuses Railway has actually returned to us
    // (AVAILABLE / OCCUPIED so far); cycling beyond that would invent a
    // status the backend may not recognize, so this toggles between the two
    // known values.
    const nextStatus = currentStatus === "available" ? "occupied" : "available";
    if (!isNaN(id)) {
      await updateTableAction(id, { capacity, status: nextStatus });
      revalidatePath("/admin/tables");
      redirect(`/admin/tables?success=Status+meja+berhasil+diubah%21`);
    }
  }
  return (
    <div className="space-y-8">
      <AdminNav active="/admin/tables" />
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Kelola Meja Cafe</h1>
        <p className="text-sm text-stone-500">Tambahkan layout meja, atur kapasitas maksimum, dan ubah status operasional meja.</p>
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
        
        {/* Tables List */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-lg font-bold text-stone-900 flex items-center">
            <Grid3X3 className="mr-2 h-5 w-5 text-red-600" />
            Daftar Meja Cafe ({allTables.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {allTables.map(t => {
              return (
                <div 
                  key={t.id} 
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between h-44 hover:border-red-500/30 hover:shadow-md transition"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-mono font-black text-xl text-stone-900">
                        {t.number}
                      </span>
                      
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        t.status === "available" ? "bg-green-100 text-green-800" :
                        t.status === "maintenance" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-stone-500 mt-2">
                      <span className="flex items-center">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        Maks {t.capacity} Orang
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-stone-100 pt-3 flex justify-between items-center w-full">
                    {/* Toggle Status Action - PATCH /tables/:tableId */}
                    <form action={handleToggleStatus}>
                      <input type="hidden" name="tableId" value={t.id} />
                      <input type="hidden" name="capacity" value={t.capacity} />
                      <input type="hidden" name="status" value={t.status} />
                      <button
                        type="submit"
                        className="inline-flex items-center px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] font-bold rounded-lg transition cursor-pointer"
                        title="Klik untuk mengubah status meja"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        Ubah Status
                      </button>
                    </form>
                    {/* No delete action: Railway has no DELETE /tables endpoint. */}
                    <span className="inline-flex items-center gap-1 text-[10px] text-stone-400 italic">
                      <Info className="h-3 w-3" />
                      Hapus belum didukung API
                    </span>
                  </div>
                </div>
              );
            })}
            {allTables.length === 0 && (
              <div className="col-span-2 p-12 text-center bg-white rounded-3xl border border-stone-200 text-stone-500 italic">
                Belum ada meja yang terdaftar. Gunakan form di kanan untuk mendaftarkan meja pertama Anda.
              </div>
            )}
          </div>
        </div>
        {/* Add Table Form */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs h-fit">
          <div className="flex items-center space-x-2.5 mb-6">
            <div className="bg-red-100 text-red-900 p-2 rounded-xl">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900">Tambah Meja Baru</h2>
              <p className="text-xs text-stone-500">Daftarkan layout fisik meja cafe</p>
            </div>
          </div>
          <p className="text-[11px] text-stone-400 italic mb-4 flex items-start gap-1.5">
            <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            Railway hanya menyimpan nomor &amp; kapasitas meja - lokasi/deskripsi belum didukung API.
          </p>
          <form action={handleAddTable} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Nomor Meja</label>
              <input 
                type="number" 
                name="number"
                required
                min={1}
                placeholder="Contoh: 1, 2, 3"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition text-stone-900" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Kapasitas Maksimum (Orang)</label>
              <input 
                type="number" 
                name="capacity"
                required
                min={1}
                max={50}
                defaultValue={4}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition text-stone-900" 
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-stone-950 text-white font-bold rounded-xl transition text-sm cursor-pointer"
            >
              Tambah Meja Baru
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
