"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarPlus,
  Coffee,
  ExternalLink,
  History,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { GeistSans } from "geist/font/sans";

interface CustomerMobileSidebarProps {
  logoutAction: () => Promise<void>;
  userName: string;
  userRole: string;
  isAdmin: boolean;
}

export default function CustomerMobileSidebar({
  logoutAction,
  userName,
  userRole,
  isAdmin,
}: CustomerMobileSidebarProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-40 bg-stone-900 text-white border-b border-stone-800">
        <div className="h-14 px-4 flex items-center justify-between">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg hover:bg-stone-800 transition"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex items-center gap-2">
            <div className="bg-amber-800 text-white p-1.5 rounded-lg">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-white block leading-tight">
                CafeReserve
              </span>
            </div>
          </div>

          {/* Spacer to center the brand */}
          <div className="w-10" />
        </div>
      </header>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-stone-900 text-stone-300 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${GeistSans.className} ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <Link
            href="/customer"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <div className="bg-amber-800 text-white p-1.5 rounded-lg">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-white block">CafeReserve</span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wide">
              </span>
            </div>
          </Link>

          <button
            onClick={closeMenu}
            className="p-2 rounded-lg hover:bg-stone-800 transition"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 bg-stone-950/40 border-b border-stone-800 flex items-center space-x-3">
          <div className="bg-amber-700/30 text-amber-400 font-bold h-10 w-10 rounded-full flex items-center justify-center border border-amber-500/20 shrink-0 text-sm">
            {userName.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <span className="block font-bold text-white text-sm truncate">
              {userName}
            </span>
            <span className="block text-xs text-stone-500 truncate capitalize">
              {userRole}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <Link
            href="/customer"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-800 hover:text-white transition text-sm font-semibold"
          >
            <LayoutDashboard className="h-4 w-4 text-amber-400" />
            Dashboard & Profil
          </Link>

          <Link
            href="/customer/booking"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-800 hover:text-white transition text-sm font-semibold"
          >
            <CalendarPlus className="h-4 w-4 text-amber-400" />
            Booking Meja
          </Link>

          <Link
            href="/customer/my-bookings"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-stone-800 hover:text-white transition text-sm font-semibold"
          >
            <History className="h-4 w-4 text-amber-400" />
            Booking & Riwayat Saya
          </Link>
        </nav>

        {/* Footer */}
        <div className="border-t border-stone-800 p-4 space-y-2">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition text-sm font-medium"
          >
            <Home className="h-4 w-4" />
            Beranda
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              onClick={closeMenu}
              className="flex items-center justify-center space-x-2 w-full px-4 py-2 text-xs font-semibold text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-lg hover:bg-amber-950 hover:text-white transition"
            >
              <span>Kembali Ke Panel Admin</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          )}

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-stone-400 hover:text-white hover:bg-red-950/20 rounded-xl transition"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              Keluar (Logout)
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
