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
import Opticalc3DPage from "./opticalc3d/App";
import OptiTrakApp from "./pages/OptiTrakApp";
import CMS1500Page from "./cms1500/CMS1500Page";
import WithSplashScreen from "./components/WithSplashScreen";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/post" element={<PostApp />} />
      <Route path="/contacts" element={<WithSplashScreen title="Contact Lens Orders"><ContactOrders /></WithSplashScreen>} />
      <Route path="/dr-receipt" element={<WithSplashScreen title="Dr. Itemized Receipt"><DrReceipt /></WithSplashScreen>} />
      <Route path="/pal-receipt" element={<WithSplashScreen title="Pal Optical Receipt"><PalReceipt /></WithSplashScreen>} />
      <Route path="/lab-lens" element={<WithSplashScreen title="Lab FSV Order Sheet"><LabLens /></WithSplashScreen>} />
      <Route path="/lens-avail" element={<WithSplashScreen title="Lens Availability"><LensAvail /></WithSplashScreen>} />
      <Route path="/opticalc" element={<WithSplashScreen title="Optician Calculator"><OptiCalc /></WithSplashScreen>} />
      <Route path="/quote" element={<WithSplashScreen title="PAL Quote Tool"><PalQuote /></WithSplashScreen>} />
      <Route path="/frames" element={<WithSplashScreen title="Frame Inventory"><FrameInventory /></WithSplashScreen>} />
      <Route path="/lens-guide" element={<WithSplashScreen title="Lens Viewing Guide"><LensGuide /></WithSplashScreen>} />
      <Route path="/docs" element={<WithSplashScreen title="Printable Documents"><PalDocs /></WithSplashScreen>} />
      <Route path="/opticalc-3d" element={<WithSplashScreen title="Opticalc Pro 3D"><Opticalc3DPage /></WithSplashScreen>} />
      <Route path="/optitrak" element={<WithSplashScreen title="OptiTrak Remake Manager"><OptiTrakApp /></WithSplashScreen>} />
      <Route path="/cms1500" element={<WithSplashScreen title="CMS-1500 Billing"><CMS1500Page /></WithSplashScreen>} />
    </Routes>
  );
}
