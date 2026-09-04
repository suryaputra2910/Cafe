"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  Coffee,
  Grid3x3,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { GeistSans } from "geist/font/sans";

export default function AdminMobileSidebar({
  logoutAction,
}: {
  logoutAction: () => Promise<void>;
}) {
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
              <span className="text-[9px] text-stone-500 uppercase tracking-wide">
                Admin Panel
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
            href="/admin"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <div className="bg-amber-800 text-white p-1.5 rounded-lg">
              <Coffee className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-white block">CafeReserve</span>
              <span className="text-[10px] text-stone-500 uppercase tracking-wide">
                Admin Panel
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

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <Link
            href="/admin"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition text-sm font-medium"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>

          <Link
            href="/admin/bookings"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition text-sm font-medium"
          >
            <BookOpen className="h-5 w-5" />
            Bookings
          </Link>

          <Link
            href="/admin/tables"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition text-sm font-medium"
          >
            <Grid3x3 className="h-5 w-5" />
            Tables
          </Link>

          <Link
            href="/admin/customers"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition text-sm font-medium"
          >
            <Users className="h-5 w-5" />
            Customers
          </Link>

          <Link
            href="/admin/admins"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition text-sm font-medium"
          >
            <ShieldCheck className="h-5 w-5" />
            Admins
          </Link>

          <Link
            href="/admin/reports"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition text-sm font-medium"
          >
            <BarChart3 className="h-5 w-5" />
            Reports
          </Link>
        </nav>

        {/* Footer */}
        <div className="border-t border-stone-800 p-4 space-y-2">
          <Link
            href="/customer"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-stone-800 transition text-sm font-medium"
          >
            <Home className="h-4 w-4" />
            Back to Homepage
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-900/20 text-red-400 transition text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}