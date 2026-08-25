import { listAdminsAction, deleteAdminAction } from "../../actions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import AdminNav from "@/components/AdminNav";
import AdminEditForm from "./AdminEditForm";
import {
  ShieldCheck,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ManageAdminsPage(props: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const searchParams = await props.searchParams;

  // Admins come exclusively from Railway - GET /admin.
  const res = await listAdminsAction();
  const adminsList = res.admins || [];

  async function handleDelete(formData: FormData) {
    "use server";
    const id = parseInt(formData.get("adminId") as string, 10);
    if (!isNaN(id)) {
      const result = await deleteAdminAction(id);
      if (result?.error) {
        redirect(`/admin/admins?error=${encodeURIComponent(result.error)}`);
      }
      revalidatePath("/admin/admins");
      redirect(`/admin/admins?success=Admin+berhasil+dihapus%21`);
    }
  }

  return (
    <div className="space-y-6">
      <AdminNav active="/admin/admins" />
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Kelola Admin</h1>
        <p className="text-sm text-stone-500">
          Daftar akun admin terdaftar di backend Railway. Pendaftaran admin baru dilakukan lewat endpoint khusus (POST /auth/admin), tidak lewat halaman publik.
        </p>
      </div>
      {searchParams.success && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-xs font-semibold">
          {searchParams.success}
        </div>
      )}
      {searchParams.error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-xs font-semibold">
          {searchParams.error}
        </div>
      )}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 bg-stone-50/50 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 flex items-center">
            <ShieldCheck className="mr-2 h-4 w-4 text-red-600" />
            Admin Terdaftar ({adminsList.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold">
                <th className="py-3 px-6 uppercase">ID</th>
                <th className="py-3 px-6 uppercase">Nama</th>
                <th className="py-3 px-6 uppercase">Email</th>
                <th className="py-3 px-6 uppercase">Phone</th>
                <th className="py-3 px-6 uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {adminsList.map((a) => {
                const name = a.name || a.email.split("@")[0];
                return (
                  <tr key={a.id} className="hover:bg-stone-50/50 transition">
                    <td className="py-3 px-6 font-mono text-stone-400">#{a.id}</td>
                    <td className="py-3 px-6 font-bold text-stone-900">{name}</td>
                    <td className="py-3 px-6">
                      <span className="flex items-center">
                        <Mail className="h-3.5 w-3.5 mr-1.5 text-stone-400" />
                        {a.email}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className="flex items-center">
                        <Phone className="h-3.5 w-3.5 mr-1.5 text-stone-400" />
                        {a.phone || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex justify-end items-start gap-2">
                        <AdminEditForm
                          adminId={a.id}
                          initialName={a.name || ""}
                          initialEmail={a.email}
                          initialPhone={a.phone || ""}
                        />
                        <form
                          action={handleDelete}
                          onSubmit={(e) => {
                            if (!confirm(`Hapus admin ${name}? Tindakan ini permanen.`)) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="adminId" value={a.id} />
                          <button
                            type="submit"
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl transition border border-red-200/50 cursor-pointer"
                            title="Hapus Admin"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {adminsList.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-stone-500 italic bg-stone-50/50">
                    Belum ada admin terdaftar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
