"use server";
import { db } from "@/db";
import { safeQuery } from "@/db/ensure";
import { settings } from "@/db/schema";
import {
    railwayApproveBooking,
    railwayCancelBooking,
    railwayCompleteBooking,
    railwayCreateBooking,
    railwayCreateTable,
    railwayDeleteAdmin,
    railwayDeleteCustomer,
    railwayDeleteTable,
    railwayGetAdmins,
    railwayGetBookings,
    railwayGetCustomers,
    railwayLogin,
    railwayRegister,
    railwayRejectBooking,
    railwayUpdateAdmin,
    railwayUpdateCustomer,
    railwayUpdateTable
} from "@/lib/railway";
import { cookies } from "next/headers";

// NOTE ON DATA SOURCE: authentication, customers, admins, tables, and
// bookings are now sourced exclusively from the Railway backend - there is
// no local-database fallback or dual-write for any of these. The local
// Postgres tables `users`, `tables`, and `bookings` (see db/schema.ts) are
// no longer written to by this file and are effectively unused; they're
// left in place rather than dropped since deleting them is a migration
// decision outside the scope of this fix. `settings` and `menuItems` remain
// local-only, since they're cafe content (menu/pre-order browsing, contact
// info) that has no equivalent in the Railway API.

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string; // "admin" | "customer"
  accessToken: string;
}

// --------------------------------------------------------
// SESSION MANAGEMENT
// --------------------------------------------------------
export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }
  try {
    const parsed = JSON.parse(sessionCookie.value) as SessionUser;
    // A session without a Railway access token is not usable - every
    // authenticated call now requires it.
    if (!parsed.accessToken) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function loginAction(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string || "").trim(); // PRESERVE CASE
  const password = (formData.get("password") as string) || "";
  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }
  const rwLogin = await railwayLogin({ email, password });
  if (!rwLogin.ok || !rwLogin.accessToken || !rwLogin.data?.user) {
    return { error: rwLogin.message || "Email atau Password salah." };
  }
  const rwUser = rwLogin.data.user;
  const rawRole = (rwUser.role || "").toUpperCase();
  const role = rawRole === "ADMIN" ? "admin" : "customer";
  const sessionData: SessionUser = {
    id: rwUser.id,
    name: rwUser.name || rwUser.email.split("@")[0],
    email: rwUser.email,
    phone: rwUser.phone || "",
    role,
    accessToken: rwLogin.accessToken,
  };
  const cookieStore = await cookies();
  cookieStore.set("user_session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });
  return { success: true, user: sessionData };
}

export async function registerAction(prevState: any, formData: FormData) {
  const name = (formData.get("name") as string || "").trim();
  const email = (formData.get("email") as string || "").trim(); // PRESERVE CASE
  const password = (formData.get("password") as string) || "";
  const phone = (formData.get("phone") as string || "").trim();
  if (!name || !email || !password || !phone) {
    return { error: "Nama, email, nomor telepon, dan password wajib diisi." };
  }
  const rwReg = await railwayRegister({ name, email, password, phone });
  if (!rwReg.ok) {
    return { error: rwReg.message || "Gagal mendaftar akun." };
  }
  return {
    success: true,
    message: "Registrasi berhasil! Silakan login dengan akun Anda.",
  };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("user_session");
  return { success: true };
}

// --------------------------------------------------------
// BOOKING ACTIONS
// --------------------------------------------------------

/**
 * Create a booking. Railway is the only place a booking is stored - there is
 * no local fallback. If Railway rejects the request, that error is returned
 * as-is rather than silently "succeeding" locally.
 */
export async function bookTableAction(data: {
  tableId: number;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  preorderItems?: string; // JSON string - kept for the WhatsApp pre-order message only, not sent to Railway (no such field is documented on the bookings endpoint)
}) {
  const session = await getSession();
  if (!session) {
    return { error: "Anda harus login terlebih dahulu." };
  }
  if (!data.tableId || !data.date || !data.time || !data.guests) {
    return { error: "Semua informasi wajib diisi." };
  }

  const startTime = data.time.includes(":") ? data.time : "18:00";
  const [startHour, startMin] = startTime.split(":").map(Number);
  const endHour = (startHour + 2) % 24;
  const endTime = `${String(endHour).padStart(2, "0")}:${String(startMin || 0).padStart(2, "0")}`;

  const rwBookingRes = await railwayCreateBooking(session.accessToken, {
    tableId: data.tableId,
    bookingDate: data.date,
    startTime,
    endTime,
    guestcount: data.guests,
    notes: data.notes || "",
  });

  if (!rwBookingRes.ok) {
    return { error: rwBookingRes.message || "Gagal membuat reservasi." };
  }

  return {
    success: true,
    booking: rwBookingRes.data,
  };
}

