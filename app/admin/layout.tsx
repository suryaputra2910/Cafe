import {
      BarChart3,
      BookOpen,
      Coffee,
      Grid3x3,
      Home,
      LayoutDashboard,
      LogOut,
      Settings,
      ShieldCheck,
      Users,
      UtensilsCrossed
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession, logoutAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Redirect if not logged in
  if (!session) {
    redirect("/login");
  }

  // Redirect if not admin
  if (session.role !== "admin") {
    redirect("/customer");
  }

  // Define logout handler inline
  async function handleLogout() {
    "use server";
    await logoutAction();
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-300 flex-shrink-0 flex flex-col border-r border-stone-800">
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
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          <Link
            href="/admin"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-stone-800 transition text-stone-300"
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/bookings"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-stone-800 transition text-stone-300"
          >
            <BookOpen className="h-5 w-5" />
            <span>Bookings</span>
          </Link>
          <Link
            href="/admin/tables"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-stone-800 transition text-stone-300"
          >
            <Grid3x3 className="h-5 w-5" />
            <span>Tables</span>
          </Link>
          <Link
            href="/admin/customers"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-stone-800 transition text-stone-300"
          >
            <Users className="h-5 w-5" />
            <span>Customers</span>
          </Link>
          <Link
            href="/admin/admins"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-stone-800 transition text-stone-300"
          >
            <ShieldCheck className="h-5 w-5" />
            <span>Admins</span>
          </Link>
          {/* <Link
            href="/admin/menu"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-stone-800 transition text-stone-300"
          >
            <UtensilsCrossed className="h-5 w-5" />
            <span>Menu</span>
          </Link> */}
          <Link
            href="/admin/reports"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-stone-800 transition text-stone-300"
          >
            <BarChart3 className="h-5 w-5" />
            <span>Reports</span>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-stone-800 transition text-stone-300"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>

        {/* Footer */}
        <div className="border-t border-stone-800 p-4 space-y-2">
          <Link
            href="/customer"
            className="flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-stone-800 transition text-stone-300"
          >
            <Home className="h-4 w-4" />
            <span>Back to Homepage</span>
          </Link>
          <form action={handleLogout}>
            <button
              type="submit"
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg font-medium text-sm hover:bg-red-900/20 transition text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
