"use client";

import AdminNav from "@/components/AdminNav";
import {
  Mail,
  Phone,
  PhoneCall,
  Search,
  Users2,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { listCustomersAction } from "../../actions";
import CustomerEditForm from "./CustomerEditForm";
import DeleteCustomerButton from "./DeleteCustomerButton";

interface Customer {
  id: number;
  name?: string;
  email: string;
  phone?: string;
}

export default function ManageCustomersPage(props: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<{ success?: string; error?: string }>({});

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const params = await props.searchParams;
        setSearchParams(params);
        const res = await listCustomersAction();
        setCustomersList(res.customers || []);
      } catch (error) {
        console.error("Error loading customers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [props.searchParams]);

  const filteredCustomers = customersList.filter((c) => {
    const name = c.name || c.email.split("@")[0];
    const searchLower = searchQuery.toLowerCase();
    return (
      name.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      (c.phone?.toLowerCase().includes(searchLower) ?? false)
    );
  });

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
        <div className="px-6 py-4 bg-stone-50/50 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-stone-900 flex items-center">
            <Users2 className="mr-2 h-4 w-4 text-red-600" />
            Pelanggan Terdaftar ({filteredCustomers.length})
          </h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Cari nama, email, atau nomor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="divide-y divide-stone-150">
          {filteredCustomers.map((c) => {
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
                      title="Hubungi Customer Via WhatsApp"
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
          {customersList.length > 0 && filteredCustomers.length === 0 && (
            <div className="p-16 text-center text-stone-500 italic bg-stone-50/50">
              Tidak ada hasil pencarian untuk "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
