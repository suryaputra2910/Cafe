import { CalendarRange, Coffee, Grid3X3, LayoutDashboard, LogOut, ShieldCheck, Users2 } from "lucide-react";
import Link from "next/link";
import { handleAdminLogout } from "./admin-logout-action";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Booking", icon: CalendarRange },
  { href: "/admin/tables", label: "Meja", icon: Grid3X3 },
  { href: "/admin/customers", label: "Customer", icon: Users2 },
  { href: "/admin/admins", label: "Admin", icon: ShieldCheck },
];

export default function AdminNav({ active }: { active: string }) {

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 sm:px-6 sm:py-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Brand & Title */}
      <div className="flex items-center space-x-3">
        <div className="bg-red-600 text-white p-2 rounded-2xl shadow-md">
          <Coffee className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-white text-base tracking-tight">CafeReserve</span>
            <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
              Admin
            </span>
          </div>
          <p className="text-xs text-stone-400">Portal Pengelolaan Cafe</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 bg-stone-950/60 border border-stone-800/80 rounded-2xl p-1.5">
        {ADMIN_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              active === href
                ? "bg-red-600 text-white shadow-sm"
                : "text-stone-300 hover:text-white hover:bg-stone-800/80"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </Link>
        ))}
      </div>

      {/* Logout Button */}
      <form action={handleAdminLogout} className="shrink-0">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-800 hover:bg-red-600/90 text-stone-300 hover:text-white text-xs font-bold rounded-xl border border-stone-700 hover:border-red-500 transition cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5 text-red-400 hover:text-white transition" />
          <span>Keluar</span>
        </button>
      </form>
    </div>
  );
}
