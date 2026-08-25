"use client";

import { useState, useTransition } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { approveBookingAction, rejectBookingAction } from "../../actions";

/**
 * Manual approve/reject by booking ID. This exists because there is no
 * documented endpoint to list all bookings for an admin, but
 * PATCH /admin/bookings/:id/approve and /reject ARE documented and should
 * stay usable - an admin who learns a booking ID some other way (e.g. a
 * customer's WhatsApp confirmation showing "BK-123") can still act on it.
 */
export default function ManualBookingAction() {
  const [bookingId, setBookingId] = useState("");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handle = (type: "approve" | "reject") => {
    const id = parseInt(bookingId.replace(/[^0-9]/g, ""), 10);
    if (isNaN(id)) {
      setResult({ ok: false, message: "Masukkan ID booking yang valid (contoh: 123 dari kode BK-123)." });
      return;
    }
    setResult(null);
    startTransition(async () => {
      const res = type === "approve" ? await approveBookingAction(id) : await rejectBookingAction(id);
      if (res?.error) {
        setResult({ ok: false, message: res.error });
      } else {
        setResult({ ok: true, message: `Booking BK-${id} berhasil ${type === "approve" ? "disetujui" : "ditolak"}.` });
        setBookingId("");
      }
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
      <div>
        <h2 className="text-sm font-bold text-stone-900">Approve / Reject Manual</h2>
        <p className="text-xs text-stone-500 mt-1">
          Masukkan ID booking (angka setelah "BK-", contoh: <span className="font-mono">123</span> dari{" "}
          <span className="font-mono">BK-123</span>) untuk menyetujui atau menolak.
        </p>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <input
          type="text"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          placeholder="Contoh: 123"
          className="px-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition text-stone-900 w-40"
        />
        <button
          type="button"
          disabled={isPending || !bookingId}
          onClick={() => handle("approve")}
          className="inline-flex items-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
        >
          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
          Approve
        </button>
        <button
          type="button"
          disabled={isPending || !bookingId}
          onClick={() => handle("reject")}
          className="inline-flex items-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
        >
          <XCircle className="h-3.5 w-3.5 mr-1.5" />
          Reject
        </button>
      </div>
      {result && (
        <p className={`text-xs font-semibold ${result.ok ? "text-green-700" : "text-red-700"}`}>
          {result.message}
        </p>
      )}
    </div>
  );
}
