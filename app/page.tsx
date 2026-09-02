import Link from "next/link";
import { getSession } from "./actions";
import { db } from "@/db";
import { safeQuery } from "@/db/ensure";
import { seedDatabase } from "@/db/seed";
import { eq } from "drizzle-orm";
import {
  Coffee,
  MapPin,
  Clock,
  Phone,
  Globe,
  ChevronRight,
  Sparkles,
  Users,
  Calendar,
  Heart,
  CheckCircle,
  Utensils,
  ExternalLink,
  Settings
} from "lucide-react";
import Navbar from "../components/Navbar";
import ScrollReveal from "@/components/ScrollReveal";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const session = await getSession();
  // Self-healing: create tables + demo data on a fresh database.
  if (process.env.DATABASE_URL) {
    await seedDatabase().catch(() => null);
  }
  const allSettings = await safeQuery(
    () => db.select().from(Settings),
    [] as Array<{ id: number; key: string; value: string }>
  );
  const settingsMap = allSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const cafeName = settingsMap["cafe_name"] || "CafeReserve ";
  const cafePhone = settingsMap["cafe_phone"] || "6283857642962";
  const cafeHours = settingsMap["cafe_hours"] || "Setiap Hari (09:00 - 23:00)";
  const cafeAddress = settingsMap["cafe_address"] || "Jl. Danau Ranau, Sawojajar, Kec. Kedungkandang, Kota Malang, Jawa Timur 65139";
  const cafeDesc = settingsMap["cafe_desc"] || "Kafe modern dengan konsep nyaman yang menyajikan biji kopi pilihan terbaik, hidangan lezat, dan ruang kumpul/kerja yang estetik.";

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans">
      {/* Header / Navbar */}
      <Navbar
        cafeName={cafeName}
        isLoggedIn={!!session}
        role={session?.role ?? null}
      />

      {/* 1. Hero Section */}
      <section
  id="home"
  className="scroll-mt-[72px] w-full min-h-screen relative bg-stone-900 text-white py-24 md:py-36 overflow-hidden"
>
  <div className="absolute inset-0 z-0 opacity-40">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200"
      alt="Cafe Interior Ambiance"
      className="w-full h-full object-cover"
    />
  </div>

  {/* Overlay - TIDAK DIANIMASIKAN */}
  <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-transparent z-10" />

  {/* Hanya konten Hero yang dianimasikan */}
  <ScrollReveal>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="max-w-2xl">
        <span className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-full text-xs font-semibold mb-6 uppercase tracking-wider">
          <Sparkles className="h-3 w-3" />
          <span>Sistem Reservasi Online Mudah & Cepat</span>
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Nikmati Kopi Terbaik <br />
          <span className="text-amber-400">Tanpa Antre</span> di Meja Pilihan Anda
        </h1>

        <p className="text-stone-300 text-lg mb-8 leading-relaxed">
          {cafeDesc}
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <a
            href="#tentang"
            className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 transition text-base"
          >
            Tentang Kami
          </a>
        </div>
      </div>
    </div>
  </ScrollReveal>

  {/* Bottom Feature Bar - TIDAK DIANIMASIKAN */}
  <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 backdrop-blur-md border-t border-stone-800 z-20 py-4 hidden lg:block">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between text-stone-400 text-sm">
      <div className="flex items-center space-x-2">
        <CheckCircle className="h-4 w-4 text-amber-400" />
        <span>Pilih Meja Favorit Anda Terlebih Dahulu</span>
      </div>

      <div className="flex items-center space-x-2">
        <CheckCircle className="h-4 w-4 text-amber-400" />
        <span>Pre-order Makanan & Minuman Hemat Waktu</span>
      </div>

      <div className="flex items-center space-x-2">
        <CheckCircle className="h-4 w-4 text-amber-400" />
        <span>Notifikasi Konfirmasi Otomatis</span>
      </div>
    </div>
  </div>
