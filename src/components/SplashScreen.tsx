import { useState, useEffect } from "react";

type SplashScreenProps = {
  title: string;
  onDone: () => void;
};

export default function SplashScreen({ title, onDone }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const duration = 2500; // 2.5 seconds
    const interval = 16; // ~60fps for smooth animation
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setFading(true);
        setTimeout(() => onDone(), 400); // fade out then call onDone
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center transition-opacity duration-[400ms] ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <h1 className="text-white text-2xl font-bold mb-8 select-none">
        {title}
      </h1>
      <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-white rounded-full transition-all duration-[16ms] ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}