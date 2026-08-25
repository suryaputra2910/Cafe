import { getSession } from "../../actions";
import { railwayGetBookings } from "@/lib/railway";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { safeQuery } from "@/db/ensure";
import {
  Calendar,
  Clock,
  PhoneCall,
  History as HistoryIcon,
  Info,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MyBookingsPage() {
  const session = (await getSession())!;

  // Bookings come exclusively from Railway - GET /bookings. There is no
  // local fallback, and no local write-back: this is a read-only view of
  // the backend's data.
  const railwayBookings = await railwayGetBookings(session.accessToken);

  // Fetch cafe phone from local settings for the WhatsApp link (this is
  // local-only cafe content, unrelated to the Railway reservation API).
  const allSettings = await safeQuery(() => db.select().from(settings), []);
  const settingsMap = (allSettings as Array<{ key: string; value: string }>).reduce(
    (acc: Record<string, string>, curr: { key: string; value: string }) => {
      acc[curr.key] = curr.value;
      return acc;
    },
    {} as Record<string, string>
  );
  const cafePhone = settingsMap["cafe_phone"] || "6281234567890";

  const normalizedStatus = (s: string) => (s || "").toUpperCase();
  const activeBookings = railwayBookings.filter((b) =>
    ["PENDING", "APPROVED", "CONFIRMED"].includes(normalizedStatus(b.status))
  );
  const pastBookings = railwayBookings.filter((b) =>
    ["COMPLETED", "REJECTED", "CANCELLED"].includes(normalizedStatus(b.status))
  );

  const generateWaLink = (b: (typeof railwayBookings)[number]) => {
    const tableLabel = b.table ? `Meja ${b.table.number}` : `Meja #${b.tableId}`;
    const message = `Halo CafeReserve! Saya ingin mengonfirmasi ulang reservasi saya:

*KODE BOOKING: BK-${b.id}*
----------------------------------------
- Nama: ${session.name}
- Meja: ${tableLabel}
- Tanggal: ${b.bookingDate}
- Pukul: ${b.startTime} - ${b.endTime} WIB
- Jumlah Tamu: ${b.guestcount} Orang
${b.notes ? `- Catatan: ${b.notes}` : ""}

Terima kasih! Mohon konfirmasi reservasi saya.`;
    return `https://wa.me/${cafePhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Booking & Riwayat Saya</h1>
        <p className="text-sm text-stone-500">Kelola reservasi aktif Anda atau lihat riwayat kunjungan terdahulu.</p>
      </div>

      {/* ACTIVE BOOKINGS */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center">
          <Clock className="mr-2 h-5 w-5 text-amber-800" />
          Booking Aktif ({activeBookings.length})
        </h2>

        {activeBookings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 shadow-xs max-w-xl mx-auto space-y-4">
            <div className="text-stone-300 flex justify-center">
              <Calendar className="h-12 w-12" />
            </div>
            <div>
              <h3 className="font-bold text-stone-800 text-sm">Tidak Ada Booking Aktif</h3>
              <p className="text-xs text-stone-500 mt-1">Anda tidak memiliki reservasi meja yang sedang menunggu konfirmasi atau aktif saat ini.</p>
            </div>
            <Link
              href="/customer/booking"
              className="inline-flex px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl transition"
            >
              Booking Meja Sekarang
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBookings.map((b) => {
              const status = normalizedStatus(b.status);
              const isConfirmed = status === "APPROVED" || status === "CONFIRMED";
              return (
                <div key={b.id} className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
                  {/* Card Header with Status Badge */}
                  <div className="bg-stone-50/50 px-6 py-4 border-b border-stone-100 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">Kode Reservasi</span>
                      <span className="font-mono font-black text-amber-900 text-sm">BK-{b.id}</span>
                    </div>

                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      isConfirmed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                        isConfirmed ? "bg-green-600" : "bg-yellow-500"
                      }`} />
                      {isConfirmed ? "Terkonfirmasi" : "Menunggu Admin"}
                    </span>
                  </div>

                  {/* Details body */}
                  <div className="p-6 space-y-4 text-xs text-stone-600 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-stone-400 block mb-0.5">Meja Cafe:</span>
                        <span className="font-extrabold text-stone-950 text-sm block">
                          {b.table ? `Meja ${b.table.number}` : `#${b.tableId}`}
                        </span>
                      </div>

                      <div>
                        <span className="text-stone-400 block mb-0.5">Jumlah Tamu:</span>
                        <span className="font-extrabold text-stone-950 text-sm block">
                          {b.guestcount} Orang
                        </span>
                      </div>

                      <div>
                        <span className="text-stone-400 block mb-0.5">Tanggal Kunjungan:</span>
                        <span className="font-bold text-stone-900 block">{b.bookingDate}</span>
                      </div>

                      <div>
                        <span className="text-stone-400 block mb-0.5">Jam Kedatangan:</span>
                        <span className="font-bold text-stone-900 block">{b.startTime} - {b.endTime} WIB</span>
                      </div>
                    </div>

                    {b.notes && (
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/50">
                        <span className="font-bold block text-stone-700 text-[10px] mb-0.5 uppercase tracking-wider">Catatan:</span>
                        <p className="italic leading-normal text-stone-600">{b.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="bg-stone-50/50 px-6 py-4 border-t border-stone-100 flex flex-wrap gap-2 justify-between items-center">
                    {/* Self-service cancellation isn't offered - the Railway API has no
                        endpoint for a customer to cancel their own booking. Point people
                        to a manual channel instead of a button that can't really work. */}
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-500 italic">
                      <Info className="h-3.5 w-3.5" />
                      Perlu batal? Hubungi cafe via WhatsApp.
                    </span>

                    <a
                      href={generateWaLink(b)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                    >
                      <PhoneCall className="mr-1.5 h-3.5 w-3.5" />
                      Hubungi via WA
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* PAST BOOKINGS */}
      <section className="space-y-4 pt-4 border-t border-stone-200">
        <h2 className="text-lg font-bold text-stone-900 flex items-center">
          <HistoryIcon className="mr-2 h-5 w-5 text-stone-600" />
          Riwayat Booking ({pastBookings.length})
        </h2>

        {pastBookings.length === 0 ? (
          <p className="text-xs text-stone-500 italic">Belum ada riwayat reservasi selesai atau batal.</p>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
            {pastBookings.map((b) => {
              const status = normalizedStatus(b.status);
              const isRejectedOrCancelled = status === "REJECTED" || status === "CANCELLED";
              return (
                <div key={b.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-stone-50/30 transition">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-mono font-bold text-stone-700">BK-{b.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isRejectedOrCancelled ? "bg-red-100 text-red-900" : "bg-stone-200 text-stone-800"
                      }`}>
                        {status === "REJECTED" ? "Ditolak" : status === "CANCELLED" ? "Batal" : "Selesai"}
                      </span>
                    </div>

                    <div className="text-xs text-stone-500 space-x-4">
                      <span><strong>Meja:</strong> {b.table ? `Meja ${b.table.number}` : `#${b.tableId}`}</span>
                      <span><strong>Tanggal:</strong> {b.bookingDate} &bull; {b.startTime}</span>
                      <span><strong>Tamu:</strong> {b.guestcount} orang</span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-400">
                    Dibuat pada {new Date(b.createdAt).toLocaleDateString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
