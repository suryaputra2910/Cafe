"use client";

import {
    Calendar,
    Check,
    CheckCircle2,
    ChevronRight,
    Info,
    PhoneCall,
    Users,
    Utensils
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { bookTableAction } from "../../actions";

interface Table {
  id: number;
  number: string;
  capacity: number;
  location: string;
  status: string;
  description: string | null;
}

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string | null;
  description: string | null;
  isAvailable: boolean;
}

interface BookingFormClientProps {
  tables: Table[];
  menus: MenuItem[];
  cafePhone: string;
  userName: string;
}

export default function BookingFormClient({ tables, menus, cafePhone, userName }: BookingFormClientProps) {
  const router = useRouter();
  
  // Step 1 or Step 2 (Success) - removed menu selection step
  const [step, setStep] = useState<1 | 2>(1);

  // Form Fields
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("12:00");
  const [guests, setGuests] = useState(2);
  const [notes, setNotes] = useState("");

  // Submitting States
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successBookingCode, setSuccessBookingCode] = useState<string | null>(null);

  // Track conflicting bookings to update UI availability
  const [conflictingBookings, setConflictingBookings] = useState<{tableId: number, date: string, time: string}[]>([]);

  // Get selected table object
  const selectedTable = tables.find(t => t.id === selectedTableId);

  // Format helper for Rupiah
  const formatRupiah = (num: number) => {
    return "Rp " + num.toLocaleString("id-ID");
  };

  const handleNextToStep2 = () => {
    setError(null);
    if (!selectedTableId) {
      setError("Silakan pilih meja terlebih dahulu.");
      return;
    }
    if (!date) {
      setError("Silakan tentukan tanggal kunjungan.");
      return;
    }
    if (!time) {
      setError("Silakan tentukan jam kunjungan.");
      return;
    }
    if (selectedTable && guests > selectedTable.capacity) {
      setError(`Kapasitas ${selectedTable.number} maksimal ${selectedTable.capacity} orang.`);
      return;
    }
    // Directly submit instead of going to Step 2
    handleFinalSubmit();
  };

  const handleBackToStep1 = () => {
    setStep(1);
  };

  const handleFinalSubmit = async () => {
    setIsPending(true);
    setError(null);

    // No preorder items, just empty array
    const formattedPreorders: Array<{ itemId: number; name: string; qty: number; price: number }> = [];

    try {
      const res = await bookTableAction({
        tableId: selectedTableId!,
        date,
        time,
        guests,
        notes,
        preorderItems: JSON.stringify(formattedPreorders)
      });

      if (res.error) {
        if (res.error.toLowerCase().includes("sudah di booking") || res.error.toLowerCase().includes("sudah dipesan") || res.error.toLowerCase().includes("conflict")) {
          setError("Meja ini sudah dipesan pada waktu tersebut. Silakan pilih meja atau waktu lain.");
          setConflictingBookings(prev => [...prev, { tableId: selectedTableId!, date, time }]);
        } else {
          setError(res.error);
        }
        setIsPending(false);
      } else if (res.success && res.booking) {
        // Railway's booking response has an `id`, not a `bookingCode` - build
        // a readable reference code from the real id instead of inventing one.
        setSuccessBookingCode(`BK-${res.booking.id}`);
        setStep(2);
        setIsPending(false);
      }
    } catch (err: any) {
      setError("Terjadi kesalahan sistem: " + err.message);
      setIsPending(false);
    }
  };

  // Generate WhatsApp link
  const getWhatsAppLink = () => {
    if (!successBookingCode || !selectedTable) return "#";

    const message = `Halo CafeReserve! Saya ingin mengonfirmasi reservasi saya:

*KODE BOOKING: ${successBookingCode}*
----------------------------------------
- Nama: ${userName}
- Meja: ${selectedTable.number}
- Tanggal: ${date}
- Pukul: ${time}
- Jumlah Tamu: ${guests} Orang
- Catatan Khusus: ${notes || "-"}

Terima kasih! Mohon konfirmasi reservasi saya.`;

    return `https://wa.me/${cafePhone}?text=${encodeURIComponent(message)}`;
  };

  // Railway's table model has no location field, so tables are shown
  // unfiltered (the old location-pill filter was based on fabricated data).
  const filteredTables = tables;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* STEPS INDICATOR */}
      <div className="lg:col-span-12 bg-white rounded-2xl p-4 border border-stone-200 flex justify-between items-center text-xs sm:text-sm">
        <div className="flex items-center space-x-2">
          <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold ${step >= 1 ? "bg-amber-800 text-white" : "bg-stone-200 text-stone-600"}`}>1</span>
          <span className={`font-bold ${step === 1 ? "text-amber-800" : "text-stone-500"}`}>Meja & Waktu</span>
        </div>
        <div className="h-0.5 bg-stone-200 flex-1 mx-4"></div>
        <div className="flex items-center space-x-2">
          <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold ${step >= 2 ? "bg-green-600 text-white" : "bg-stone-200 text-stone-600"}`}>2</span>
          <span className={`font-bold ${step === 2 ? "text-green-600" : "text-stone-500"}`}>Konfirmasi WhatsApp</span>
        </div>
      </div>

      {error && (
        <div className="lg:col-span-12 bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 text-xs font-semibold flex items-center space-x-2">
          <Info className="h-4 w-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: SELECT TABLE & SCHEDULE */}
      {step === 1 && (
        <>
          {/* Main Form Fields */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-stone-900 flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-amber-800" />
              1. Atur Jadwal & Jumlah Tamu
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Tanggal Kunjungan</label>
                <input 
                  type="date" 
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-stone-900" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Jam Kedatangan</label>
                <select 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-stone-900 bg-white"
                >
                  {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"].map(t => (
                    <option key={t} value={t}>{t} WIB</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase mb-2">Jumlah Tamu (Orang)</label>
                <div className="flex items-center border border-stone-200 rounded-xl overflow-hidden">
                  <button 
                    type="button" 
                    onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                    className="p-2.5 bg-stone-50 hover:bg-stone-100 transition text-stone-600 font-bold px-4"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-sm text-stone-900">{guests}</span>
                  <button 
                    type="button" 
                    onClick={() => setGuests(prev => Math.min(20, prev + 1))}
                    className="p-2.5 bg-stone-50 hover:bg-stone-100 transition text-stone-600 font-bold px-4"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-stone-900 flex items-center">
                  <Utensils className="mr-2 h-5 w-5 text-amber-800" />
                  2. Pilih Posisi Meja Cafe
                </h2>
              </div>

              {/* Tables Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredTables.map(t => {
                  const isSelected = selectedTableId === t.id;
                  const isOverCapacity = guests > t.capacity;
                  const isConflict = conflictingBookings.some(cb => cb.tableId === t.id && cb.date === date && cb.time === time);
                  const isAvailable = !isConflict;

                  return (
                    <button
                      key={t.id}
                      type="button"
                      disabled={!isAvailable || isOverCapacity}
                      onClick={() => setSelectedTableId(t.id)}
                      className={`text-left p-5 rounded-2xl border transition relative flex flex-col justify-between h-40 group cursor-pointer ${
                        !isAvailable || isOverCapacity
                          ? "bg-stone-100/80 border-stone-200 opacity-60 cursor-not-allowed"
                          : isSelected 
                          ? "border-amber-800 bg-amber-50/20 ring-2 ring-amber-500/50" 
                          : "border-stone-200 hover:border-amber-500/50 bg-white"
                      }`}
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className={`font-black text-lg ${isSelected ? "text-amber-900" : "text-stone-900"}`}>
                            {t.number}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            isAvailable ? "bg-green-100 text-green-900" : "bg-stone-200 text-stone-700"
                          }`}>
                            {isAvailable ? "Tersedia" : "Tidak Tersedia"}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-2 line-clamp-2">
                          {t.description || "Meja makan cafe nyaman estetik."}
                        </p>
                      </div>

                      <div className="border-t border-stone-100 pt-3 flex justify-between items-center text-xs mt-2 w-full">
                        <span className="text-stone-600 font-semibold flex items-center">
                          <Users className="h-3.5 w-3.5 mr-1 text-stone-400" />
                          Maks {t.capacity} Tamu
                        </span>
                        {isOverCapacity && (
                          <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-md">
                            Tamu Melebihi Kapasitas
                          </span>
                        )}
                        {isSelected && (
                          <span className="h-5 w-5 rounded-full bg-amber-800 text-white flex items-center justify-center font-bold">
                            <Check className="h-3 w-3" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {filteredTables.length === 0 && (
                <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-100 text-stone-500 text-sm">
                  Tidak ada meja tersedia dengan kategori lokasi ini.
                </div>
              )}
            </div>
          </div>

          {/* Form Action Summary Sidebar */}
          <div className="lg:col-span-5 bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-white mb-4">Rangkuman Booking</h3>
              
              <div className="space-y-4 text-sm text-stone-300">
                <div className="flex justify-between py-2.5 border-b border-stone-800">
                  <span>Nama Tamu</span>
                  <span className="text-white font-bold">{userName}</span>
                </div>

                <div className="flex justify-between py-2.5 border-b border-stone-800">
                  <span>Tanggal Kunjungan</span>
                  <span className="text-white font-bold">{date || "- belum dipilih -"}</span>
                </div>

                <div className="flex justify-between py-2.5 border-b border-stone-800">
                  <span>Jam Kedatangan</span>
                  <span className="text-white font-bold">{time} WIB</span>
                </div>

                <div className="flex justify-between py-2.5 border-b border-stone-800">
                  <span>Jumlah Tamu</span>
                  <span className="text-white font-bold">{guests} Orang</span>
                </div>

                <div className="flex justify-between py-2.5 border-b border-stone-800">
                  <span>Meja Pilihan</span>
                  <span className="text-amber-400 font-extrabold">{selectedTable ? selectedTable.number : "- belum dipilih -"}</span>
                </div>

                {selectedTable && (
                  <div className="p-3.5 bg-stone-950/50 border border-stone-800 rounded-xl text-xs space-y-1">
                    <span className="block font-bold text-stone-400">Deskripsi Meja:</span>
                    <p className="leading-relaxed text-stone-400">
                      {selectedTable.description || "Meja makan nyaman."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleNextToStep2}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-amber-950 font-black rounded-xl transition text-sm flex items-center justify-center group uppercase tracking-wider shadow-md cursor-pointer"
            >
              <span>Selesaikan & Book Meja</span>
              <ChevronRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition" />
            </button>
          </div>
        </>
      )}

      {/* STEP 2: SUCCESS & SEND TO WHATSAPP */}
      {step === 2 && successBookingCode && (
        <div className="lg:col-span-12 bg-white rounded-3xl p-6 sm:p-12 border border-stone-200 shadow-lg text-center max-w-2xl mx-auto space-y-8 animate-fade-in">
          
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest block">
              Reservasi Berhasil Diajukan!
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 mt-2">
              Kode Booking Anda: <span className="text-amber-800 font-black">{successBookingCode}</span>
            </h2>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-left text-sm space-y-4">
            <h4 className="font-bold text-stone-900 border-b border-stone-200 pb-2">Rincian Reservasi Anda</h4>
            
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
              <div>
                <span className="text-stone-500 block">Nama Customer:</span>
                <span className="font-bold text-stone-800 text-sm">{userName}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Meja:</span>
                <span className="font-bold text-stone-800 text-sm">{selectedTable?.number}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Tanggal Kunjungan:</span>
                <span className="font-bold text-stone-800 text-sm">{date}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Jam Kunjungan:</span>
                <span className="font-bold text-stone-800 text-sm">{time} WIB</span>
              </div>
              <div>
                <span className="text-stone-500 block">Jumlah Tamu:</span>
                <span className="font-bold text-stone-800 text-sm">{guests} Orang</span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-500 block">Catatan Khusus:</span>
                <span className="font-medium text-stone-800">{notes || "-"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 text-xs font-semibold leading-relaxed">
              <strong>LANGKAH SELANJUTNYA:</strong> Untuk mempercepat konfirmasi reservasi Anda, silakan klik tombol di bawah ini untuk mengirimkan detail pemesanan ke WhatsApp resmi kami secara langsung!
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl shadow-md transition text-sm cursor-pointer"
              >
                <PhoneCall className="mr-2 h-4 w-4" />
                Kirim Konfirmasi via WhatsApp
              </a>

              <button
                type="button"
                onClick={() => {
                  router.push("/customer/my-bookings");
                  router.refresh();
                }}
                className="inline-flex items-center justify-center px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-xl text-sm transition"
              >
                Selesai & Lihat Booking Saya
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
