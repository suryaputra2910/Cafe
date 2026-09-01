import AdminNav from "@/components/AdminNav";
import {
  Mail,
  Phone,
  PhoneCall,
  Users2,
} from "lucide-react";
import { listCustomersAction } from "../../actions";
import CustomerEditForm from "./CustomerEditForm";
import DeleteCustomerButton from "./DeleteCustomerButton";

export const dynamic = "force-dynamic";

export default async function ManageCustomersPage(props: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const searchParams = await props.searchParams;

  // Customers come exclusively from Railway - GET /customer.
  const res = await listCustomersAction();
  const customersList = res.customers || [];

  return (
    <div className="space-y-6">
      <AdminNav active="/admin/customers" />
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Kelola Customer</h1>
        <p className="text-sm text-stone-500">Daftar pelanggan terdaftar di backend Railway.</p>
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
            <Users2 className="mr-2 h-4 w-4 text-red-600" />
            Pelanggan Terdaftar ({customersList.length})
          </h2>
        </div>
        <div className="divide-y divide-stone-150">
          {customersList.map((c) => {
            const name = c.name || c.email.split("@")[0];
            return (
              <div
                key={c.id}
                className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-stone-50/30 transition"
              >
                {/* Info Block */}
                <div className="space-y-2 min-w-0">
                  <div className="flex items-center space-x-2.5">
                    <div className="bg-amber-100 text-amber-900 font-bold h-9 w-9 rounded-xl flex items-center justify-center text-sm shrink-0">
                      {name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="font-extrabold text-stone-950 text-sm block truncate">{name}</span>
                      <span className="text-stone-400 text-[10px] block">
                        ID Pelanggan: #{c.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600 pl-11">
                    <span className="flex items-center">
                      <Mail className="h-3.5 w-3.5 mr-1 text-stone-400" />
                      {c.email}
                    </span>
                    <span className="flex items-center">
                      <Phone className="h-3.5 w-3.5 mr-1 text-stone-400" />
                      {c.phone || "- no phone -"}
                    </span>
                  </div>
                </div>
                {/* Actions Block */}
                <div className="flex items-center gap-2 shrink-0 pl-11 sm:pl-0">
                  {c.phone && (
                    <a
                      href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition border border-green-200/50"
                      title="Hubungi Customer via WhatsApp"
                    >
                      <PhoneCall className="h-4 w-4" />
                    </a>
                  )}
                  <CustomerEditForm
                    customerId={c.id}
                    initialName={c.name || ""}
                    initialPhone={c.phone || ""}
                  />
                  <DeleteCustomerButton
                    customerId={c.id}
                    customerName={name}
                  />
                </div>
              </div>
            );
          })}
          {customersList.length === 0 && (
            <div className="p-16 text-center text-stone-500 italic bg-stone-50/50">
              Belum ada pelanggan terdaftar saat ini.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
