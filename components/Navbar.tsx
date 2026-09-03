"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Coffee, Menu, X, CalendarCheck } from "lucide-react";
/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */
interface NavbarProps {
  /** Cafe name shown next to the logo. */
  cafeName?: string;
  /** True when a user session exists. */
  isLoggedIn?: boolean;
  /** "admin" or "customer" - decides where the dashboard link points. */
  role?: string | null;
}
/** One entry in the navigation menu. */
type NavLink = {
  label: string;
  href: string;
  route: string;
};
const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", route: "/" },
  { label: "Tentang", href: "/tentang", route: "/tentang" },
  { label: "Galeri", href: "/galeri", route: "/galeri" },
  { label: "Kontak", href: "/kontak", route: "/kontak" },
];
/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */
export default function Navbar({
  cafeName = "CafeReserve",
  isLoggedIn = false,
  role = null,
}: NavbarProps) {
  // Current URL path, used to highlight the active page menu item.
  const pathname = usePathname();
  // Becomes true once the user scrolls down past 20px.
  const [isScrolled, setIsScrolled] = useState(false);
  // Controls the mobile dropdown menu.
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  /* ---- Detect scroll position to subtly deepen navbar shadow ------------ */
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    handleScroll(); // run once on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  /* ---- Lock body scroll when mobile menu is expanded ------------------- */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  function isActive(link: NavLink) {
    if (link.route === "/") {
      return pathname === "/";
    }
    return pathname === link.route || pathname.startsWith(link.route + "/");
  }
  /** Closes the mobile menu drawer. */
  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }
  const dashboardHref = role === "admin" ? "/admin" : "/customer";
  return (
    <nav
      className={`sticky top-0 z-50 w-full bg-[#5C4033] transition-all duration-300 ${
        isScrolled ? "shadow-lg shadow-black/20" : "shadow-md shadow-black/10"
      }`}
    >
      {/* ------------------------------ Main Bar ------------------------------ */}
      <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo (Left) */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <span className="rounded-xl bg-white/10 p-2 text-amber-300 transition-colors duration-300 group-hover:bg-white/20">
            <Coffee className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white transition-colors duration-300 group-hover:text-amber-200">
            {cafeName}
          </span>
        </Link>
        {/* Menu Items (Center) - Desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link);
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-sm transition-all duration-300 ${
                    active
                      ? "bg-white/15 font-bold text-white shadow-xs"
                      : "font-medium text-white/85 hover:bg-white/5 hover:text-amber-200"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        {/* Action Buttons (Right) - Desktop */}
        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <Link
              href={dashboardHref}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/85 transition-colors duration-300 hover:text-amber-200"
            >
              {role === "admin" ? "Panel Admin" : "Dashboard"}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-white/85 transition-colors duration-300 hover:text-amber-200"
              >
                Masuk
              </Link>
              <span aria-hidden className="h-4 w-px bg-white/25" />
              <Link
                href="/register"
                className="rounded-full px-4 py-2 text-sm font-medium text-white/85 transition-colors duration-300 hover:text-amber-200"
              >
                Daftar
              </Link>
            </>
          )}
          {/* Primary Call to Action */}
          <Link
            href="/reservasi"
            className="ml-1 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-[#4A3228] shadow-sm transition-all duration-300 hover:bg-amber-300 hover:shadow-md"
          >
            <CalendarCheck className="h-4 w-4" />
            Reservasi Sekarang
          </Link>
        </div>
        {/* Hamburger Toggle Button (Right) - Mobile & Tablet */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMobileMenuOpen}
          className="cursor-pointer rounded-lg p-2 text-white transition-colors duration-300 hover:bg-white/10 lg:hidden"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      {/* ---------------------------- Mobile Menu Drawer ---------------------------- */}
      <div
        className={`overflow-hidden bg-[#5C4033] transition-all duration-300 lg:hidden ${
          isMobileMenuOpen
            ? "max-h-[28rem] border-t border-white/10"
            : "max-h-0"
        }`}
      >
        <ul className="space-y-1 px-4 py-4 sm:px-6">
          {NAV_LINKS.map((link) => {
            const active = isActive(link);
            return (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={closeMobileMenu}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors duration-300 ${
                    active
                      ? "bg-white/15 font-bold text-white"
                      : "font-medium text-white/85 hover:bg-white/5 hover:text-amber-200"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="space-y-3 border-t border-white/10 px-4 py-4 sm:px-6">
          {isLoggedIn ? (
            <Link
              href={dashboardHref}
              onClick={closeMobileMenu}
              className="block rounded-lg px-4 py-3 text-center text-sm font-medium text-white/85 transition-colors duration-300 hover:bg-white/5 hover:text-amber-200"
            >
              {role === "admin" ? "Panel Admin" : "Dashboard Saya"}
            </Link>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="rounded-lg border border-white/20 px-4 py-3 text-center text-sm font-medium text-white transition-colors duration-300 hover:bg-white/10"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                onClick={closeMobileMenu}
                className="rounded-lg border border-white/20 px-4 py-3 text-center text-sm font-medium text-white transition-colors duration-300 hover:bg-white/10"
              >
                Daftar
              </Link>
            </div>
          )}
          <Link
            href="/reservasi"
            onClick={closeMobileMenu}
            className="flex items-center justify-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-[#4A3228] transition-colors duration-300 hover:bg-amber-300"
          >
            <CalendarCheck className="h-4 w-4" />
            Reservasi Sekarang
          </Link>
        </div>
      </div>
    </nav>
  );
}
