import { getSession } from "../actions";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { safeQuery } from "@/db/ensure";
import Navbar from "../../components/Navbar";
import SeatingArea from "../../components/SeatingArea";
export const dynamic = "force-dynamic";
export default async function GaleriPage() {
  const session = await getSession();
  const allSettings = await safeQuery(
    () => db.select().from(settings),
    [] as Array<{ id: number; key: string; value: string }>
  );
  const cafeName =
    allSettings.find((s) => s.key === "cafe_name")?.value ?? "CafeReserve";
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      <Navbar
        cafeName={cafeName}
        isLoggedIn={!!session}
        role={session?.role ?? null}
      />
      <main className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Suasana Gallery Header */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-800">
              Galeri Cafe
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
              Suasana & Sudut Cafe
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Lihat suasana nyaman dan estetik CafeReserve sebelum berkunjung.
            </p>
          </div>
          {/* Photo Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Area Indoor WFC",
                desc: "Sofa & colokan listrik",
                img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
              },
              {
                title: "Kopi Latte Art",
                desc: "Biji Kopi Arabika Pilihan",
                img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
              },
              {
                title: "Gourmet Pasta",
                desc: "Hidangan lezat chef terbaik",
                img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
              },
              {
                title: "Rooftop Sunset",
                desc: "Suasana romantis malam hari",
                img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
              },
              {
                title: "Espresso Bar",
                desc: "Penyeduhan langsung barista",
                img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
              },
              {
                title: "Outdoor Garden",
                desc: "Santai & terbuka",
                img: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&q=80&w=800",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group relative overflow-hidden rounded-2xl bg-stone-100 shadow-sm aspect-4/3 border border-stone-200/80"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-80 transition duration-300 group-hover:opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    {item.desc}
                  </span>
                  <h3 className="text-base font-bold mt-0.5">{item.title}</h3>
                </div>
              </div>
            ))}
          </div>
          {/* Seating Area Section */}
          <div className="border-t border-stone-200/80 pt-16">
            <SeatingArea />
          </div>
        </div>
      </main>
    </div>
  );
}
