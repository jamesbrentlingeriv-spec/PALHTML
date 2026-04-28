import { useState, useEffect } from "react";

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setOpacity(0), 2500);
    const doneTimer = setTimeout(() => onDone(), 3300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center transition-opacity duration-[800ms]"
      style={{ opacity }}
    >
      <video
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        src="/POST.mp4"
      />
    </div>
  );
}
