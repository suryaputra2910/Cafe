import { pgTable, serial, text, integer, timestamp, boolean, date } from "drizzle-orm/pg-core";

// Users Table (Customers and Admins)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("customer"), // 'customer' or 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tables (Meja Cafe)
export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  number: text("number").notNull().unique(), // e.g., 'Meja 01', 'Meja VIP 1'
  capacity: integer("capacity").notNull(), // e.g., 2, 4, 6, 8 people
  location: text("location").notNull().default("Indoor"), // Indoor, Outdoor, VIP, Rooftop
  status: text("status").notNull().default("available"), // available, occupied, maintenance
  description: text("description"), // Description of table view or specific features
});

// Bookings (Reservations)
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  tableId: integer("table_id")
    .references(() => tables.id, { onDelete: "cascade" })
    .notNull(),
  bookingCode: text("booking_code").notNull().unique(), // e.g., CR-10293
  date: text("date").notNull(), // 'YYYY-MM-DD'
  time: text("time").notNull(), // e.g. '12:00', '18:00'
  guests: integer("guests").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, completed
  preorderItems: text("preorder_items"), // JSON representation of pre-ordered items: [{itemId: 1, name: 'Kopi', qty: 2, price: 15000}]
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// App Settings
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
});
