import { db } from "./index";
import { ensureSchema } from "./ensure";
import { Settings } from "lucide-react";

// NOTE: this used to also seed local `users` and `tables` rows (including a
// plaintext-password demo admin/customer account). Those two tables are no
// longer read anywhere - authentication, customers, and tables are sourced
// exclusively from the Railway API now - so seeding them would just leave
// unused demo credentials sitting in the database for no benefit. Only
// `menuItems` and `settings` are still local-only content (menu browsing /
// cafe info), so only those are seeded.
export async function seedDatabase() {
  console.log("Starting database seeding...");

  try {
    // Make sure every table exists before inserting anything.
    const schemaReady = await ensureSchema();
    if (!schemaReady) {
      return { success: false, error: "Database schema could not be created" };
    }
    // 5. Seed App Settings
    const settingsCheck = await db.select().from(Settings);
    if (settingsCheck.length === 0) {
      const defaultSettings = [
        { key: "cafe_name", value: "CafeReserve & Roastery" },
        { key: "cafe_phone", value: "6283857642962" }, // WhatsApp format without '+'
        { key: "cafe_hours", value: "Setiap Hari (09:00 - 23:00)" },
        { key: "cafe_address", value: "Jl. Senopati Raya No. 12, Kebayoran Baru, Jakarta Selatan" },
        { key: "cafe_desc", value: "Kafe modern dengan konsep nyaman yang menyajikan biji kopi pilihan terbaik, hidangan lezat, dan ruang kumpul/kerja yang estetik." },
      ];
      await db.insert(Settings).values(defaultSettings);
      console.log(`✓ Seeded default app settings.`);
    }

    console.log("Seeding completed successfully.");
    return { success: true, message: "Database seeded successfully" };
  } catch (error) {
    console.error("Error during database seeding:", error);
    return { success: false, error: String(error) };
  }
}
