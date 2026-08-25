"use client";
import React, { useState, useTransition } from "react";
import { 
  Search, 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  Check, 
  Ban, 
  PhoneCall,
  User,
  Coffee,
  HelpCircle
} from "lucide-react";
import { approveBookingAction, rejectBookingAction } from "../../actions";
export interface BookingItem {
  id: number;
  bookingCode: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  notes: string | null;
  preorderItems: string | null;
  createdAt: Date | string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  tableNumber: string;
}
export interface BookingsAdminClientProps {
  initialBookings: BookingItem[];
}
export default function BookingsAdminClient({ initialBookings }: BookingsAdminClientProps) {
  const [bookingsList, setBookingsList] = useState<BookingItem[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Format Helper for Rupiah
  const formatRupiah = (num: number) => {
    return "Rp " + num.toLocaleString("id-ID");
  };
  // Status Badge Component
  const getStatusBadge = (rawStatus: string) => {
    const status = (rawStatus || "").toUpperCase();
    switch (status) {
      case "APPROVED":
      case "CONFIRMED":
        return <span className="px-2.5 py-1 bg-green-100 text-green-800 text-[10px] font-bold rounded-md uppercase">APPROVED</span>;
      case "REJECTED":
        return <span className="px-2.5 py-1 bg-red-100 text-red-800 text-[10px] font-bold rounded-md uppercase">REJECTED</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 bg-stone-200 text-stone-700 text-[10px] font-bold rounded-md uppercase">CANCELLED</span>;
      case "COMPLETED":
        return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-md uppercase">COMPLETED</span>;
      default:
        return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-[10px] font-bold rounded-md uppercase">PENDING</span>;
    }
  };
  // Handle server actions on client side.
  // NOTE: only approve/reject are wired up here - Railway has no endpoint to
  // mark a booking "completed" or for anyone but the backend to cancel one,
  // so those actions were removed rather than faked against a local table.
  const handleAction = async (id: number, actionType: "approve" | "reject") => {
    setError(null);
    startTransition(async () => {
      const res = actionType === "approve"
        ? await approveBookingAction(id)
        : await rejectBookingAction(id);
      if (res?.error) {
        setError(res.error);
      } else {
        setBookingsList(prev =>
          prev.map(b =>
            b.id === id ? { ...b, status: actionType === "approve" ? "APPROVED" : "REJECTED" } : b
          )
        );
      }
    });
  };
  // Filters logic
  const filteredBookings = bookingsList.filter(b => {
    // 1. Status Filter
    const matchesStatus = statusFilter === "Semua" || b.status.toUpperCase() === statusFilter.toUpperCase();
    
    // 2. Search Term Filter
    const matchesSearch = 
      b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.customerPhone && b.customerPhone.includes(searchTerm));
    return matchesStatus && matchesSearch;
  });
  return (
    <div className="space-y-6">
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-xs font-semibold flex items-center space-x-2 animate-shake">
          <XCircle className="h-4 w-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}
      {/* Control Panel (Search & Status Tabs) */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Cari kode booking, nama, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition text-stone-900"
          />
        </div>
        {/* Status Filters */}
        <div className="flex space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 text-xs">
          {["Semua", "PENDING", "APPROVED", "REJECTED", "COMPLETED", "CANCELLED"].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-2 rounded-full font-bold transition shrink-0 cursor-pointer ${
                statusFilter.toUpperCase() === status.toUpperCase()
                  ? "bg-stone-900 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      {/* Bookings Display Stack */}
      <div className="space-y-4">
        {filteredBookings.map(b => {
          let preorderArray = [];
          let preorderTotal = 0;
          try {
            preorderArray = JSON.parse(b.preorderItems || "[]");
            preorderTotal = preorderArray.reduce((sum: number, i: any) => sum + i.price * i.qty, 0);
          } catch {}
          const upperStatus = b.status.toUpperCase();
          return (
            <div 
              key={b.id} 
              className="bg-white rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition overflow-hidden grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Left summary info (Code, Name, Schedule) */}
              <div className="lg:col-span-8 p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-stone-400 font-bold text-xs uppercase tracking-wider block">KODE:</span>
                    <span className="font-mono font-black text-amber-900 text-lg leading-none block">{b.bookingCode}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(b.status)}
                    <span className="text-[10px] text-stone-400 font-semibold">
                      {typeof b.createdAt === "string" ? b.createdAt.substring(0, 10) : new Date(b.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs text-stone-600">
                  {/* Customer Block */}
                  <div className="space-y-1">
                    <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px]">Customer:</span>
                    <span className="font-bold text-stone-900 text-sm block">{b.customerName}</span>
                    <span className="text-stone-500 block truncate">{b.customerEmail}</span>
                    <span className="text-stone-500 block">{b.customerPhone || "- no phone -"}</span>
                  </div>
                  {/* Schedule Block */}
                  <div className="space-y-1">
                    <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px]">Jadwal Kunjungan:</span>
                    <span className="font-bold text-stone-900 text-sm block flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1 text-stone-400 shrink-0" />
                      {b.date}
                    </span>
                    <span className="text-stone-500 block flex items-center">
                      <Clock className="h-3.5 w-3.5 mr-1 text-stone-400 shrink-0" />
                      {b.time} WIB
                    </span>
                    <span className="text-stone-500 block flex items-center">
                      <Users className="h-3.5 w-3.5 mr-1 text-stone-400 shrink-0" />
                      {b.guests} Tamu
                    </span>
                  </div>
                  {/* Table block */}
                  <div className="space-y-1">
                    <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px]">Pilihan Meja:</span>
                    <span className="font-extrabold text-amber-800 text-sm block">{b.tableNumber}</span>
                  </div>
                </div>
                {b.notes && (
                  <div className="bg-stone-50/80 p-3.5 rounded-2xl border border-stone-200/40 text-xs">
                    <span className="font-bold text-stone-700 block text-[10px] uppercase tracking-wider mb-0.5">Catatan Customer:</span>
                    <p className="italic text-stone-600 leading-normal">{b.notes}</p>
                  </div>
                )}
              </div>
              {/* Right preorder items and quick actions panel */}
              <div className="lg:col-span-4 bg-stone-50/50 p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-stone-100 flex flex-col justify-between space-y-6">
                
                {/* Preorders display */}
                <div className="text-xs">
                  <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px] mb-2">Item Pre-order:</span>
                  {preorderArray.length > 0 ? (
                    <div className="space-y-1.5 bg-white p-3 rounded-2xl border border-stone-200/60 shadow-xs max-h-32 overflow-y-auto">
                      {preorderArray.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-stone-700">
                          <span className="truncate pr-2">{item.name} ({item.qty}x)</span>
                          <span className="font-semibold shrink-0 text-stone-900">{formatRupiah(item.price * item.qty)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between font-black text-stone-950 pt-1.5 border-t border-stone-100 mt-1.5">
                        <span>Total</span>
                        <span>{formatRupiah(preorderTotal)}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-stone-400 italic">Hanya reservasi meja, tidak ada pre-order makanan/minuman.</p>
                  )}
                </div>
                {/* Status action buttons */}
                <div className="space-y-2 pt-4 border-t border-stone-100/60">
                  <div className="flex gap-2">
                    {/* APPROVE / REJECT BUTTONS FOR PENDING */}
                    {upperStatus === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleAction(b.id, "approve")}
                          disabled={isPending}
                          className="flex-1 inline-flex items-center justify-center py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Setujui
                        </button>
                        <button
                          onClick={() => handleAction(b.id, "reject")}
                          disabled={isPending}
                          className="flex-1 inline-flex items-center justify-center py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-sm transition disabled:opacity-50 cursor-pointer"
                        >
                          <Ban className="h-3.5 w-3.5 mr-1" />
                          Tolak
                        </button>
                      </>
                    )}
                    {/* No "mark as completed" action: Railway has no endpoint for it. */}
                    {(upperStatus === "CONFIRMED" || upperStatus === "APPROVED") && (
                      <span className="flex-1 inline-flex items-center justify-center py-2 text-stone-400 text-[11px] italic">
                        Menunggu kunjungan
                      </span>
                    )}
                  </div>
                  {/* Customer Quick WhatsApp Contact */}
                  {b.customerPhone && (
                    <a
                      href={`https://wa.me/${b.customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Halo Kak ${b.customerName}, kami dari Admin Cafe mengenai Kode Booking: ${b.bookingCode}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex w-full items-center justify-center py-2 bg-green-50 hover:bg-green-100 text-green-700 font-bold border border-green-200 rounded-xl text-xs transition"
                    >
                      <PhoneCall className="h-3.5 w-3.5 mr-1.5" />
                      Hubungi Customer via WA
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {filteredBookings.length === 0 && (
          <div className="bg-white rounded-3xl p-16 border border-stone-200 text-center text-stone-500">
            Tidak ada reservasi ditemukan yang cocok dengan filter pencarian Anda.
          </div>
        )}
      </div>
    </div>
  );
}
