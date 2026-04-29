import { useState } from "react";
import { Search, Check, Tag } from "lucide-react";
import type { LensItem } from "../types";

interface CatalogProps {
  currentPlan: string;
  isAllowancePlan: boolean;
  onSelectItem: (name: string, price: number, cat: string) => void;
  selectedItemName?: string;
}

const MASTER_PRICE_LIST: Record<string, LensItem[]> = {
  "Plastic (CR-39)": [
    { name: "Plano", price: 35.0 },
    { name: "Single Vision Plastic", price: 50.0 },
    { name: "Eyezen (+0-+4) PLASTIC PLASTIC", price: 125.0 },
    { name: "Flat Top 28 Bifocal PLASTIC", price: 140.0 },
    { name: "Flat Top 35 Bifocal PLASTIC", price: 145.0 },
    { name: "Trifocal 7x28 PLASTIC", price: 165.0 },
    { name: "RD-22 Round Seg PLASTIC", price: 50.0 },
    { name: "Franklin Seg PLASTIC", price: 500.0 },
    { name: "Essilor Natural PLASTIC", price: 295.0 },
    { name: "Essilor Ovation PLASTIC", price: 350.0 },
    { name: "Varilux Comfort DRx PLASTIC", price: 365.0 },
    { name: "Varilux Physio DRx PLASTIC", price: 390.0 },
    { name: "Varilux X PLASTIC", price: 530.0 },
    { name: "Shamir Autograph III PLASTIC", price: 465.0 },
    { name: "VSP Unity ETHOS PLASTIC", price: 325.0 },
    { name: "VSP Unity VIA PLASTIC", price: 350.0 },
    { name: "VSP Unity VIA Elite PLASTIC", price: 425.0 },
    { name: "Younger Image PLASTIC", price: 255.0 },
  ],
  Polycarbonate: [
    { name: "Single Vision POLY ", price: 115.0 },
    { name: "Eyezen (+0-+4) POLY", price: 180.0 },
    {
      name: "Essilor Stellest Myopia Control POLY (COMES WITH CRIZAL EASY A/R)",
      price: 325.0,
    },
    { name: "Flat Top 28 Bifocal POLY", price: 180.0 },
    { name: "Flat Top 35 Bifocal POLY", price: 240.0 },
    { name: "Trifocal 7x28 POLY", price: 205.0 },
    { name: "Essilor Natural ", price: 335.0 },
    { name: "Essilor Ovation POLY", price: 390.0 },
    { name: "Varilux Comfort DRx POLY", price: 405.0 },
    { name: "Varilux Physio DRx POLY", price: 430.0 },
    { name: "Varilux X POLY", price: 570.0 },
    { name: "Shamir Autograph III POLY", price: 505.0 },
    { name: "VSP Unity ETHOS POLY", price: 365.0 },
    { name: "VSP Unity VIA POLY", price: 410.0 },
    { name: "VSP Unity VIA Elite POLY", price: 465.0 },
    { name: "Younger Image POLY", price: 295.0 },
  ],
  Trivex: [
    { name: "Single Vision TRIVEX ", price: 150.0 },
    { name: "Eyezen (+0-+4)", price: 195.0 },
    { name: "Flat Top 28 Bifocal TRIVEX", price: 205.0 },
    { name: "Trifocal 7x28 TRIVEX", price: 245.0 },
    { name: "Essilor Ovation TRIVEX", price: 315.0 },
    { name: "Varilux Comfort DRx TRIVEX", price: 415.0 },
    { name: "Varilux X TRIVEX", price: 630.0 },
    { name: "Freefocus HD(Luzerne) TRIVEX", price: 305.0 },
    { name: "Younger Image TRIVEX", price: 315.0 },
  ],
  "High-Index": [
    { name: "Single Vision 1.67", price: 365.0 },
    { name: "Single Vision 1.74", price: 400.0 },
    { name: "Eyezen 1.67 (+0-+4)", price: 415.0 },
    { name: "Flat Top 28 Bifocal 1.67", price: 420.0 },
    { name: "Flat Top 35 Bifocal 1.67", price: 450.0 },
    { name: "RD-22 Round Seg 1.67", price: 550.0 },
    { name: "Franklin Seg 1.67", price: 1050.0 },
    { name: "Essilor Natural Digital 1.67", price: 500.0 },
    { name: "Essilor Ovation Digital 1.67", price: 500.0 },
    { name: "Varilux Physio 1.67", price: 625.0 },
    { name: "Varilux X 1.67", price: 825.0 },
    { name: "Shamir Autograph III 1.67", price: 625.0 },
    { name: "VSP Unity V3 1.67", price: 525.0 },
    { name: "VSP Unity Elite 1.67", price: 695.0 },
    { name: "Younger Image 1.67", price: 520.0 },
  ],
  Glass: [
    { name: "Single Vision GLASS", price: 175.0 },
    { name: "FT-28 GLASS", price: 285.0 },
    { name: "7x28 GLASS", price: 345.0 },
    { name: "Freefocus HD GLASS", price: 500.0 },
    { name: "X-Ray Glass SV GLASS", price: 400.0 },
    { name: "X-Ray Glass FT-28 GLASS", price: 450.0 },
    { name: "X-Ray Glass Prog GLASS", price: 575.0 },
  ],
  "Office/Computer Progressives": [
    { name: "Freefocus PC13/20 PLASTIC", price: 205.0 },
    { name: "Shamir Workspace PLASTIC", price: 245.0 },
    { name: "Zeiss Officelens PLASTIC", price: 225.0 },
  ],
  "Transitions Plastic": [
    { name: "Single Vision TRANS", price: 235.0 },
    { name: "FT-28 TRANS", price: 250.0 },
    { name: "RD-22 TRANS", price: 360.0 },
    { name: "7x28 TRANS", price: 275.0 },
    { name: "Essilor Natural Digital TRANS PLASTIC", price: 415.0 },
    { name: "Varilux Comfort TRANS", price: 475.0 },
    { name: "Varilux Physio TRANS", price: 510.0 },
    { name: "Varilux X TRANS", price: 640.0 },
    { name: "Shamir Auto III TRANS", price: 575.0 },
    { name: "VSP Unity V3 TRANS", price: 435.0 },
    { name: "VSP Unity Elite TRANS", price: 535.0 },
    { name: "Younger Image TRANS", price: 365.0 },
  ],
  "Transitions Poly": [
    { name: "Single Vision TRANS POLY", price: 275.0 },
    { name: "FT-28 TRANS POLY", price: 290.0 },
    { name: "RD-22 TRANS POLY", price: 395.0 },
    { name: "7x28 TRANS POLY", price: 315.0 },
    { name: "Essilor Natural Digital TRANS POLY", price: 455.0 },
    { name: "Varilux Comfort TRANS POLY", price: 505.0 },
    { name: "Varilux Physio TRANS POLY", price: 550.0 },
    { name: "Varilux X TRANS POLY", price: 690.0 },
    { name: "Shamir Auto III TRANS POLY", price: 615.0 },
    { name: "VSP Unity V3 TRANS POLY", price: 475.0 },
    { name: "VSP Unity Elite TRANS POLY", price: 575.0 },
    { name: "Younger Image TRANS POLY", price: 405.0 },
  ],
  "Transitions Trivex": [
    { name: "Single Vision TRANS TRIVEX", price: 275.0 },
    { name: "FT-28 TRANS TRIVEX", price: 300.0 },
    { name: "7x28 TRANS TRIVEX", price: 350.0 },
    { name: "Younger Image TRANS TRIVEX", price: 455.0 },
    { name: "Essilor Ovation Digital TRANS TRIVEX ", price: 570.0 },
    { name: "Varilux Comfort TRANS TRIVEX", price: 650.0 },
    { name: "Varilux X TRANS TRIVEX", price: 790.0 },
    { name: "Freefocus HD TRANS TRIVEX", price: 405.0 },
    { name: "VSP Unity V3 TRANS TRIVEX", price: 590.0 },
  ],
  "Transitions High-Index": [
    { name: "Single Vision 1.67 TRANS", price: 465.0 },
    { name: "Single Vision 1.74 TRANS", price: 650.0 },
    { name: "FT-28 1.67(V Dyna) TRANS", price: 470.0 },
    { name: "RD-22 1.67 TRANS", price: 600.0 },
    { name: "Essilor Natural Digital 1.67 TRANS", price: 650.0 },
    { name: "Varilux Comfort 1.67 TRANS", price: 720.0 },
    { name: "Varilux Physio 1.67 TRANS", price: 750.0 },
    { name: "Varilux X 1.67 TRANS", price: 900.0 },
    { name: "Shamir Auto III 1.67 TRANS", price: 720.0 },
    { name: "VSP Unity V3 1.67 TRANS", price: 650.0 },
    { name: "VSP Unity Elite 1.67 TRANS", price: 800.0 },
  ],
  "PGX/PBX Glass": [
    { name: "Single Vision GLASS PGX/PBX", price: 300.0 },
    { name: "FT-28 GLASS PGX/PBX", price: 410.0 },
    { name: "7x28 GLASS PGX/PBX", price: 475.0 },
    { name: "Freefocus HD GLASS PGX/PBX", price: 590.0 },
  ],
  "Transitions XtraActive Polar(POLY)": [
    { name: "Single Vision TRANS XTRA POLAR", price: 375.0 },
    { name: "Ovation Digital TRANS XTRA POLAR", price: 575.0 },
    { name: "Varilux Comfort DRx TRANS XTRA POLAR", price: 650.0 },
    { name: "Younger Image TRANS XTRA POLAR", price: 525.0 },
  ],
  Drivewear: [
    { name: "Single Vision DRIVEWEAR POLY", price: 360.0 },
    { name: "Younger Image DRIVEWEAR POLY", price: 500.0 },
  ],
  "Polarized Plastic": [
    { name: "Single Vision POLARIZED", price: 175.0 },
    { name: "KBCO Single Vision POLARIZED", price: 250.0 },
    { name: "FT-28 POLARIZED", price: 225.0 },
    { name: "KBCO FT-28 POLARIZED", price: 300.0 },
    { name: "7x28 POLARIZED", price: 270.0 },
    { name: "KBCO 7x28 POLARIZED", price: 350.0 },
    { name: "Essilor Natural POLARIZED", price: 450.0 },
    { name: "KBCO IRx Pro POLARIZED", price: 475.0 },
    { name: "Younger Image POLARIZED", price: 400.0 },
  ],
  "Polarized Poly": [
    { name: "Single Vision POLARIZED POLY", price: 220.0 },
    { name: "FT-28 POLARIZED POLY", price: 300.0 },
    { name: "7x28 POLARIZED POLY", price: 315.0 },
    { name: "Essilor Natural POLARIZED POLY", price: 515.0 },
    { name: "KBCO IRx Pro POLARIZED POLY", price: 535.0 },
    { name: "Younger Image POLARIZED POLY", price: 495.0 },
  ],
  "Avalux Migraine": [
    { name: "Single Vision AVALUX MIGRAINE", price: 850.0 },
    { name: "Progressive AVALUX MIGRAINE", price: 975.0 },
  ],
  "Ray-Ban Single Vision": [
    { name: "Plastic RAY-BAN", price: 150.0 },
    { name: "Plastic w/ Blue Light RAY-BAN", price: 180.0 },
    { name: "Plastic Transitions RAY-BAN", price: 260.0 },
    { name: "Poly RAY-BAN", price: 190.0 },
    { name: "Poly w/ Blue Light RAY-BAN", price: 220.0 },
    { name: "Poly Transitions RAY-BAN", price: 300.0 },
    { name: "1.67 High-Index RAY-BAN", price: 375.0 },
    { name: "1.67 w/ Blue Light RAY-BAN", price: 405.0 },
    { name: "1.67 Transitions RAY-BAN", price: 485.0 },
  ],
  "Ray-Ban Progressive": [
    { name: "Plastic RAY-BAN PROG", price: 340.0 },
    { name: "Plastic w/ Blue Light RAY-BAN PROG", price: 370.0 },
    { name: "Plastic Transitions RAY-BAN PROG", price: 450.0 },
    { name: "Poly RAY-BAN PROG", price: 380.0 },
    { name: "Poly w/ Blue Light RAY-BAN PROG", price: 410.0 },
    { name: "Poly Transitions RAY-BAN PROG", price: 490.0 },
    { name: "1.67 High-Index RAY-BAN PROG", price: 500.0 },
    { name: "1.67 w/ Blue Light RAY-BAN PROG", price: 530.0 },
    { name: "1.67 Transitions RAY-BAN PROG", price: 610.0 },
  ],
  "Ray-Ban Sun": [
    { name: "Non-Polar RAY-BAN SUN", price: 350.0 },
    { name: "Polar RAY-BAN SUN", price: 390.0 },
    { name: "Polar BSAR RAY-BAN SUN", price: 440.0 },
    { name: "Polar Gradient BSAR RAY-BAN SUN", price: 450.0 },
    { name: "Polar Mirror BSAR RAY-BAN SUN", price: 475.0 },
  ],
  "Tints and Coatings": [
    { name: "Tint", price: 20.0 },
    { name: "Specialty Tint", price: 70.0 },
    { name: "Scratch Coat", price: 20.0 },
    { name: "U/V Coat", price: 20.0 },
    { name: "Standard A/R", price: 85.0 },
    { name: "A/R Strip", price: 25.0 },
    { name: "Crizal Easy A/R", price: 185.0 },
    { name: "Crizal Rock A/R", price: 215.0 },
    { name: "Unity A/R", price: 185.0 },
    { name: "Mirror Coat", price: 160.0 },
    { name: "Blue Light", price: 40.0 },
  ],
  "Overpower/Oversize": [
    { name: "SV over ±4.00 SPH", price: 10.0 },
    { name: "SV over ±8.00 SPH", price: 20.0 },
    { name: "Bifocal Add over +3.00", price: 15.0 },
    { name: "Bifocal Add over +4.00", price: 30.0 },
    { name: "Cylinder in Addtn to SPH", price: 20.0 },
    { name: "Prism", price: 10.0 },
    { name: "Eyesize over 58mm", price: 20.0 },
    { name: "Semi-Rimless Groove", price: 20.0 },
  ],
  Miscellaneous: [
    { name: "Oakley In-Line", price: 80.0 },
    { name: "Edge Down", price: 35.0 },
    { name: "Take PD for NP", price: 25.0 },
    { name: "Slab Off", price: 185.0 },
    { name: "Drill Mount", price: 40.0 },
    { name: "Press-On Prism", price: 75.0 },
    { name: "Roll", price: 30.0 },
    { name: "Polish", price: 30.0 },
    { name: "Roll and Polish", price: 45.0 },
    { name: "Safety Fee", price: 30.0 },
    { name: "Side Shields", price: 30.0 },
  ],
};

