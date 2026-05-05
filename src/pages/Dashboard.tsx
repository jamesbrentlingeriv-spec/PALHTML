import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// Define types for our tools
type InternalTool = {
  path: string;
  emoji: string;
  title: string;
  desc: string;
};

type ExternalTool = {
  href: string;
  emoji: string;
  title: string;
  desc: string;
};

type Tool = InternalTool | ExternalTool;

// Doctor's Side Tools
const doctorsSideTools: Tool[] = [
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
    href: "https://doctor-fee-slip-pro-1069426498989.us-west1.run.app/",
    emoji: "📝",
    title: "Dr. Fee Slip",
    desc: "Generate and track patient fee slips.",
  },
];

// Inventory Tools
const inventoryTools: Tool[] = [
  {
    path: "/frames",
    emoji: "🕶️",
    title: "Frame Inventory",
    desc: "Full-service frame inventory management.",
  },
  {
    path: "/lab-lens",
    emoji: "🔬",
    title: "Lab FSV Order Sheet",
    desc: "Order Vision Ease FSV lenses directly.",
  },
];

// Pal Docs Tools
const palDocsTools: Tool[] = [
  {
    path: "/pal-receipt",
    emoji: "🧾",
    title: "Pal Optical Receipt",
    desc: "Generate Pal Optical branded receipts.",
  },
  {
    path: "/cms1500",
    emoji: "🏥",
    title: "CMS-1500 Billing",
    desc: "Medical billing form generator for clinical systems.",
  },
  {
    path: "/docs",
    emoji: "📄",
    title: "Printable Documents",
    desc: "Patient info sheets and disclosure waivers.",
  },
  {
    href: "https://pal-optical-interactive-price-list-443610928945.us-west1.run.app/",
    emoji: "💵",
    title: "Interactive Price List",
    desc: "Real-time pricing and lens cost estimator.",
  },
];

