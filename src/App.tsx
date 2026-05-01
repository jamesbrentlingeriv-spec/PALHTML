import { useState, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ContactOrders from "./pages/ContactOrders";
import DrReceipt from "./pages/DrReceipt";
import PalReceipt from "./pages/PalReceipt";
import LabLens from "./pages/LabLens";
import LensAvail from "./pages/LensAvail";
import OptiCalc from "./pages/OptiCalc";
import PalQuote from "./pages/PalQuote";
import FrameInventory from "./pages/FrameInventory";
import LensGuide from "./pages/LensGuide";
import PalDocs from "./pages/PalDocs";
import PostApp from "./pages/post/App";
import Opticalc3DPage from "./opticalc3d/App";  // Updated import
import OptiTrakApp from "./pages/OptiTrakApp";
import CMS1500Page from "./cms1500/CMS1500Page";
import SplashScreen from "./components/SplashScreen";


export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const handleSplashDone = useCallback(() => setShowSplash(false), []);

  return (
    <>
      {showSplash && <SplashScreen onDone={handleSplashDone} />}
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/post" element={<PostApp />} />
        <Route path="/contacts" element={<ContactOrders />} />
        <Route path="/dr-receipt" element={<DrReceipt />} />
        <Route path="/pal-receipt" element={<PalReceipt />} />
        <Route path="/lab-lens" element={<LabLens />} />
        <Route path="/lens-avail" element={<LensAvail />} />
        <Route path="/opticalc" element={<OptiCalc />} />
        <Route path="/quote" element={<PalQuote />} />
        <Route path="/frames" element={<FrameInventory />} />
        <Route path="/lens-guide" element={<LensGuide />} />
        <Route path="/docs" element={<PalDocs />} />
        <Route path="/opticalc-3d" element={<Opticalc3DPage />} />  // Updated route
                <Route path="/optitrak" element={<OptiTrakApp />} />
        <Route path="/cms1500" element={<CMS1500Page />} />
      </Routes>

    </>
  );
}