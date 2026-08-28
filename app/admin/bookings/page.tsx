import { getSession, listAllBookingsAction } from "../../actions";
import AdminNav from "@/components/AdminNav";
import BookingsAdminClient, { BookingItem } from "./BookingsAdminClient";
import ManualBookingAction from "./ManualBookingAction";

export const dynamic = "force-dynamic";

export default async function ManageBookingsPage() {
  const session = await getSession();
  const result = await listAllBookingsAction();
  const results: BookingItem[] = result.bookings || [];

  return (
    <div className="space-y-8">
      <AdminNav active="/admin/bookings" />

      {/* Header Banner */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-semibold mb-2 uppercase tracking-wider">
            Sistem Reservasi
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Kelola Reservasi & Booking
          </h1>
          <p className="text-stone-300 text-sm mt-1 max-w-xl">
            Konfirmasi reservasi pelanggan, setujui atau tolak status booking secara real-time.
          </p>
        </div>

        <div className="relative z-10 bg-stone-800/80 border border-stone-700/60 rounded-2xl px-5 py-3 text-right">
          <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">Total Reservasi</span>
          <span className="text-2xl font-black text-amber-400">{results.length}</span>
        </div>
      </div>

      {/* Action manual & Client list */}
      <div className="space-y-6">
        <ManualBookingAction />
        <BookingsAdminClient initialBookings={results} />
      </div>
    </div>
  );
}
