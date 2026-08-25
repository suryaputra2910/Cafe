// ---------------------------------------------------------------------------
// Railway backend API client.
//
// IMPORTANT: this file must only call endpoints that are actually documented
// in the project's Postman collection / API spec. Do not add new endpoints
// here on assumption - if a feature needs an endpoint that isn't documented,
// leave it unimplemented and surface that clearly to the caller instead of
// guessing at a URL.
//
// Documented endpoints (see project spec section 21):
//   POST   /auth/register
//   POST   /auth/admin
//   POST   /auth/login
//   GET    /customer
//   GET    /customer/:customerId
//   PATCH  /customer/:customerId
//   DELETE /customer/:customerId
//   GET    /admin
//   GET    /admin/:adminId
//   PATCH  /admin/:adminId
//   DELETE /admin/:adminId
//   POST   /tables
//   GET    /tables
//   PATCH  /tables/:tableId
//   POST   /bookings
//   GET    /bookings
//   PATCH  /admin/bookings/:bookingId/approve
//   PATCH  /admin/bookings/:bookingId/reject
//
// NOTE ON ADMIN BOOKING LISTING: there is no documented endpoint for an
// admin to list ALL bookings across customers - only the two approve/reject
// sub-routes under /admin/bookings/:id are documented. See the note on
// railwayGetBookings() below for what this means in practice.
//
// NOT available anywhere in the documented API (confirmed absent):
//   - No endpoint for an admin to list all bookings (GET /admin/bookings is
//     NOT documented - only approve/reject exist under that path).
//   - No endpoint for a customer to cancel/delete their own booking.
//   - No endpoint to mark a booking "completed".
//   - No DELETE endpoint for tables.
//   - No endpoint to change a user's password directly (PATCH /customer/:id
//     example body only shows name/phone).
// Features that would require these must not fabricate a local-only stand-in
// that pretends to talk to the backend - they should be disabled/removed
// from the UI with a clear explanation, which is what this refactor does.
// ---------------------------------------------------------------------------

export const RAILWAY_API_URL =
  process.env.RAILWAY_API_URL || "https://cafereserved-production.up.railway.app";

export interface RailwayUser {
  id: number;
  name?: string;
  email: string;
  phone?: string;
  role: string; // "ADMIN" | "CUSTOMER"
}

export interface RailwayLoginResponse {
  ok: boolean;
  status: number;
  message?: string;
  data?: {
    user: RailwayUser;
  };
  accessToken?: string;
}

export interface RailwayRegisterResponse {
  ok: boolean;
  status: number;
  message?: string;
  data?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: string;
  };
}

export interface RailwayTable {
  id: number;
  number: number;
  capacity: number;
  status: string;
}

export interface RailwayBooking {
  id: number;
  bookingDate: string;
  status: string; // "PENDING" | "APPROVED" | "REJECTED" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  startTime: string;
  endTime: string;
  guestcount: number;
  userId: number;
  tableId: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  table?: RailwayTable;
  user?: RailwayUser;
}

/** Generic envelope returned by the write/mutation-style helpers below. */
export interface RailwayResult<T = any> {
  ok: boolean;
  status: number;
  message?: string;
  data?: T;
}

/** Turns a Railway error payload into a readable, non-raw message. */
function extractErrorMessage(json: any, fallback: string): string {
  if (Array.isArray(json?.message)) return json.message.join(", ");
  if (typeof json?.message === "string") return json.message;
  if (typeof json?.error === "string") return json.error;
  return fallback;
}

/** Shared request helper for authenticated JSON calls against Railway. */
async function railwayRequest<T = any>(
  path: string,
  options: {
    method: "GET" | "POST" | "PATCH" | "DELETE";
    accessToken?: string;
    body?: unknown;
    fallbackErrorMessage: string;
  }
): Promise<RailwayResult<T>> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (options.accessToken) headers["Authorization"] = `Bearer ${options.accessToken}`;
    const res = await fetch(`${RAILWAY_API_URL}${path}`, {
      method: options.method,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        message: extractErrorMessage(json, options.fallbackErrorMessage),
      };
    }
    return { ok: true, status: res.status, data: (json?.data ?? json) as T, message: json?.message };
  } catch (err: any) {
    return {
      ok: false,
      status: 500,
      message: err?.message || "Tidak dapat terhubung ke server Railway.",
    };
  }
}

// ---------------------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------------------

