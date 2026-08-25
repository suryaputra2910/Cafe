import { db } from "./index";
import { menuItems, settings } from "./schema";
import { ensureSchema } from "./ensure";

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

    // 1. Seed Menu Items
    const menuCheck = await db.select().from(menuItems);
    if (menuCheck.length === 0) {
      const defaultMenu = [
        { name: "Espresso Single", category: "Minuman", price: 18000, description: "Ekstrak kopi murni 100% Arabika", image: "☕" },
        { name: "Kopi Susu Gula Aren", category: "Minuman", price: 23000, description: "Espresso blend, susu segar, dan sirup gula aren premium", image: "🥤" },
        { name: "Matcha Latte Creamy", category: "Minuman", price: 25000, description: "Bubuk matcha Jepang murni dengan susu hangat/dingin", image: "🍵" },
        { name: "Nasi Goreng Spesial Cafe", category: "Makanan", price: 35000, description: "Nasi goreng dengan bumbu rahasia, telur mata sapi, ayam suwir, dan kerupuk", image: "🍛" },
        { name: "Fettuccine Carbonara", category: "Makanan", price: 38000, description: "Pasta krim creamy dengan taburan keju parmesan dan smoked beef slice", image: "🍝" },
        { name: "Ayam Bakar Madu Kecap", category: "Makanan", price: 42000, description: "Ayam empuk yang dibakar dengan olesan madu manis gurih, nasi hangat, sambal lalap", image: "🍗" },
        { name: "French Fries Crispy", category: "Cemilan", price: 18000, description: "Kentang goreng renyah dengan bumbu bawang putih & saus sambal", image: "🍟" },
        { name: "Croissant Almond Butter", category: "Cemilan", price: 22000, description: "Croissant renyah berlapis dengan taburan kacang almond panggang", image: "🥐" },
        { name: "Pisang Goreng Keju Cokelat", category: "Cemilan", price: 20000, description: "Pisang manis digoreng krispi dengan limpahan keju parut dan meises cokelat", image: "🍌" },
      ];
      await db.insert(menuItems).values(defaultMenu);
      console.log(`✓ Seeded ${defaultMenu.length} menu items.`);
    }

    // 5. Seed App Settings
    const settingsCheck = await db.select().from(settings);
    if (settingsCheck.length === 0) {
      const defaultSettings = [
        { key: "cafe_name", value: "CafeReserve & Roastery" },
        { key: "cafe_phone", value: "6281234567890" }, // WhatsApp format without '+'
        { key: "cafe_hours", value: "Setiap Hari (09:00 - 23:00)" },
        { key: "cafe_address", value: "Jl. Senopati Raya No. 12, Kebayoran Baru, Jakarta Selatan" },
        { key: "cafe_desc", value: "Kafe modern dengan konsep nyaman yang menyajikan biji kopi pilihan terbaik, hidangan lezat, dan ruang kumpul/kerja yang estetik." },
      ];
      await db.insert(settings).values(defaultSettings);
      console.log(`✓ Seeded default app settings.`);
    }

    console.log("Seeding completed successfully.");
    return { success: true, message: "Database seeded successfully" };
  } catch (error) {
    console.error("Error during database seeding:", error);
    return { success: false, error: String(error) };
  }
}
