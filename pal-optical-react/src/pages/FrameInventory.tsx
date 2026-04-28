import { useState } from 'react'
import BackButton from '../components/BackButton'

interface Frame { id: number; mfg: string; brand: string; model: string; color: string; code: string; qty: string; eye: string; bridge: string; temple: string; wholesale: string; retail: string; dateAdded: string }

const BRANDS: Record<string, string[]> = {
  "Luxottica": ["Ray-Ban", "Michael Kors"],
  "Altair": ["Anne Klein", "McAllister", "Bebe", "Altair", "Genesis", "Calvin Klein Jeans"],
  "Marchon Eye-envy": ["Nike", "Longchamp", "Lacoste"],
  "Modern Optical": ["Modern", "Modern Art", "Modz", "GVX", "ModzFlex", "Genevieve Boutique"],
  "Smilen": ["Smilen Elite", "Times Square", "A-List RC", "NYC4U", "Gotham Flex", "Broadway Flex"],
  "Clearvision": ["Advantage CVO", "CVO Eyewear", "Ellen Tracy", "Jessica McClintock", "OP"],
  "New York Eye": ["Ernest Hemingway", "Marie Claire", "Joan Collins", "Lumax"],
  "Visual Eyes": ["Tots"],
  "Zyloware": ["Daisy Fuentes", "Gloria Vanderbuilt", "Halston", "Sophia Loren", "Stetson", "Via Spiga"],
}

export default function FrameInventory() {
  const [dark, setDark] = useState(false)
  const [mfg, setMfg] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [color, setColor] = useState('')
  const [code, setCode] = useState('')
  const [qty, setQty] = useState('1')
  const [eye, setEye] = useState('')
  const [bridge, setBridge] = useState('')
  const [temple, setTemple] = useState('')
  const [wholesale, setWholesale] = useState('')
  const [retail, setRetail] = useState('')
  const [session, setSession] = useState<Frame[]>([])

  const save = () => {
    if (!mfg || !brand || !model || !wholesale || !retail) { alert('Missing required info!'); return }
    setSession(s => [...s, { id: Date.now(), mfg, brand, model, color: color || 'N/A', code: code || 'N/A', qty, eye: eye || '0', bridge: bridge || '0', temple: temple || '0', wholesale: parseFloat(wholesale).toFixed(2), retail: parseFloat(retail).toFixed(2), dateAdded: new Date().toLocaleString() }])
    setModel(''); setColor(''); setCode('')
  }

  const bg = dark ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-800'
  const card = dark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-200'
  const inp = `w-full px-3 py-2 border rounded-lg text-sm outline-none ${dark ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300 text-gray-800'}`

  return (
    <div className={`min-h-screen ${bg} flex justify-center p-5 transition-colors`}>
      <BackButton />
      <div className={`w-full max-w-2xl ${card} border-2 rounded-2xl p-6 shadow-lg relative`}>
        <button onClick={() => setDark(d => !d)} className={`absolute top-4 right-4 w-10 h-10 rounded-full border flex items-center justify-center text-lg ${card}`}>{dark ? '☀️' : '🌙'}</button>
        <h1 className="text-2xl font-black text-center mb-1">Pal Optical Frame Inventory</h1>
        <p className="text-center text-xs text-gray-400 mb-5">jamesbrentlinger2026™</p>

        <div className={`${dark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl p-4 mb-5 border ${dark ? 'border-gray-600' : 'border-gray-200'}`}>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-xs font-bold block mb-1">Manufacturer</label>
              <select className={inp} value={mfg} onChange={e => { setMfg(e.target.value); setBrand('') }}>
                <option value="">-- Select --</option>
                {Object.keys(BRANDS).sort().map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Brand</label>
              <select className={inp} value={brand} onChange={e => setBrand(e.target.value)}>
                <option value="">-- Choose Mfg --</option>
                {(BRANDS[mfg] || []).sort().map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div><label className="text-xs font-bold block mb-1">Model #</label><input className={inp} value={model} onChange={e => setModel(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div><label className="text-xs font-bold block mb-1">Color</label><input className={inp} value={color} onChange={e => setColor(e.target.value)} /></div>
            <div><label className="text-xs font-bold block mb-1">Color Code</label><input className={inp} value={code} onChange={e => setCode(e.target.value)} /></div>
            <div><label className="text-xs font-bold block mb-1">Qty</label><input type="number" className={inp} value={qty} onChange={e => setQty(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div><label className="text-xs font-bold block mb-1">Eye</label><input type="number" className={inp} value={eye} onChange={e => setEye(e.target.value)} /></div>
            <div><label className="text-xs font-bold block mb-1">Bridge</label><input type="number" className={inp} value={bridge} onChange={e => setBridge(e.target.value)} /></div>
            <div><label className="text-xs font-bold block mb-1">Temple</label><input type="number" className={inp} value={temple} onChange={e => setTemple(e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div><label className="text-xs font-bold block mb-1">Wholesale ($)</label><input type="number" className={inp} step="0.01" value={wholesale} onChange={e => setWholesale(e.target.value)} /></div>
            <div><label className="text-xs font-bold block mb-1">Retail ($)</label><input type="number" className={inp} step="0.01" value={retail} onChange={e => setRetail(e.target.value)} /></div>
          </div>
          <button onClick={save} className="w-full py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors">Import to Session 📥</button>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold">Session Items <span className={`text-xs px-3 py-1 rounded-full ${dark ? 'bg-gray-700' : 'bg-gray-100'}`}>{session.length} New</span></h3>
          </div>
          <div className="max-h-80 overflow-y-auto space-y-2">
            {session.slice().reverse().map(f => (
              <div key={f.id} className={`flex justify-between items-center p-3 rounded-lg border-l-4 border-black ${dark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                <div>
                  <div className="font-bold text-sm">{f.brand} {f.model}</div>
                  <div className="text-xs text-gray-400">{f.mfg} | {f.color}</div>
                </div>
                <div className="text-right">
                  <div className="text-green-600 font-bold">${f.retail}</div>
                  <div className="text-xs text-gray-400">Qty: {f.qty}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
