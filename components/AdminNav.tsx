import Link from "next/link";
import { LayoutDashboard, CalendarRange, Grid3X3, Users2, ShieldCheck } from "lucide-react";

const ADMIN_LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Booking", icon: CalendarRange },
  { href: "/admin/tables", label: "Meja", icon: Grid3X3 },
  { href: "/admin/customers", label: "Customer", icon: Users2 },
  { href: "/admin/admins", label: "Admin", icon: ShieldCheck },
];

/**
 * Lightweight nav strip for admin pages. There is no shared admin layout in
 * this app (each /admin/* page is standalone), so this is included at the
 * top of each management page instead of introducing a new layout wrapper.
 */
export default function AdminNav({ active }: { active: string }) {
  return (
    <div className="flex flex-wrap gap-1.5 bg-white border border-stone-200 rounded-2xl p-1.5 shadow-xs w-fit">
      {ADMIN_LINKS.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
            active === href
              ? "bg-stone-900 text-white"
              : "text-stone-600 hover:bg-stone-100"
          }`}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </Link>
      ))}
    </div>
  );
}