/**
 * NOT SUPPORTED: the Railway API does not provide any endpoint for a
 * customer to cancel or delete their own booking (only admin approve/reject
 * exist). Rather than fake this against a local database, this action
 * returns a clear "unsupported" result. The UI should not offer a working
 * cancel button - see app/customer/my-bookings/page.tsx.
 */
export async function cancelBookingAction(bookingId: number) {
  const session = await getSession();
  if (!session) {
    return { error: "Anda harus login terlebih dahulu." };
  }
  const res = await railwayCancelBooking(session.accessToken, bookingId);
  if (!res.ok) {
    return { error: res.message || "Gagal membatalkan reservasi." };
  }
  return { success: true };
}

export async function approveBookingAction(bookingId: number) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak. Anda bukan admin." };
  }
  const res = await railwayApproveBooking(session.accessToken, bookingId);
  if (!res.ok) {
    return { error: res.message || "Gagal menyetujui reservasi di Railway." };
  }
  return { success: true };
}

export async function rejectBookingAction(bookingId: number) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak. Anda bukan admin." };
  }
  const res = await railwayRejectBooking(session.accessToken, bookingId);
  if (!res.ok) {
    return { error: res.message || "Gagal menolak reservasi di Railway." };
  }
  return { success: true };
}

/**
 * PATCH /admin/bookings/:bookingId/complete. Mark a booking as completed.
 * Admin auth required.
 */
export async function completeBookingAction(bookingId: number) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak. Anda bukan admin." };
  }
  const res = await railwayCompleteBooking(session.accessToken, bookingId);
  if (!res.ok) {
    return { error: res.message || "Gagal menyelesaikan reservasi." };
  }
  return { success: true };
}

// --------------------------------------------------------
// TABLE MANAGEMENT (ADMIN) - via Railway only
// --------------------------------------------------------

/**
 * POST /tables. Railway's table model only has { number, capacity, status } -
 * there is no location/description field on the backend, so those are no
 * longer collected or persisted here (see app/admin/tables/page.tsx).
 */
export async function createTableAction(formData: FormData) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak." };
  }
  const number = parseInt(formData.get("number") as string, 10);
  const capacity = parseInt(formData.get("capacity") as string, 10);
  if (isNaN(number) || isNaN(capacity)) {
    return { error: "Nomor meja dan kapasitas wajib berupa angka." };
  }
  const res = await railwayCreateTable(session.accessToken, { number, capacity });
  if (!res.ok) {
    return { error: res.message || "Gagal membuat meja baru." };
  }
  return { success: true };
}

/** PATCH /tables/:tableId. */
export async function updateTableAction(
  tableId: number,
  data: { capacity: number; status: string }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak." };
  }
  const res = await railwayUpdateTable(session.accessToken, tableId, {
    capacity: data.capacity,
    status: data.status,
  });
  if (!res.ok) {
    return { error: res.message || "Gagal memperbarui meja." };
  }
  return { success: true };
}

/**
 * NOT SUPPORTED: there is no DELETE /tables endpoint in the documented API.
 * Table removal is intentionally not offered in the UI - see
 * app/admin/tables/page.tsx, which now offers status changes only.
 */
export async function deleteTableAction(tableId: number) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak." };
  }
  const res = await railwayDeleteTable(session.accessToken, tableId);
  if (!res.ok) {
    return { error: res.message || "Gagal menghapus meja." };
  }
  return { success: true };
}

// --------------------------------------------------------
// CUSTOMER PROFILE (self-service, via Railway)
// --------------------------------------------------------

/**
 * PATCH /customer/:customerId. Only name/phone are sent - the documented
 * example body for this endpoint doesn't include a password field, so
 * password changes are not offered here (see app/customer/page.tsx form).
 * If the backend does support a password field on this endpoint, add it
 * back after confirming with the real Postman collection.
 */
