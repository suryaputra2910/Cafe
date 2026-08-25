import { getSession } from "../../actions";
import AdminNav from "@/components/AdminNav";
import BookingsAdminClient, { BookingItem } from "./BookingsAdminClient";
import ManualBookingAction from "./ManualBookingAction";
import { AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ManageBookingsPage() {
  const session = await getSession();

  // IMPORTANT: there is no documented endpoint for an admin to list every
  // booking across all customers - the project's spec/Postman summary only
  // documents POST /bookings, GET /bookings (the caller's own bookings),
  // and PATCH /admin/bookings/:id/approve|reject. There is no
  // GET /admin/bookings. Rather than call an undocumented/unverified URL
  // and risk showing wrong or misleading data, this page is honest about
  // the gap: it cannot list bookings, but approve/reject still work if a
  // booking ID is known some other way (e.g. from a WhatsApp confirmation).
  const results: BookingItem[] = [];

  return (
    <div className="space-y-6">
      <AdminNav active="/admin/bookings" />
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Kelola Booking</h1>
        <p className="text-sm text-stone-500">
          Konfirmasi reservasi masuk, setujui/tolak booking, atau lihat rincian pesanan.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 space-y-1">
          <p className="font-bold">Daftar booking tidak dapat ditampilkan otomatis.</p>
          <p>
            API Railway yang didokumentasikan tidak menyediakan endpoint untuk admin melihat
            seluruh booking (tidak ada <code className="font-mono bg-amber-100 px-1 rounded">GET /admin/bookings</code> pada
            Postman collection/spesifikasi yang diberikan - yang tersedia hanya{" "}
            <code className="font-mono bg-amber-100 px-1 rounded">PATCH /admin/bookings/:id/approve</code> dan{" "}
            <code className="font-mono bg-amber-100 px-1 rounded">/reject</code>).
            Mohon konfirmasi ke tim backend apakah endpoint listing booking untuk admin memang belum ada,
            atau tersedia dengan path lain yang belum didokumentasikan.
          </p>
        </div>
      </div>

      <ManualBookingAction />

      <BookingsAdminClient initialBookings={results} />
    </div>
  );
}
