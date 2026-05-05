import { useState } from "react";
import SplashScreen from "./SplashScreen";

type Props = {
  title: string;
  children: React.ReactNode;
};

export default function WithSplashScreen({ title, children }: Props) {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen title={title} onDone={() => setShowSplash(false)} />;
  }

  return <>{children}</>;
}