/** Register a customer. POST /auth/register */
export async function railwayRegister(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}): Promise<RailwayRegisterResponse> {
  try {
    const res = await fetch(`${RAILWAY_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    // Some Railway responses use 2xx + { success: false } for duplicate users
    // instead of a non-2xx status. Handle both shapes.
    if (json && json.success === false) {
      return {
        ok: false,
        status: res.status,
        message: typeof json.message === "string" ? json.message : "User already exists",
      };
    }
    if (!res.ok) {
      return { ok: false, status: res.status, message: extractErrorMessage(json, "Gagal mendaftar ke server.") };
    }
    return { ok: true, status: res.status, message: "Registrasi berhasil!", data: json.data };
  } catch (err: any) {
    return { ok: false, status: 500, message: err?.message || "Tidak dapat terhubung ke server Railway." };
  }
}

/**
 * Register an admin account. POST /auth/admin
 * Per spec this is intentionally not exposed on any public page - it's here
 * so an authorized flow can call it if/when the project needs it.
 */
export async function railwayRegisterAdmin(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}): Promise<RailwayRegisterResponse> {
  try {
    const res = await fetch(`${RAILWAY_API_URL}/auth/admin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (json && json.success === false) {
      return {
        ok: false,
        status: res.status,
        message: typeof json.message === "string" ? json.message : "Admin already exists",
      };
    }
    if (!res.ok) {
      return { ok: false, status: res.status, message: extractErrorMessage(json, "Gagal mendaftarkan admin.") };
    }
    return { ok: true, status: res.status, message: "Admin berhasil didaftarkan!", data: json.data };
  } catch (err: any) {
    return { ok: false, status: 500, message: err?.message || "Tidak dapat terhubung ke server Railway." };
  }
}

/** Login. POST /auth/login */
export async function railwayLogin(data: {
  email: string;
  password: string;
}): Promise<RailwayLoginResponse> {
  try {
    const res = await fetch(`${RAILWAY_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.accessToken) {
      return { ok: false, status: res.status, message: extractErrorMessage(json, "Email atau Password salah.") };
    }
    return {
      ok: true,
      status: res.status,
      message: typeof json.message === "string" ? json.message : "Login berhasil",
      data: json.data,
      accessToken: json.accessToken,
    };
  } catch (err: any) {
    return { ok: false, status: 500, message: err?.message || "Tidak dapat terhubung ke server Railway." };
  }
}

// ---------------------------------------------------------------------------
// TABLES
// ---------------------------------------------------------------------------

/** GET /tables */
export async function railwayGetTables(accessToken?: string): Promise<RailwayTable[]> {
  const res = await railwayRequest<RailwayTable[]>("/tables", {
    method: "GET",
    accessToken,
    fallbackErrorMessage: "Gagal mengambil daftar meja.",
  });
  return res.ok && Array.isArray(res.data) ? res.data : [];
}

/** POST /tables. Body per spec: { number, capacity }. Admin auth required. */
export async function railwayCreateTable(
  accessToken: string,
  data: { number: number; capacity: number }
): Promise<RailwayResult<RailwayTable>> {
  return railwayRequest<RailwayTable>("/tables", {
    method: "POST",
    accessToken,
    body: data,
    fallbackErrorMessage: "Gagal membuat meja baru.",
  });
}

/**
 * PATCH /tables/:tableId. Body per spec: { capacity, status } (either can be
 * sent alone since it's a partial update).
 */
export async function railwayUpdateTable(
  accessToken: string,
  tableId: number,
  data: { capacity?: number; status?: string }
): Promise<RailwayResult<RailwayTable>> {
  return railwayRequest<RailwayTable>(`/tables/${tableId}`, {
    method: "PATCH",
    accessToken,
    body: data,
    fallbackErrorMessage: "Gagal memperbarui meja.",
  });
}

// ---------------------------------------------------------------------------
// BOOKINGS
// ---------------------------------------------------------------------------

/**
 * GET /bookings - returns the authenticated user's own bookings.
 *
 * IMPORTANT: there is no documented endpoint for an admin to list ALL
 * bookings across all customers. The spec's endpoint summary only documents
 * POST /bookings, GET /bookings, and the two admin approve/reject routes
 * below - there is no GET /admin/bookings. A previous version of this file
 * called /admin/bookings for admin views; that was calling an undocumented,
 * unverified endpoint, which risked silently returning wrong/misleading
 * data (or a 404) and was removed per explicit instruction not to invent or
 * assume endpoints.
 *
 * Practical effect: admin pages that need "every booking" (the bookings
 * management list, dashboard stats, and reports) currently have no
 * supported way to fetch that data from Railway. Those pages surface this
 * limitation directly instead of pretending to have the data - see
 * app/admin/bookings/page.tsx, app/admin/page.tsx, and
 * app/admin/reports/page.tsx. If the real Postman collection does include a
 * booking-listing endpoint for admins, add it here once confirmed.
 */
export async function railwayGetBookings(accessToken: string): Promise<RailwayBooking[]> {
  const res = await railwayRequest<RailwayBooking[]>("/bookings", {
    method: "GET",
    accessToken,
    fallbackErrorMessage: "Gagal mengambil daftar booking.",
  });
  return res.ok && Array.isArray(res.data) ? res.data : [];
}

/** POST /bookings. Customer auth required. */
export async function railwayCreateBooking(
  accessToken: string,
  data: {
    tableId: number;
    bookingDate: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    guestcount: number;
    notes?: string;
  }
): Promise<RailwayResult<RailwayBooking>> {
  return railwayRequest<RailwayBooking>("/bookings", {
    method: "POST",
    accessToken,
    body: data,
    fallbackErrorMessage: "Gagal membuat reservasi.",
  });
}

/** PATCH /admin/bookings/:bookingId/approve. Admin auth required. */
export async function railwayApproveBooking(accessToken: string, bookingId: number): Promise<RailwayResult> {
  return railwayRequest(`/admin/bookings/${bookingId}/approve`, {
    method: "PATCH",
    accessToken,
    fallbackErrorMessage: "Gagal menyetujui reservasi.",
  });
}

/** PATCH /admin/bookings/:bookingId/reject. Admin auth required. */
export async function railwayRejectBooking(accessToken: string, bookingId: number): Promise<RailwayResult> {
  return railwayRequest(`/admin/bookings/${bookingId}/reject`, {
    method: "PATCH",
    accessToken,
    fallbackErrorMessage: "Gagal menolak reservasi.",
  });
}

// ---------------------------------------------------------------------------
// CUSTOMERS (admin-facing management)
// ---------------------------------------------------------------------------

/** GET /customer. Bearer token required. */
export async function railwayGetCustomers(accessToken: string): Promise<RailwayUser[]> {
  const res = await railwayRequest<RailwayUser[]>("/customer", {
    method: "GET",
    accessToken,
    fallbackErrorMessage: "Gagal mengambil daftar customer.",
  });
  return res.ok && Array.isArray(res.data) ? res.data : [];
}

/** GET /customer/:customerId. Bearer token required. */
export async function railwayGetCustomerById(accessToken: string, customerId: number): Promise<RailwayResult<RailwayUser>> {
  return railwayRequest<RailwayUser>(`/customer/${customerId}`, {
    method: "GET",
    accessToken,
    fallbackErrorMessage: "Gagal mengambil detail customer.",
  });
}

/** PATCH /customer/:customerId. Used both for self-service profile edits and admin edits. */
export async function railwayUpdateCustomer(
  accessToken: string,
  customerId: number,
  data: { name?: string; phone?: string; email?: string }
): Promise<RailwayResult<RailwayUser>> {
  return railwayRequest<RailwayUser>(`/customer/${customerId}`, {
    method: "PATCH",
    accessToken,
    body: data,
    fallbackErrorMessage: "Gagal memperbarui profil customer.",
  });
}

/** DELETE /customer/:customerId. Admin auth required. */
export async function railwayDeleteCustomer(accessToken: string, customerId: number): Promise<RailwayResult> {
  return railwayRequest(`/customer/${customerId}`, {
    method: "DELETE",
    accessToken,
    fallbackErrorMessage: "Gagal menghapus customer.",
  });
}

// ---------------------------------------------------------------------------
// ADMINS (admin-facing management)
// ---------------------------------------------------------------------------

/** GET /admin. Admin auth required. */
export async function railwayGetAdmins(accessToken: string): Promise<RailwayUser[]> {
  const res = await railwayRequest<RailwayUser[]>("/admin", {
    method: "GET",
    accessToken,
    fallbackErrorMessage: "Gagal mengambil daftar admin.",
  });
  return res.ok && Array.isArray(res.data) ? res.data : [];
}

/** GET /admin/:adminId. Admin auth required. */
export async function railwayGetAdminById(accessToken: string, adminId: number): Promise<RailwayResult<RailwayUser>> {
  return railwayRequest<RailwayUser>(`/admin/${adminId}`, {
    method: "GET",
    accessToken,
    fallbackErrorMessage: "Gagal mengambil detail admin.",
  });
}

/** PATCH /admin/:adminId. Admin auth required. */
export async function railwayUpdateAdmin(
  accessToken: string,
  adminId: number,
  data: { name?: string; email?: string; phone?: string }
): Promise<RailwayResult<RailwayUser>> {
  return railwayRequest<RailwayUser>(`/admin/${adminId}`, {
    method: "PATCH",
    accessToken,
    body: data,
    fallbackErrorMessage: "Gagal memperbarui admin.",
  });
}

/** DELETE /admin/:adminId. Admin auth required. */
export async function railwayDeleteAdmin(accessToken: string, adminId: number): Promise<RailwayResult> {
  return railwayRequest(`/admin/${adminId}`, {
    method: "DELETE",
    accessToken,
    fallbackErrorMessage: "Gagal menghapus admin.",
  });
}
