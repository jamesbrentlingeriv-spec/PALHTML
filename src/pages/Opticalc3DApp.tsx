import { Link } from "react-router-dom";

export default function Opticalc3DApp() {
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
          Opticalc Pro 3D
        </span>
      </div>
      <iframe
        src="https://opticalc-3d-lens-thickness-preview-443610928945.us-west1.run.app"
        className="flex-1 w-full border-none"
        title="Opticalc Pro 3D"
        allow="fullscreen"
      />
    </div>
  );
}
