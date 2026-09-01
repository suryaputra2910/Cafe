import { getSession } from "../actions";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { safeQuery } from "@/db/ensure";
import Navbar from "../../components/Navbar";
import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";
export const dynamic = "force-dynamic";
export default async function KontakPage() {
  const session = await getSession();
  const allSettings = await safeQuery(
    () => db.select().from(settings),
    [] as Array<{ id: number; key: string; value: string }>
  );
  const settingsMap = allSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);
  const cafeName = settingsMap["cafe_name"] || "CafeReserve";
  const cafePhone = settingsMap["cafe_phone"] || "6283857642962";
  const cafeAddress =
    settingsMap["cafe_address"] ||
    "Jl. Danau Ranau, Sawojajar, Kec. Kedungkandang, Kota Malang, Jawa Timur 65139";
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      <Navbar
        cafeName={cafeName}
        isLoggedIn={!!session}
        role={session?.role ?? null}
      />
      <main className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-800">
              Hubungi Kami
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
              Lokasi & Jam Operasional
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Kami siap menyambut kedatangan Anda setiap hari.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch">
            {/* Lokasi */}
            <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-stone-200/80 bg-white p-8 shadow-xs md:p-10">
              <div className="space-y-4">
                <div className="inline-flex rounded-2xl bg-amber-100 p-3 text-amber-900">
                  <MapPin className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">
                  Lokasi Kami
                </h2>
                <div className="space-y-1.5 text-sm text-stone-600">
                  <p className="font-bold text-stone-900">{cafeName}</p>
                  <p className="leading-relaxed">{cafeAddress}</p>
                </div>
                <div className="pt-2">
                  <p className="flex items-center gap-2 text-xs font-semibold text-stone-600">
                    <Phone className="h-4 w-4 text-amber-700" />
                    +{cafePhone}
                  </p>
                </div>
              </div>
              <div>
                <a
                  href={`https://maps.app.goo.gl/ju2PhUyKULqb5e399?g_st=ic`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-800 px-6 py-3 text-sm font-bold text-white shadow-xs transition hover:bg-amber-900 hover:shadow-md"
                >
                  <span>Lihat di Google Maps</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            {/* Jam Operasional */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-stone-900 p-8 text-white shadow-xl md:p-10">
              <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-amber-500/5 blur-2xl" />
              <div className="space-y-6">
                <div className="inline-flex rounded-2xl bg-stone-800 p-3 text-amber-400">
                  <Clock className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight">
                  Jam Buka Cafe
                </h2>
                <div className="space-y-4 divide-y divide-stone-800 text-stone-300">
                  <div className="flex items-center justify-between py-2.5">
                    <span className="font-semibold">Senin - Jumat</span>
                    <span className="text-sm font-bold text-white">
                      08.00 - 22.00
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 pt-4">
                    <span className="font-semibold">Sabtu - Minggu</span>
                    <span className="text-sm font-bold text-amber-400">
                      07.00 - 23.00
                    </span>
                  </div>
                </div>
              </div>
              <div className="border-t border-stone-800 pt-6 text-xs font-medium text-stone-400">
                *Hari libur nasional tetap buka, kecuali diumumkan di media sosial resmi kami.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}