// Opti Apps Tools
const optiAppsTools: Tool[] = [
  {
    path: "/opticalc",
    emoji: "🧮",
    title: "Optician Calculator",
    desc: "Lens math, thickness visualizer, and retail tools.",
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
];

// Additional tools that don't fit in the main categories
const otherTools: Tool[] = [
  {
    path: "/lens-avail",
    emoji: "📋",
    title: "Lens Availability",
    desc: "RX ranges for progressives and multifocals.",
  },
  {
    path: "/quote",
    emoji: "💰",
    title: "PAL Quote Tool",
    desc: "Professional estimates for lenses and frames.",
  },
  {
    path: "/lens-guide",
    emoji: "🔍",
    title: "Lens Viewing Guide",
    desc: "Interactive visualizer for lens types and corridors.",
  },
];

// Define type for expanded sections
type ExpandedSections = {
  [key: string]: boolean;
}

export default function Dashboard() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark",
  );
  
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    doctorsSide: true,
    inventory: true,
    palDocs: true,
    optiApps: true,
    others: true
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${dark ? "theme-dark bg-black text-white" : "bg-white text-black"}`}
    >
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="relative mb-10 text-center">
          <button
            onClick={() => setDark((d) => !d)}
            className={`absolute right-0 top-0 w-14 h-7 rounded-full transition-colors duration-300 ${dark ? "bg-white/20" : "bg-gray-300"}`}
            aria-label="Toggle theme"
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 mx-1 ${dark ? "translate-x-7" : "translate-x-0"}`}
            />
          </button>
          <h1 className={`text-3xl font-bold mb-2 ${dark ? "text-white" : ""}`}>
            Pal Optical Master Application
          </h1>
          <p className={`text-sm ${dark ? "text-theme-muted" : "text-gray-500"}`}>
            Select an application below to get started in the lab or on the
            floor.
          </p>
        </div>

        {/* P.O.S.T. Flagship Card */}
        <Link
          to="/post"
          className={`block mb-6 rounded-2xl hover:-translate-y-1 transition-transform shadow-lg relative overflow-hidden h-80 w-full bg-cover bg-center bg-no-repeat ${dark ? "border-8 border-white" : "border-8 border-black"}`}
          style={{
            backgroundImage: "url('/post.png')",
          }}
          aria-label="P.O.S.T. Optical Slip Tool"
        />

        {/* Tool Sections */}
        <div className="space-y-6">
          {/* Doctors Side Section */}
          <div className={`rounded-2xl border ${dark ? "bg-theme-card border-theme-border" : "bg-gray-50 border-gray-200"}`}>
            <button
              className={`w-full p-4 text-left flex justify-between items-center font-bold text-lg ${dark ? "hover:bg-white/10" : "hover:bg-gray-100"} rounded-2xl`}
              onClick={() => toggleSection('doctorsSide')}
            >
              <span>Doctor's Side</span>
              <span>{expandedSections.doctorsSide ? '▲' : '▼'}</span>
            </button>
            
            {expandedSections.doctorsSide && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
                {doctorsSideTools.map((tool: Tool, index) => {
                  // Check if the tool has an href property to determine if it's an external tool
                  if ('href' in tool) {
                    return (
                      <a
                        key={`${tool.title}-${index}`}
                        href={tool.href}
                        target="_self"
                        className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                          dark
                            ? "bg-theme-card border-theme-border hover:border-white"
                            : "bg-gray-50 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-3xl mb-2">{tool.emoji}</div>
                        <h3 className="font-bold text-base mb-1">{tool.title}</h3>
                        <p
                          className={`text-xs mb-4 ${dark ? "text-theme-muted" : "text-gray-500"}`}
                        >
                          {tool.desc}
                        </p>
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            dark
                              ? "bg-white text-black hover:bg-gray-300"
                              : "bg-black text-white hover:bg-blue-500"
                          }`}
                        >
                          Open ↗
                        </span>
                      </a>
                    );
                  } else {
                    return (
                      <Link
                        key={`${tool.path}-${index}`}
                        to={tool.path}
                        className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                          dark
                            ? "bg-theme-card border-theme-border hover:border-white"
                            : "bg-gray-50 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-3xl mb-2">{tool.emoji}</div>
                        <h3 className="font-bold text-base mb-1">{tool.title}</h3>
                        <p
                          className={`text-xs mb-4 ${dark ? "text-theme-muted" : "text-gray-500"}`}
                        >
                          {tool.desc}
                        </p>
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            dark
                              ? "bg-white text-black hover:bg-gray-300"
                              : "bg-black text-white hover:bg-blue-500"
                          }`}
                        >
                          Open App
                        </span>
                      </Link>
                    );
                  }
                })}
              </div>
            )}
          </div>

          {/* Inventory Section */}
          <div className={`rounded-2xl border ${dark ? "bg-theme-card border-theme-border" : "bg-gray-50 border-gray-200"}`}>
            <button
              className={`w-full p-4 text-left flex justify-between items-center font-bold text-lg ${dark ? "hover:bg-white/10" : "hover:bg-gray-100"} rounded-2xl`}
              onClick={() => toggleSection('inventory')}
            >
              <span>Inventory</span>
              <span>{expandedSections.inventory ? '▲' : '▼'}</span>
            </button>
            
            {expandedSections.inventory && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
                {inventoryTools.map((tool: Tool, index) => {
                  if ('href' in tool) {
                    return (
                      <a
                        key={`${tool.title}-${index}`}
                        href={tool.href}
                        target="_self"
                        className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                          dark
                            ? "bg-theme-card border-theme-border hover:border-white"
                            : "bg-gray-50 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-3xl mb-2">{tool.emoji}</div>
                        <h3 className="font-bold text-base mb-1">{tool.title}</h3>
                        <p
                          className={`text-xs mb-4 ${dark ? "text-theme-muted" : "text-gray-500"}`}
                        >
                          {tool.desc}
                        </p>
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            dark
                              ? "bg-white text-black hover:bg-gray-300"
                              : "bg-black text-white hover:bg-blue-500"
                          }`}
                        >
                          Open ↗
                        </span>
                      </a>
                    );
                  } else {
                    return (
                      <Link
                        key={`${tool.path}-${index}`}
                        to={tool.path}
                        className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                          dark
                            ? "bg-theme-card border-theme-border hover:border-white"
                            : "bg-gray-50 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-3xl mb-2">{tool.emoji}</div>
                        <h3 className="font-bold text-base mb-1">{tool.title}</h3>
                        <p
                          className={`text-xs mb-4 ${dark ? "text-theme-muted" : "text-gray-500"}`}
                        >
                          {tool.desc}
                        </p>
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            dark
                              ? "bg-white text-black hover:bg-gray-300"
                              : "bg-black text-white hover:bg-blue-500"
                          }`}
                        >
                          Open App
                        </span>
                      </Link>
                    );
                  }
                })}
              </div>
            )}
          </div>

          {/* Pal Docs Section */}
          <div className={`rounded-2xl border ${dark ? "bg-theme-card border-theme-border" : "bg-gray-50 border-gray-200"}`}>
            <button
              className={`w-full p-4 text-left flex justify-between items-center font-bold text-lg ${dark ? "hover:bg-white/10" : "hover:bg-gray-100"} rounded-2xl`}
              onClick={() => toggleSection('palDocs')}
            >
              <span>Pal Docs</span>
              <span>{expandedSections.palDocs ? '▲' : '▼'}</span>
            </button>
            
            {expandedSections.palDocs && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
                {palDocsTools.map((tool: Tool, index) => {
                  if ('href' in tool) {
                    return (
                      <a
                        key={`${tool.title}-${index}`}
                        href={tool.href}
                        target="_self"
                        className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                          dark
                            ? "bg-theme-card border-theme-border hover:border-white"
                            : "bg-gray-50 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-3xl mb-2">{tool.emoji}</div>
                        <h3 className="font-bold text-base mb-1">{tool.title}</h3>
                        <p
                          className={`text-xs mb-4 ${dark ? "text-theme-muted" : "text-gray-500"}`}
                        >
                          {tool.desc}
                        </p>
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            dark
                              ? "bg-white text-black hover:bg-gray-300"
                              : "bg-black text-white hover:bg-blue-500"
                          }`}
                        >
                          Open ↗
                        </span>
                      </a>
                    );
                  } else {
                    return (
                      <Link
                        key={`${tool.path}-${index}`}
                        to={tool.path}
                        className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                          dark
                            ? "bg-theme-card border-theme-border hover:border-white"
                            : "bg-gray-50 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-3xl mb-2">{tool.emoji}</div>
                        <h3 className="font-bold text-base mb-1">{tool.title}</h3>
                        <p
                          className={`text-xs mb-4 ${dark ? "text-theme-muted" : "text-gray-500"}`}
                        >
                          {tool.desc}
                        </p>
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            dark
                              ? "bg-white text-black hover:bg-gray-300"
                              : "bg-black text-white hover:bg-blue-500"
                          }`}
                        >
                          Open App
                        </span>
                      </Link>
                    );
                  }
                })}
              </div>
            )}
          </div>

          {/* Opti Apps Section */}
          <div className={`rounded-2xl border ${dark ? "bg-theme-card border-theme-border" : "bg-gray-50 border-gray-200"}`}>
            <button
              className={`w-full p-4 text-left flex justify-between items-center font-bold text-lg ${dark ? "hover:bg-white/10" : "hover:bg-gray-100"} rounded-2xl`}
              onClick={() => toggleSection('optiApps')}
            >
              <span>Opti Apps</span>
              <span>{expandedSections.optiApps ? '▲' : '▼'}</span>
            </button>
            
            {expandedSections.optiApps && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
                {optiAppsTools.map((tool: Tool, index) => {
                  if ('href' in tool) {
                    return (
                      <a
                        key={`${tool.title}-${index}`}
                        href={tool.href}
                        target="_self"
                        className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                          dark
                            ? "bg-theme-card border-theme-border hover:border-white"
                            : "bg-gray-50 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-3xl mb-2">{tool.emoji}</div>
                        <h3 className="font-bold text-base mb-1">{tool.title}</h3>
                        <p
                          className={`text-xs mb-4 ${dark ? "text-theme-muted" : "text-gray-500"}`}
                        >
                          {tool.desc}
                        </p>
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            dark
                              ? "bg-white text-black hover:bg-gray-300"
                              : "bg-black text-white hover:bg-blue-500"
                          }`}
                        >
                          Open ↗
                        </span>
                      </a>
                    );
                  } else {
                    return (
                      <Link
                        key={`${tool.path}-${index}`}
                        to={tool.path}
                        className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                          dark
                            ? "bg-theme-card border-theme-border hover:border-white"
                            : "bg-gray-50 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-3xl mb-2">{tool.emoji}</div>
                        <h3 className="font-bold text-base mb-1">{tool.title}</h3>
                        <p
                          className={`text-xs mb-4 ${dark ? "text-theme-muted" : "text-gray-500"}`}
                        >
                          {tool.desc}
                        </p>
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            dark
                              ? "bg-white text-black hover:bg-gray-300"
                              : "bg-black text-white hover:bg-blue-500"
                          }`}
                        >
                          Open App
                        </span>
                      </Link>
                    );
                  }
                })}
              </div>
            )}
          </div>

          {/* Other Tools Section */}
          <div className={`rounded-2xl border ${dark ? "bg-theme-card border-theme-border" : "bg-gray-50 border-gray-200"}`}>
            <button
              className={`w-full p-4 text-left flex justify-between items-center font-bold text-lg ${dark ? "hover:bg-white/10" : "hover:bg-gray-100"} rounded-2xl`}
              onClick={() => toggleSection('others')}
            >
              <span>Other Tools</span>
              <span>{expandedSections.others ? '▲' : '▼'}</span>
            </button>
            
            {expandedSections.others && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5">
                {otherTools.map((tool: Tool, index) => {
                  if ('href' in tool) {
                    return (
                      <a
                        key={`${tool.title}-${index}`}
                        href={tool.href}
                        target="_self"
                        className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                          dark
                            ? "bg-theme-card border-theme-border hover:border-white"
                            : "bg-gray-50 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-3xl mb-2">{tool.emoji}</div>
                        <h3 className="font-bold text-base mb-1">{tool.title}</h3>
                        <p
                          className={`text-xs mb-4 ${dark ? "text-theme-muted" : "text-gray-500"}`}
                        >
                          {tool.desc}
                        </p>
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            dark
                              ? "bg-white text-black hover:bg-gray-300"
                              : "bg-black text-white hover:bg-blue-500"
                          }`}
                        >
                          Open ↗
                        </span>
                      </a>
                    );
                  } else {
                    return (
                      <Link
                        key={`${tool.path}-${index}`}
                        to={tool.path}
                        className={`p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-lg ${
                          dark
                            ? "bg-theme-card border-theme-border hover:border-white"
                            : "bg-gray-50 border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="text-3xl mb-2">{tool.emoji}</div>
                        <h3 className="font-bold text-base mb-1">{tool.title}</h3>
                        <p
                          className={`text-xs mb-4 ${dark ? "text-theme-muted" : "text-gray-500"}`}
                        >
                          {tool.desc}
                        </p>
                        <span
                          className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
                            dark
                              ? "bg-white text-black hover:bg-gray-300"
                              : "bg-black text-white hover:bg-blue-500"
                          }`}
                        >
                          Open App
                        </span>
                      </Link>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </div>

        <footer
          className={`text-center mt-10 text-xs ${dark ? "text-theme-muted" : "text-gray-500"}`}
        >
          Pal Optical Master App &mdash; jamesbrentlinger2026™
        </footer>
      </div>
    </div>
  );
}
