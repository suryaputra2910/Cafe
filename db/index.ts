/**
 * Database connection module with resilient fallback
 */

const DEFAULT_SETTINGS = [
  { id: 1, key: "cafe_name", value: "CafeReserve & Roastery" },
  { id: 2, key: "cafe_phone", value: "6283857642962" },
  { id: 3, key: "cafe_hours", value: "Setiap Hari (09:00 - 23:00)" },
  { id: 4, key: "cafe_address", value: "Jl. Senopati Raya No. 12, Kebayoran Baru, Jakarta Selatan" },
  { id: 5, key: "cafe_desc", value: "Kafe modern dengan konsep nyaman yang menyajikan biji kopi pilihan terbaik." },
];

const DEFAULT_TABLES = [
  { id: 1, number: "Meja 01", capacity: 2, location: "Indoor", status: "available", description: "Dekat jendela, AC dingin" },
  { id: 2, number: "Meja 02", capacity: 4, location: "Indoor", status: "available", description: "Tengah ruangan, dekat panggung musik" },
  { id: 3, number: "Meja 03", capacity: 4, location: "Indoor", status: "available", description: "Dekat dengan barista bar" },
  { id: 4, number: "Meja 04", capacity: 2, location: "Outdoor", status: "available", description: "Area taman luar, asri dan sejuk" },
  { id: 5, number: "Meja 05", capacity: 6, location: "Outdoor", status: "available", description: "Meja bundar kayu besar, area outdoor" },
  { id: 6, number: "Meja VIP 1", capacity: 8, location: "VIP Room", status: "available", description: "Ruangan privat, ber-AC, TV, & Karaoke" },
  { id: 7, number: "Meja VIP 2", capacity: 10, location: "VIP Room", status: "available", description: "Ruangan privat besar untuk meeting/keluarga" },
  { id: 8, number: "Meja Rooftop 1", capacity: 2, location: "Rooftop", status: "available", description: "Pemandangan sunset kota yang indah" },
  { id: 9, number: "Meja Rooftop 2", capacity: 4, location: "Rooftop", status: "available", description: "Sudut rooftop romantis dengan lampu gantung" },
];

const DEFAULT_MENU = [
  { id: 1, name: "Espresso Single", category: "Minuman", price: 18000, description: "Ekstrak kopi murni 100% Arabika", image: "☕", isAvailable: true },
  { id: 2, name: "Kopi Susu Gula Aren", category: "Minuman", price: 23000, description: "Espresso blend, susu segar, dan sirup gula aren premium", image: "🥤", isAvailable: true },
  { id: 3, name: "Matcha Latte Creamy", category: "Minuman", price: 25000, description: "Bubuk matcha Jepang murni dengan susu hangat/dingin", image: "🍵", isAvailable: true },
  { id: 4, name: "Nasi Goreng Spesial Cafe", category: "Makanan", price: 35000, description: "Nasi goreng dengan bumbu rahasia, telur mata sapi, ayam suwir", image: "🍛", isAvailable: true },
  { id: 5, name: "Fettuccine Carbonara", category: "Makanan", price: 38000, description: "Pasta krim creamy dengan taburan keju parmesan", image: "🍝", isAvailable: true },
  { id: 6, name: "Ayam Bakar Madu Kecap", category: "Makanan", price: 42000, description: "Ayam empuk yang dibakar dengan olesan madu manis gurih", image: "🍗", isAvailable: true },
  { id: 7, name: "French Fries Crispy", category: "Cemilan", price: 18000, description: "Kentang goreng renyah dengan bumbu bawang putih", image: "🍟", isAvailable: true },
  { id: 8, name: "Croissant Almond Butter", category: "Cemilan", price: 22000, description: "Croissant renyah berlapis dengan taburan kacang almond panggang", image: "🥐", isAvailable: true },
  { id: 9, name: "Pisang Goreng Keju Cokelat", category: "Cemilan", price: 20000, description: "Pisang manis digoreng krispi dengan limpahan keju parut", image: "🍌", isAvailable: true },
];

const DEFAULT_USERS = [
  { id: 1, name: "Admin Cafe", email: "admin@cafereserve.com", password: "admin", phone: "081234567890", role: "admin" },
  { id: 2, name: "Budi Santoso", email: "customer@gmail.com", password: "customer", phone: "089876543210", role: "customer" },
];

function getTableName(tableObj: any): string {
  if (!tableObj) return "";
  if (typeof tableObj === "string") return tableObj;
  return String(
    tableObj[Symbol.for("drizzle:BaseName")] ||
    tableObj[Symbol.for("drizzle:Name")] ||
    tableObj[Symbol.for("drizzle:OriginalName")] ||
    tableObj.table?.[Symbol.for("drizzle:Name")] ||
    tableObj._?.name ||
    tableObj.name ||
    tableObj.tableName ||
    ""
  );
}

function createMockQuery(defaultData: any = []): any {
  const handler: ProxyHandler<any> = {
    get(target, prop) {
      if (prop === "then") {
        return (resolve: any) => resolve(defaultData);
      }
      if (prop === "catch") {
        return () => Promise.resolve(defaultData);
      }
      return (...args: any[]) => {
        if ((prop === "from" || prop === "innerJoin" || prop === "leftJoin") && args[0]) {
          const name = getTableName(args[0]);
          if (name.includes("setting")) return createMockQuery(DEFAULT_SETTINGS);
          if (name.includes("table")) return createMockQuery(DEFAULT_TABLES);
          if (name.includes("menu")) return createMockQuery(DEFAULT_MENU);
          if (name.includes("user")) return createMockQuery(DEFAULT_USERS);
          if (name.includes("booking")) {
            // If innerJoin with tables, enrich default mock bookings
            return createMockQuery([]);
          }
        }
        if (prop === "values" && args[0]) {
          const item = Array.isArray(args[0]) ? args[0] : [{ id: 1, ...args[0] }];
          return createMockQuery(item);
        }
        if (prop === "returning") {
          return createMockQuery(defaultData);
        }
        return createMockQuery(defaultData);
      };
    },
    apply() {
      return createMockQuery(defaultData);
    },
  };
  return new Proxy(() => {}, handler);
}

const mockDatabase = {
  select: () => createMockQuery([]),
  insert: () => createMockQuery([]),
  update: () => createMockQuery([]),
  delete: () => createMockQuery([]),
  execute: () => Promise.resolve([]),
};

let dbInstance: any = null;

const initializeDb = async () => {
  if (dbInstance) {
    return dbInstance;
  }
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return mockDatabase;
  }
  try {
    const { drizzle } = await import("drizzle-orm/node-postgres");
    // @ts-expect-error The runtime package is available, but has no declarations.
    const { Pool } = await import("pg");
    const pool = new Pool({
      connectionString: databaseUrl,
    });
    dbInstance = drizzle(pool);
    return dbInstance;
  } catch (error) {
    console.warn("Database initialization error, using fallback:", error);
    return mockDatabase;
  }
};

// Export a getter function instead of direct instance
export const getDb = async () => {
  return initializeDb();
};

// For backward compatibility, create a proxy that delegates directly to Drizzle or mock DB
export const db = new Proxy(
  {},
  {
    get: (target, prop) => {
      if (prop === "then") return undefined;
      return (...args: any[]) => {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
          return (mockDatabase as any)[prop](...args);
        }
        if (dbInstance) {
          return dbInstance[prop](...args);
        }
        initializeDb();
        return (mockDatabase as any)[prop](...args);
      };
    },
  }
) as any;