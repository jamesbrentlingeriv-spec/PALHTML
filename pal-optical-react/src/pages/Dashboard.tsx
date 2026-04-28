import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const internalTools = [
  {
    path: "/contacts",
    emoji: "👁️",
    title: "Contact Lens Orders",
    desc: "Manage and track patient contact lens orders.",
  },
  {
    path: "/dr-receipt",
    emoji: "🧾",
    title: "Dr. Itemized Receipt",
    desc: "Generate itemized receipts for Dr. Klecker & Dr. Robbins.",
  },
  {
    path: "/pal-receipt",
    emoji: "🧾",
    title: "Pal Optical Receipt",
    desc: "Generate Pal Optical branded receipts.",
  },
  {
    path: "/lab-lens",
    emoji: "🔬",
    title: "Lab FSV Order Sheet",
    desc: "Order Vision Ease FSV lenses directly.",
  },
  {
    path: "/lens-avail",
    emoji: "📋",
    title: "Lens Availability",
    desc: "RX ranges for progressives and multifocals.",
  },
  {
    path: "/opticalc",
    emoji: "🧮",
    title: "Optician Calculator",
    desc: "Lens math, thickness visualizer, and retail tools.",
  },
  {
    path: "/quote",
    emoji: "💰",
    title: "PAL Quote Tool",
    desc: "Professional estimates for lenses and frames.",
  },
  {
    path: "/frames",
    emoji: "🕶️",
    title: "Frame Inventory",
    desc: "Full-service frame inventory management.",
  },
  {
    path: "/lens-guide",
    emoji: "🔍",
    title: "Lens Viewing Guide",
    desc: "Interactive visualizer for lens types and corridors.",
  },
  {
    path: "/docs",
    emoji: "📄",
    title: "Printable Documents",
    desc: "Patient info sheets and disclosure waivers.",
  },
  {
    path: "/opticalc-3d",
    emoji: "🔭",
    title: "Opticalc Pro 3D",
    desc: "Advanced 3D lens surfacing simulation.",
  },
  {
    path: "/optitrak",
    emoji: "🔄",
    title: "OptiTrak Remake Manager",
    desc: "Professional remake tracking for optical labs.",
  },
];

const externalTools = [
  {
    href: "https://optiview.vercel.app/",
    emoji: "👓",
    title: "OptiView Lens Catalog",
    desc: "Premium contact lens inventory management.",
  },
  {
    href: "https://opti-step.vercel.app/",
    emoji: "🎓",
    title: "OptiStep Academy",
    desc: "Optician training and certification courses.",
  },
  {
    href: "https://pal-optical-interactive-price-list-443610928945.us-west1.run.app/",
    emoji: "💵",
    title: "Interactive Price List",
    desc: "Real-time pricing and lens cost estimator.",
  },
];

export default function Dashboard() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${dark ? "bg-black text-white" : "bg-white text-black"}`}
    >
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="relative mb-10 text-center">
          <button
            onClick={() => setDark((d) => !d)}
            className={`absolute right-0 top-0 w-14 h-7 rounded-full transition-colors duration-300 ${dark ? "bg-blue-500" : "bg-gray-300"}`}
            aria-label="Toggle theme"
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 mx-1 ${dark ? "translate-x-7" : "translate-x-0"}`}
            />
          </button>
          <h1 className="text-3xl font-bold mb-2">
            Pal Optical Master Application
          </h1>
          <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Select an application below to get started in the lab or on the
            floor.
          </p>
        </div>

        {/* P.O.S.T. Flagship Card */}
        <Link
          to="/post"
          className="block mb-6 p-6 rounded-2xl border-2 border-yellow-400 hover:-translate-y-1 transition-transform shadow-lg relative overflow-hidden"
          style={{
            backgroundImage: "url(/POST.gif)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-50/90 to-orange-50/90 dark:from-yellow-900/90 dark:to-orange-900/90" />
          <div className="relative flex items-center gap-3">
            <span className="text-3xl">⭐</span>
            <div>
              <h2 className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
                P.O.S.T. Write-Ups
              </h2>
              <p
                className={`text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}
              >
                Flagship — New digital write-up system for store efficiency.
                Camera PD/Seg, 400+ lens catalog, Firebase sync.
              </p>
            </div>
            <span className="ml-auto text-yellow-500 text-2xl">→</span>
          </div>
        </Link>

        {/* Tool Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {internalTools.map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                dark
                  ? "bg-gray-900 border-gray-700 hover:border-gray-500"
                  : "bg-gray-50 border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="text-3xl mb-2">{tool.emoji}</div>
              <h3 className="font-bold text-base mb-1">{tool.title}</h3>
              <p
                className={`text-xs mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                {tool.desc}
              </p>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  dark
                    ? "bg-white text-black hover:bg-blue-400 hover:text-white"
                    : "bg-black text-white hover:bg-blue-500"
                }`}
              >
                Open App
              </span>
            </Link>
          ))}
          {externalTools.map((tool) => (
            <a
              key={tool.href}
              href={tool.href}
              target="_self"
              className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                dark
                  ? "bg-gray-900 border-gray-700 hover:border-gray-500"
                  : "bg-gray-50 border-gray-200 hover:border-gray-400"
              }`}
            >
              <div className="text-3xl mb-2">{tool.emoji}</div>
              <h3 className="font-bold text-base mb-1">{tool.title}</h3>
              <p
                className={`text-xs mb-4 ${dark ? "text-gray-400" : "text-gray-500"}`}
              >
                {tool.desc}
              </p>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  dark
                    ? "bg-white text-black hover:bg-blue-400 hover:text-white"
                    : "bg-black text-white hover:bg-blue-500"
                }`}
              >
                Open ↗
              </span>
            </a>
          ))}
        </div>

        <footer
          className={`text-center mt-10 text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}
        >
          Pal Optical Master App &mdash; jamesbrentlinger2026™
        </footer>
      </div>
    </div>
  );
}
