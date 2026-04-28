import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ContactOrders from './pages/ContactOrders'
import DrReceipt from './pages/DrReceipt'
import PalReceipt from './pages/PalReceipt'
import LabLens from './pages/LabLens'
import LensAvail from './pages/LensAvail'
import OptiCalc from './pages/OptiCalc'
import PalQuote from './pages/PalQuote'
import FrameInventory from './pages/FrameInventory'
import LensGuide from './pages/LensGuide'
import PalDocs from './pages/PalDocs'
import PostApp from './pages/post/App'
import OptiViewApp from './pages/OptiViewApp'
import Opticalc3DApp from './pages/Opticalc3DApp'
import OptiTrakApp from './pages/OptiTrakApp'

export default function App() {
  return (
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
      <Route path="/optiview" element={<OptiViewApp />} />
      <Route path="/opticalc-3d" element={<Opticalc3DApp />} />
      <Route path="/optitrak" element={<OptiTrakApp />} />
    </Routes>
  )
}