const MEDICAID_LENSES = [
  "Single Vision Plastic",
  "Flat Top 28 Bifocal Plastic",
  "Younger Image Plastic",
  "Single Vision POLY",
  "Flat Top 28 Bifocal POLY",
  "Younger Image POLY",
];

export function Catalog({
  currentPlan,
  isAllowancePlan,
  onSelectItem,
  selectedItemName,
}: CatalogProps) {
  const [activeCat, setActiveCat] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const categories = ["All", ...Object.keys(MASTER_PRICE_LIST)];

  const isMedicalPlan =
    currentPlan === "MEDICAID" || currentPlan === "SCHOOL LETTER";
  const isCommercial =
    !isMedicalPlan && currentPlan !== "None" && !isAllowancePlan;

  const getPriceDisplay = (item: LensItem) => {
    if (isMedicalPlan) return "$0.00";
    if (isCommercial) return "Copay Applies";
    return "$" + item.price.toFixed(2);
  };

  const filteredItems = Object.entries(MASTER_PRICE_LIST).flatMap(
    ([cat, items]) => {
      if (activeCat !== "All" && activeCat !== cat) return [];

      return items
        .filter((item) => {
          const matchesSearch = item.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

          if (isMedicalPlan) {
            const isMedicaidApproved = MEDICAID_LENSES.some((m) =>
              item.name.toLowerCase().includes(m.toLowerCase()),
            );
            return matchesSearch && isMedicaidApproved;
          }

          return matchesSearch;
        })
        .map((item) => ({ ...item, category: cat as string }));
    },
  );

  return (
    <div className="flex flex-col bg-theme-card overflow-hidden">
      <div className="p-4 border-b border-theme-border flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-text" />
          <input
            type="text"
            placeholder="Search lenses, coatings, misc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-theme-bg border border-theme-border rounded-lg text-sm focus:ring-1 focus:ring-theme-accent outline-none text-theme-text font-bold uppercase"
          />
        </div>

        <div
          className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x select-none cursor-grab active:cursor-grabbing"
          style={{
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <div className="flex gap-3 min-w-max px-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border snap-center active:scale-90 ${
                  activeCat === cat
                    ? "bg-theme-text border-theme-border text-theme-card shadow-xl"
                    : "bg-theme-card border-theme-border text-theme-text hover:bg-theme-bg"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-theme-card">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-20">
          {filteredItems.map((item, idx) => {
            const isSelected =
              selectedItemName === item.name ||
              selectedItemName === `LENS: ${item.name}`;
            return (
              <button
                key={`${item.name}-${idx}`}
                onClick={() =>
                  onSelectItem(item.name, item.price, item.category)
                }
                className={`group p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "bg-green-500/20 border-green-500 shadow-lg ring-2 ring-green-500/20"
                    : "bg-theme-card border-theme-border hover:bg-green-500/10 hover:border-green-500/50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`p-1 px-2 rounded border text-[9px] font-black uppercase transition-colors ${
                      isSelected
                        ? "bg-green-500 text-white border-green-600"
                        : "bg-theme-bg border-theme-border text-theme-text"
                    }`}
                  >
                    {item.category}
                  </span>
                  {isSelected && (
                    <Check className="w-3 h-3 transition-opacity text-green-600 opacity-100" />
                  )}
                </div>
                <h4
                  className={`text-xs font-black leading-tight mb-2 line-clamp-2 uppercase italic transition-colors ${isSelected ? "text-green-700" : "text-theme-text"}`}
                >
                  {item.name}
                </h4>
                <div className="flex items-baseline gap-1">
                  <Tag
                    className={`w-3 h-3 transition-colors ${isSelected ? "text-green-600" : "text-theme-text"}`}
                  />
                  <span
                    className={`text-[11px] font-black transition-colors ${isSelected ? "text-green-600" : "text-theme-text"}`}
                  >
                    {getPriceDisplay(item)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-40">
            <Search className="w-12 h-12 mb-2" />
            <p className="text-sm font-bold uppercase tracking-widest">
              No results found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
