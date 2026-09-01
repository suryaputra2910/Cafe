import { getSession } from "../actions";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { safeQuery } from "@/db/ensure";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { Heart, Coffee, CheckCircle, ArrowRight } from "lucide-react";
export const dynamic = "force-dynamic";
export default async function TentangPage() {
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
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
            {/* Foto Cafe */}
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl bg-stone-100 shadow-xl group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"
                alt="Suasana Cafe Kami"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 hidden max-w-xs rounded-2xl bg-[#5C4033]/95 p-6 text-white shadow-lg sm:block">
                <p className="text-sm font-semibold text-amber-200 italic">
                  "Tempat nyaman untuk menikmati kopi, makanan, dan menghabiskan waktu bersama orang terdekat."
                </p>
              </div>
            </div>
            {/* Deskripsi */}
            <div className="space-y-6">
              <span className="block text-xs font-bold uppercase tracking-widest text-amber-800">
                Tentang Cafe Kami
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl leading-tight">
                Ruang Inspirasi & Kehangatan Cita Rasa
              </h1>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-stone-600">
                <p>
                  Didirikan dengan semangat menyajikan cita rasa terbaik dan suasana yang ramah, <strong>{cafeName}</strong> adalah tujuan utama penikmat kopi sejati, pekerja kreatif, serta keluarga yang merayakan momen kebersamaan.
                </p>
                <p>
                  Setiap sudut kafe kami dirancang khusus untuk memenuhi kenyamanan Anda. Dari area indoor ber-AC dengan konektivitas internet super cepat, hingga area outdoor santai serta rooftop romantis dengan pemandangan perkotaan yang estetik.
                </p>
              </div>
              <div className="flex flex-col gap-4 pt-6 border-t border-stone-200 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3 rounded-xl border border-stone-200/60 bg-white p-4 shadow-xs">
                  <Heart className="h-5 w-5 shrink-0 fill-current text-red-500" />
                  <span className="text-xs font-bold text-stone-700">
                    Tempat nyaman untuk kumpul keluarga & teman.
                  </span>
                </div>
                <div className="flex flex-1 items-center gap-3 rounded-xl border border-stone-200/60 bg-white p-4 shadow-xs">
                  <Coffee className="h-5 w-5 shrink-0 text-amber-700" />
                  <span className="text-xs font-bold text-stone-700">
                    Hidangan premium racikan barista terbaik.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}