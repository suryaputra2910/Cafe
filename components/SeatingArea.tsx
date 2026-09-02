"use client";

import { ArrowRight, Check, ChevronDown, Info, Sparkles, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/*  Data Structure & Dummy Data                                              */
/*  TODO: Replace dummy seating area data with API / database                 */
/* -------------------------------------------------------------------------- */

export interface SeatingArea {
  id: number;
  /** Used for the query parameter, e.g. /reservasi?area=indoor */
  slug: string;
  name: string;
  image: string;
  capacity: string;
  atmosphere: string;
  description: string;
  available: boolean;
  facilities: string[];
}

export const seatingAreas: SeatingArea[] = [
  {
    id: 1,
    slug: "indoor",
    name: "Area Indoor",
    image:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
    capacity: "2-4 orang",
    atmosphere: "Cozy & Tenang",
    description:
      "Area indoor ber-AC dengan suasana hangat, cocok untuk bekerja atau mengobrol santai.",
    available: true,
    facilities: [
      "WiFi Cepat",
      "Colokan Listrik",
      "AC Sejuk",
      "Meja & Sofa Nyaman",
    ],
  },
  {
    id: 2,
    slug: "outdoor",
    name: "Area Outdoor",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    capacity: "2-4 orang",
    atmosphere: "Santai & Terbuka",
    description:
      "Duduk di udara terbuka dengan semilir angin sore dan suasana yang lebih santai.",
    available: true,
    facilities: [
      "WiFi Cafe",
      "Smoking Area",
      "Suasana Open-Air",
      "Pencahayaan Warm",
    ],
  },
  {
    id: 3,
    slug: "grup",
    name: "Area Grup",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
    capacity: "6-8 orang",
    atmosphere: "Cocok untuk Berkumpul",
    description:
      "Meja besar yang lapang untuk acara keluarga, arisan, atau kumpul bersama teman.",
    available: true,
    facilities: [
      "WiFi Cepat",
      "Meja Kayu Panjang",
      "Colokan Listrik Banyak",
      "Sofa & Kursi Ekstra",
    ],
  },
  {
    id: 4,
    slug: "private",
    name: "Area Private",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    capacity: "4-6 orang",
    atmosphere: "Lebih Privat & Nyaman",
    description:
      "Ruang tersendiri yang tenang, pas untuk rapat kecil atau momen spesial.",
    available: false,
    facilities: [
      "WiFi Privat",
      "Colokan Listrik",
      "AC Dedicated",
      "Ruang Suasana Privat",
    ],
  },
  {
    id: 5,
    slug: "rooftop",
    name: "Area Rooftop",
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800",
    capacity: "2-4 orang",
    atmosphere: "Romantis & Berpemandangan",
    description:
      "Sudut rooftop dengan pemandangan kota dan lampu gantung yang hangat saat malam.",
    available: true,
    facilities: [
      "WiFi Cafe",
      "City View Sunset",
      "Lampu Gantung Warm",
      "Smoking Area",
    ],
  },
  {
    id: 6,
    slug: "bar",
    name: "Area Bar Counter",
    image:
      "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&q=80&w=800",
    capacity: "2 orang",
    atmosphere: "Cozy & Interaktif",
    description:
      "Duduk menghadap barista dan lihat langsung proses penyeduhan kopi Anda.",
    available: true,
    facilities: [
      "WiFi Cepat",
      "Colokan Listrik",
      "Barista View Direct",
      "High Stool Leather",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function SeatingAreaSelector() {
  const router = useRouter();

  // Which area the user picked. null means nothing chosen yet.
  const [selectedArea, setSelectedArea] = useState<SeatingArea | null>(null);

  // Tracks card expanded state for mobile/touch devices without hover
  const [mobileExpandedId, setMobileExpandedId] = useState<number | null>(null);

  // Shown when the user presses the main button without choosing an area.
  const [showHint, setShowHint] = useState(false);

  function handleSelect(area: SeatingArea) {
    setSelectedArea(area);
    setShowHint(false);
  }

  function toggleMobileExpand(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    setMobileExpandedId((prev) => (prev === id ? null : id));
  }

  function handleReserve() {
    if (!selectedArea) {
      setShowHint(true);
      return;
    }
    router.push(`/reservasi?area=${selectedArea.slug}`);
  }

  return (
    <div>
      {/* ----------------------------- Heading ----------------------------- */}
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-800">
          Tempat Duduk
        </span>
        <h2 className="text-3xl font-extrabold tracking-tight text-stone-900">
          Pilihan Area Tempat Duduk
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Pilih area tempat duduk yang sesuai dengan kebutuhan dan suasana yang
          Anda inginkan.
        </p>
      </div>

      {/* ------------------------------ Cards Grid ------------------------------ */}
      {/* 1 kolom di mobile, 2 di tablet, 3 di desktop */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 items-start">
        {seatingAreas.map((area) => {
          const isSelected = selectedArea?.id === area.id;
          const isMobileExpanded = mobileExpandedId === area.id;

          return (
            <article
              key={area.id}
              className={`group flex flex-col overflow-hidden rounded-2xl border bg-white transition-all duration-500 ${isSelected
                  ? "border-amber-600 shadow-xl ring-2 ring-amber-500/40"
                  : "border-stone-200/80 shadow-sm hover:border-amber-500/50 hover:shadow-xl"
                }`}
            >
              {/* Photo with zoom on hover */}
              <div className="relative h-52 w-full shrink-0 overflow-hidden bg-stone-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={area.image}
                  alt={area.name}
                  className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105`}
                />

                {/* Atmosphere badge */}
                <span className="absolute left-3 top-3 rounded-full bg-[#5C4033]/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-xs">
                  {area.atmosphere}
                </span>

                {/* Tick mark once chosen */}
                {isSelected && (
                  <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
                    <Check className="h-4 w-4" strokeWidth={3} />
                  </span>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-stone-900">
                    {area.name}
                  </h3>
                  {/* Mobile toggle button for touch devices */}
                  <button
                    type="button"
                    onClick={(e) => toggleMobileExpand(area.id, e)}
                    className="sm:hidden text-stone-400 hover:text-amber-800 p-1 rounded-md"
                    title="Lihat Fasilitas"
                    aria-label="Lihat Fasilitas"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-300 ${isMobileExpanded ? "rotate-180 text-amber-800" : ""
                        }`}
                    />
                  </button>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                  {area.description}
                </p>

                {/* Capacity & Atmosphere Row */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-stone-100 pt-3 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-stone-700">
                    <Users className="h-3.5 w-3.5 text-amber-700" />
                    {area.capacity}
                  </span>
                  <span className="font-medium text-stone-500">
                    {area.atmosphere}
                  </span>
                </div>

                {/* Smooth Expandable Facilities Section (Hover on desktop, click on mobile) */}
                <div
                  className={`grid transition-all duration-500 ease-in-out ${isMobileExpanded
                      ? "grid-rows-[1fr] opacity-100 mt-4 border-t border-stone-100 pt-3"
                      : "grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:mt-4 group-hover:border-t group-hover:border-stone-100 group-hover:pt-3"
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="transform transition-transform duration-500 ease-in-out translate-y-2 group-hover:translate-y-0">
                      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                        <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                        Fasilitas
                      </p>
                      <ul className="grid grid-cols-2 gap-2 text-xs text-stone-700">
                        {area.facilities.map((facility) => (
                          <li
                            key={facility}
                            className="flex items-center gap-1.5 font-medium"
                          >
                            <Check className="h-3.5 w-3.5 shrink-0 text-amber-700" />
                            <span className="truncate">{facility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  type="button"
                  onClick={() => handleSelect(area)}
                  className={`mt-5 w-full rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${isSelected
                      ? "cursor-pointer bg-amber-500 text-[#4A3228] shadow-sm hover:bg-amber-400"
                      : "cursor-pointer bg-[#5C4033] text-white hover:bg-[#4A3228]"
                    }`}
                >
                  {isSelected
                    ? "Area Dipilih ✓"
                    : "Pilih Area"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* --------------------------- Bottom action -------------------------- */}
      <div className="mt-12 flex flex-col items-center gap-3">
        {selectedArea ? (
          <p className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-semibold text-green-800">
            <Check className="h-3.5 w-3.5" />
            {selectedArea.name} dipilih &bull; {selectedArea.capacity}
          </p>
        ) : (
          <p
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-300 ${showHint
                ? "bg-amber-100 text-amber-900"
                : "bg-stone-100 text-stone-500"
              }`}
          >
            <Info className="h-3.5 w-3.5" />
            Silakan pilih area tempat duduk terlebih dahulu.
          </p>
        )}

        <button
          type="button"
          onClick={handleReserve}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold shadow-sm transition-all duration-300 sm:w-auto ${selectedArea
              ? "cursor-pointer bg-amber-500 text-[#4A3228] hover:bg-amber-400 hover:shadow-md"
              : "cursor-pointer bg-stone-300 text-stone-600 hover:bg-stone-400"
            }`}
        >
          Reservasi Sekarang
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