</section>


      {/* 2. SECTION TENTANG CAFE */}
      <ScrollReveal>
        <section id="tentang" className="scroll-mt-[72px] py-24 bg-white border-b border-stone-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Foto Cafe di Satu Sisi */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/3 bg-stone-100 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"
                  alt="Suasana Cafe Kami"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 bg-amber-800/95 text-white p-6 rounded-2xl max-w-xs shadow-lg hidden sm:block">
                  <p className="text-sm font-semibold text-amber-200 italic">
                    "Tempat nyaman untuk menikmati kopi, makanan, dan menghabiskan waktu bersama orang terdekat."
                  </p>
                </div>
              </div>

              {/* Deskripsi & Informasi */}
              <div className="space-y-6">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block">
                  Tentang Cafe Kami
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-stone-900 tracking-tight leading-tight">
                  Ruang Inspirasi & Kehangatan Cita Rasa
                </h2>

                <div className="space-y-4 text-stone-600 leading-relaxed text-sm sm:text-base">
                  <p>
                    Didirikan dengan semangat menyajikan cita rasa terbaik dan suasana yang ramah, <strong>{cafeName}</strong> adalah tujuan utama penikmat kopi sejati, pekerja kreatif, serta keluarga yang merayakan momen kebersamaan. Kami percaya bahwa setiap cangkir kopi terbaik bermula dari biji pilihan berkualitas tinggi dan pengolahan yang penuh dedikasi.
                  </p>
                  <p>
                    Setiap sudut kafe kami dirancang khusus untuk memenuhi kenyamanan Anda. Dari area indoor ber-AC dengan konektivitas internet super cepat yang sangat cocok untuk bekerja dari kafe (WFC), hingga area outdoor santai serta rooftop romantis yang menawarkan hembusan angin segar dan pemandangan perkotaan yang estetik.
                  </p>
                </div>

                {/* Tambahan Info Singkat */}
                <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center gap-4 text-stone-700">
                  <div className="flex items-center space-x-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200/50 flex-1">
                    <Heart className="h-5 w-5 text-red-500 fill-current shrink-0" />
                    <span className="text-xs font-bold leading-normal">
                      Tempat nyaman untuk menikmati kopi, makanan, & kumpul keluarga.
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 bg-stone-50 p-3.5 rounded-xl border border-stone-200/50 flex-1">
                    <Coffee className="h-5 w-5 text-amber-700 shrink-0" />
                    <span className="text-xs font-bold leading-normal">
                      Menyajikan hidangan premium buatan Chef & Barista terbaik.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </ScrollReveal>




      {/* 4. SECTION FOTO/SUASANA CAFE */}
      <ScrollReveal>
        <section id="suasana" className="scroll-mt-[72px] py-24 bg-white border-b border-stone-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-widest block mb-2">Suasana Cafe</span>
              <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight">Eksplorasi Sudut Cafe Kami</h2>
              <p className="text-sm text-stone-600 mt-2">
                Lihat suasana nyaman CafeReserve sebelum berkunjung.
              </p>
            </div>

            {/* Modern Asymmetric Photo Gallery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6">

              {/* Card 1: Large Left */}
              <div className="lg:col-span-6 group relative rounded-3xl overflow-hidden shadow-sm aspect-video sm:aspect-auto sm:h-96 bg-stone-100 border border-stone-200/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800"
                  alt="Area Indoor Cozy"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform sm:translate-y-4 group-hover:translate-y-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Area Indoor</span>
                  <h4 className="text-lg font-bold mt-1">Sofa & Ruang Kerja WFC</h4>
                </div>
              </div>

              {/* Card 2: Right Top */}
              <div className="lg:col-span-6 group relative rounded-3xl overflow-hidden shadow-sm aspect-square sm:aspect-auto sm:h-96 bg-stone-100 border border-stone-200/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800"
                  alt="Kopi & Barista"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform sm:translate-y-4 group-hover:translate-y-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Minuman Kopi</span>
                  <h4 className="text-lg font-bold mt-1">Biji Kopi Arabika Pilihan</h4>
                </div>
              </div>

              {/* Card 3: Bottom Left Short */}
              <div className="lg:col-span-4 group relative rounded-3xl overflow-hidden shadow-sm aspect-square bg-stone-100 border border-stone-200/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=600"
                  alt="Fettuccine Pasta"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform sm:translate-y-4 group-hover:translate-y-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Hidangan Lezat</span>
                  <h4 className="text-lg font-bold mt-1">Gourmet Pasta & Dessert</h4>
                </div>
              </div>

              {/* Card 4: Bottom Center Short */}
              <div className="lg:col-span-4 group relative rounded-3xl overflow-hidden shadow-sm aspect-square bg-stone-100 border border-stone-200/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600"
                  alt="Rooftop Sunset"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform sm:translate-y-4 group-hover:translate-y-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Outdoor Area</span>
                  <h4 className="text-lg font-bold mt-1">Rooftop Sunset Area</h4>
                </div>
              </div>

              {/* Card 5: Bottom Right Short */}
              <div className="lg:col-span-4 group relative rounded-3xl overflow-hidden shadow-sm aspect-square bg-stone-100 border border-stone-200/50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600"
                  alt="Barista brewing coffee"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6 z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform sm:translate-y-4 group-hover:translate-y-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                  <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">Espresso Bar</span>
                  <h4 className="text-lg font-bold mt-1">Barista Eksklusif</h4>
                </div>
              </div>

            </div>

          </div>
        </section>
      </ScrollReveal>

      {/* 5. SECTION LOKASI & JAM BUKA */}

      <section id="lokasi" className="scroll-mt-[72px] py-24 bg-stone-50 border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">

            {/* Sebelah Kiri: Informasi Alamat & Google Maps */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="inline-flex p-3 bg-amber-100 text-amber-900 rounded-2xl">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-extrabold text-stone-900 tracking-tight">Lokasi Kami</h3>

                <div className="space-y-1.5 text-stone-600 text-sm">
                  <p className="font-bold text-stone-900">Malang, Indonesia</p>
                  <p className="leading-relaxed">
                    {cafeAddress}
                  </p>
                </div>
              </div>

              {/* Google Maps Button */}
              <div>
                <a
                  href={`https://maps.app.goo.gl/ju2PhUyKULqb5e399?g_st=ic`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-sm transition shadow-sm hover:shadow-md cursor-pointer"
                >
                  <span>Lihat di Google Maps</span>
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Sebelah Kanan: Jam Operasional Cafe */}
            <div className="bg-stone-900 text-white p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-6">
                <div className="inline-flex p-3 bg-stone-800 text-amber-400 rounded-2xl">
                  <Clock className="h-6 w-6" />
                </div>

                <h3 className="text-2xl font-extrabold tracking-tight">Jam Buka Cafe</h3>

                <div className="space-y-4 divide-y divide-stone-800 text-stone-300">
                  <div className="flex justify-between items-center py-2.5">
                    <span className="font-semibold">Senin - Jumat</span>
                    <span className="text-white font-bold text-sm">09.00 - 22.00</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 pt-4">
                    <span className="font-semibold">Sabtu - Minggu</span>
                    <span className="text-amber-400 font-bold text-sm">09.00 - 23.00</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-stone-800 text-xs text-stone-500 font-medium">
                *Hari libur nasional tetap buka, kecuali diumumkan di media sosial resmi kami.
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* 6. Footer */}

      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-stone-900 pb-8 mb-8 gap-4">
            <div>
              <span className="text-white font-bold text-lg">{cafeName}</span>
              <p className="text-xs text-stone-500 mt-1">Sistem Reservasi Meja & Menu Cafe Pintar</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/login" className="hover:text-white transition">Customer Portal</Link>
              <Link href="/login" className="hover:text-white transition">Admin Portal</Link>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between text-xs text-stone-600">
            <span>&copy; {new Date().getFullYear()} {cafeName}. Hak Cipta Dilindungi.</span>
            <span className="mt-2 sm:mt-0">Dibuat dengan Next.js & PostgreSQL</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
