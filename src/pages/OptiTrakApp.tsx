import { Link } from "react-router-dom";

export default function OptiTrakApp() {
  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="shrink-0 h-14 bg-black border-b border-gray-800 flex items-center px-6 gap-4">
        <Link
          to="/"
          className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
        >
          ← Back to Dashboard
        </Link>
        <span className="text-gray-700">|</span>
        <span className="text-sm font-semibold text-white">
          OptiTrak Remake Manager
        </span>
      </div>
      <iframe
        src="https://jamesbrentlingeriv-spec.github.io/OPTITRAK/"
        className="flex-1 w-full border-none"
        title="OptiTrak Remake Manager"
        allow="fullscreen"
      />
    </div>
  );
}