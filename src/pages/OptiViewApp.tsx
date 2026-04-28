import { Link } from "react-router-dom";

export default function OptiViewApp() {
  return (
    <div className="flex flex-col h-screen bg-[#090909]">
      <div className="shrink-0 h-14 bg-[#090909] border-b border-white/10 flex items-center px-6 gap-4">
        <Link
          to="/"
          className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Dashboard
        </Link>
        <span className="text-white/10">|</span>
        <span className="text-sm font-semibold text-white tracking-tight">
          OPTI<span className="italic">VIEW</span> Lens Catalog
        </span>
      </div>
      <iframe
        src="/optiview/index.html"
        className="flex-1 w-full border-none"
        title="OptiView Lens Catalog"
        allow="fullscreen"
      />
    </div>
  );
}
