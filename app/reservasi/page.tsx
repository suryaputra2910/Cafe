import { redirect } from "next/navigation";
import { getSession } from "../actions";

// The previous /reservasi implementation was an entirely mock booking flow
// (fake tables, fake food menu, fake payment step - see the removed
// app/reservasi/data.ts, which was explicitly labeled "Mock data" with
// TODOs to "replace with API"). It never called Railway and never actually
// created a booking, which both violates the "no mock data" project rule
// and could mislead a customer into thinking they'd booked/paid when
// nothing was saved anywhere. The real, Railway-backed booking flow lives
// at /customer/booking, so this route now sends people there instead of
// duplicating it.
export const dynamic = "force-dynamic";
export default async function ReservasiRedirect() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role === "admin") {
    redirect("/admin/bookings");
  }
  redirect("/customer/booking");
}
