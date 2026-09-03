import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, logoutAction } from "../actions";
import { 
  Coffee, 
  LayoutDashboard, 
  CalendarPlus, 
  History, 
  LogOut, 
  Home, 
  ExternalLink 
} from "lucide-react";
import CustomerMobileSidebar from "@/components/CustomerMobileSidebar";

export const dynamic = "force-dynamic";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Redirect if not logged in
  if (!session) {
    redirect("/login");
  }

  // Define logout handler inline
  async function handleLogout() {
    "use server";
    await logoutAction();
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Mobile Sidebar (hamburger + drawer) — client component */}
      <CustomerMobileSidebar
        logoutAction={handleLogout}
        userName={session.name}
        userRole={session.role}
        isAdmin={session.role === "admin"}
      />

      {/* Desktop Sidebar — hidden on mobile */}
      <aside className="hidden md:flex md:w-64 bg-stone-900 text-stone-300 flex-shrink-0 flex-col border-r border-stone-800">
        {/* Brand Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="bg-amber-800 text-white p-1.5 rounded-lg">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <span className="text-md font-bold tracking-tight text-white block">
                CafeReserve
              </span>
              <span className="text-[10px] block text-stone-500 font-semibold tracking-wide uppercase">
                Customer Portal
              </span>
            </div>
          </Link>
          <Link href="/" className="text-stone-500 hover:text-white transition" title="Lihat Beranda">
            <Home className="h-4 w-4" />
          </Link>
        </div>

        {/* User Quick Info */}
        <div className="px-6 py-4 bg-stone-950/40 border-b border-stone-800 flex items-center space-x-3">
          <div className="bg-amber-700/30 text-amber-400 font-bold h-10 w-10 rounded-full flex items-center justify-center border border-amber-500/20 shrink-0">
            {session.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <span className="block font-bold text-white text-sm truncate">{session.name}</span>
            <span className="block text-xs text-stone-500 truncate capitalize">{session.role}</span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-4 space-y-1.5">
          <Link
            href="/customer"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-800 hover:text-white transition"
          >
            <LayoutDashboard className="h-4 w-4 text-amber-400" />
            <span>Dashboard &amp; Profil</span>
          </Link>

          <Link
            href="/customer/booking"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-800 hover:text-white transition"
          >
            <CalendarPlus className="h-4 w-4 text-amber-400" />
            <span>Booking Meja</span>
          </Link>

          <Link
            href="/customer/my-bookings"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-stone-800 hover:text-white transition"
          >
            <History className="h-4 w-4 text-amber-400" />
            <span>Booking &amp; Riwayat Saya</span>
          </Link>
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-stone-800 space-y-2">
          {session.role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-xs font-semibold text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-lg hover:bg-amber-950 hover:text-white transition"
            >
              <span>Kembali Ke Panel Admin</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}

          <form action={handleLogout} className="w-full">
            <button
              type="submit"
              className="flex items-center justify-center space-x-2 w-full px-4 py-2.5 text-sm font-semibold text-stone-400 hover:text-white hover:bg-red-950/20 hover:border-red-500/10 rounded-xl transition cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              <span>Keluar (Logout)</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Content Wrapper */}
        <div className="p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
