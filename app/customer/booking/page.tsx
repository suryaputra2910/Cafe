import { db } from "@/db";
import { menuItems, settings } from "@/db/schema";
import { safeQuery } from "@/db/ensure";
import { getSession } from "../../actions";
import { railwayGetTables } from "@/lib/railway";
import BookingFormClient from "./BookingFormClient";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function BookingMejaPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  // Admin should manage bookings from /admin, not customer booking form
  if (session.role === "admin") {
    redirect("/admin/bookings");
  }
  // Tables come exclusively from Railway - GET /tables. There is no local
  // fallback: if Railway is empty or unreachable, that's the true state and
  // we show it as such rather than presenting fabricated tables.
  // NOTE: the Railway table model only has { id, number, capacity, status } -
  // it has no "location" field, so a single neutral label is used instead of
  // guessing a location from the table id (as the previous code did).
  const rwTables = await railwayGetTables(session.accessToken);
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
  // 2. Fetch menus with safeQuery fallback
  const defaultMenus = [
    { id: 1, name: "Espresso Single", category: "Minuman", price: 18000, image: "☕", description: "Ekstrak kopi murni 100% Arabika", isAvailable: true },
    { id: 2, name: "Kopi Susu Gula Aren", category: "Minuman", price: 23000, image: "🥤", description: "Espresso blend, susu segar, & gula aren", isAvailable: true },
    { id: 3, name: "Matcha Latte Creamy", category: "Minuman", price: 25000, image: "🍵", description: "Bubuk matcha Jepang murni dengan susu", isAvailable: true },
    { id: 4, name: "Nasi Goreng Spesial Cafe", category: "Makanan", price: 35000, image: "🍛", description: "Nasi goreng dengan bumbu rahasia", isAvailable: true },
    { id: 5, name: "Fettuccine Carbonara", category: "Makanan", price: 38000, image: "🍝", description: "Pasta krim creamy dengan smoked beef", isAvailable: true },
    { id: 6, name: "Ayam Bakar Madu Kecap", category: "Makanan", price: 42000, image: "🍗", description: "Ayam empuk dibakar madu manis gurih", isAvailable: true },
    { id: 7, name: "French Fries Crispy", category: "Cemilan", price: 18000, image: "🍟", description: "Kentang goreng renyah bumbu bawang garlic", isAvailable: true },
    { id: 8, name: "Croissant Almond Butter", category: "Cemilan", price: 22000, image: "🥐", description: "Croissant renyah berlapis almond panggang", isAvailable: true },
    { id: 9, name: "Pisang Goreng Keju Cokelat", category: "Cemilan", price: 20000, image: "🍌", description: "Pisang manis krispi keju meises", isAvailable: true },
  ];
  const allMenus = process.env.DATABASE_URL
    ? await safeQuery(() => db.select().from(menuItems), defaultMenus)
    : defaultMenus;
  // 3. Fetch Settings with safeQuery fallback
  const emptySettings: Array<{ key: string; value: string }> = [];
  const allSettings = process.env.DATABASE_URL
    ? await safeQuery(() => db.select().from(settings), emptySettings)
    : emptySettings;
  const settingsMap = allSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
  const cafePhone = settingsMap["cafe_phone"] || "6281234567890";
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">Booking Meja & Pre-order</h1>
          <p className="text-sm text-stone-500">Pilih meja favorit Anda dan pesan hidangan lezat langsung ke WhatsApp cafe kami.</p>
        </div>
      </div>
      <BookingFormClient 
        tables={allTables} 
        menus={allMenus} 
        cafePhone={cafePhone} 
        userName={session.name}
      />
    </div>
  );
}