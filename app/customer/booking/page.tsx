import { db } from "@/db";

import { safeQuery } from "@/db/ensure";
import { settings } from "@/db/schema";
import { railwayGetBookings, railwayGetTables } from "@/lib/railway";
import { redirect } from "next/navigation";
import { getSession } from "../../actions";
import BookingFormClient from "./BookingFormClient";
export const dynamic = "force-dynamic";
export default async function BookingMejaPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role === "admin") {
    redirect("/admin/bookings");
  }
  const rwTables = await railwayGetTables(session.accessToken);
  const bookings = await railwayGetBookings(session.accessToken);
  const allTables: Array<{
    id: number;
    number: string;
    capacity: number;
    location: string;
    status: string;
    description: string | null;
  }> = rwTables.map((rwT) => ({
    id: rwT.id,
    number: `Meja ${String(rwT.number).padStart(2, "0")}`,
    capacity: rwT.capacity,
    location: "Cafe",
    status: rwT.status ? rwT.status.toLowerCase() : "available",
    description: `Kapasitas ${rwT.capacity} orang`,

  }));
  // 3. Fetch Settings with safeQuery fallback
  const emptySettings: Array<{ key: string; value: string }> = [];
  const allSettings = process.env.DATABASE_URL
    ? await safeQuery(() => db.select().from(settings), emptySettings)
    : emptySettings;
  const settingsMap = allSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const cafePhone = settingsMap["cafe_phone"] || "6283857642962";
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Booking Meja</h1>
          <p className="text-sm text-stone-500">Pilih meja favorit Anda dan konfirmasi reservasi langsung ke WhatsApp cafe kami.</p>
        </div>
      </div>
      <BookingFormClient 
        tables={allTables}
        bookings={bookings}
        cafePhone={cafePhone}
        userName={session.name}
        menus={[]}
      />
    </div>
  );
}