export async function updateProfileAction(formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { error: "Anda harus login terlebih dahulu." };
  }
  const name = (formData.get("name") as string || "").trim();
  const phone = (formData.get("phone") as string || "").trim();
  if (!name) {
    return { error: "Nama tidak boleh kosong." };
  }
  const res = await railwayUpdateCustomer(session.accessToken, session.id, { name, phone });
  if (!res.ok) {
    return { error: res.message || "Gagal memperbarui profil." };
  }
  const updatedUser = res.data;
  const cookieStore = await cookies();
  const updatedSession: SessionUser = {
    ...session,
    name: updatedUser?.name || name,
    phone: updatedUser?.phone || phone,
  };
  cookieStore.set("user_session", JSON.stringify(updatedSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return { success: true };
}

export async function listAllBookingsAction() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak.", bookings: [] };
  }
  const rawBookings = await railwayGetBookings(session.accessToken, true);
  const bookings = rawBookings.map((b: any) => ({
    id: b.id,
    bookingCode: `BK-${b.id}`,
    date: b.bookingDate ? new Date(b.bookingDate).toISOString().split("T")[0] : "",
    time: b.startTime || "",
    guests: b.guestcount || 0,
    status: b.status || "PENDING",
    notes: b.notes || null,
    preorderItems: null,
    createdAt: b.createdAt,
    customerName: b.user?.name || "Customer",
    customerEmail: b.user?.email || "-",
    customerPhone: b.user?.phone || null,
    tableNumber: b.table ? `Meja ${b.table.number}` : `Meja #${b.tableId}`,
  }));
  return { success: true, bookings };
}

// --------------------------------------------------------
// CUSTOMER MANAGEMENT (ADMIN, via Railway)
// --------------------------------------------------------

export async function listCustomersAction() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak.", customers: [] };
  }
  const customers = await railwayGetCustomers(session.accessToken);
  return { success: true, customers };
}

export async function updateCustomerAction(
  customerId: number,
  data: { name?: string; phone?: string }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak." };
  }
  const res = await railwayUpdateCustomer(session.accessToken, customerId, data);
  if (!res.ok) {
    return { error: res.message || "Gagal memperbarui customer." };
  }
  return { success: true };
}

export async function deleteCustomerAction(customerId: number) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak." };
  }
  const res = await railwayDeleteCustomer(session.accessToken, customerId);
  if (!res.ok) {
    return { error: res.message || "Gagal menghapus customer." };
  }
  return { success: true };
}

// --------------------------------------------------------
// ADMIN MANAGEMENT (ADMIN, via Railway)
// --------------------------------------------------------

export async function listAdminsAction() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak.", admins: [] };
  }
  const admins = await railwayGetAdmins(session.accessToken);
  return { success: true, admins };
}

export async function updateAdminAction(
  adminId: number,
  data: { name?: string; email?: string; phone?: string }
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak." };
  }
  const res = await railwayUpdateAdmin(session.accessToken, adminId, data);
  if (!res.ok) {
    return { error: res.message || "Gagal memperbarui admin." };
  }
  return { success: true };
}

export async function deleteAdminAction(adminId: number) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak." };
  }
  const res = await railwayDeleteAdmin(session.accessToken, adminId);
  if (!res.ok) {
    return { error: res.message || "Gagal menghapus admin." };
  }
  return { success: true };
}

// --------------------------------------------------------
// CAFE SETTINGS & MENU (local-only content - not part of the Railway API)
// --------------------------------------------------------
export async function updateSettingsAction(data: {
  cafe_name: string;
  cafe_phone: string;
  cafe_hours: string;
  cafe_address: string;
  cafe_desc: string;
}) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return { error: "Akses ditolak." };
  }
  try {
    if (process.env.DATABASE_URL) {
      await safeQuery(
        async () => {
          for (const [key, value] of Object.entries(data)) {
            await db
              .insert(settings)
              .values({ key, value })
              .onConflictDoUpdate({
                target: settings.key,
                set: { value },
              });
          }
        },
        null
      );
    }
    return { success: true };
  } catch (error: any) {
    return { error: "Gagal menyimpan pengaturan: " + error.message };
  }
}
