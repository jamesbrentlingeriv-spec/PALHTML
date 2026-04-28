import { useState } from 'react'
import BackButton from '../components/BackButton'

interface LensItem { name: string; price: number }
interface CartItem { name: string; price: number }

const PRICE_LIST: Record<string, LensItem[]> = {
  "Plastic (CR-39)": [
    { name: "Plano", price: 35 }, { name: "Single Vision Plastic", price: 50 }, { name: "Eyezen (+0-+4)", price: 125 },
    { name: "Flat Top 28 Bifocal", price: 140 }, { name: "Flat Top 35 Bifocal", price: 145 }, { name: "Trifocal 7x28", price: 165 },
    { name: "Varilux Comfort DRx", price: 365 }, { name: "Varilux Physio DRx", price: 390 }, { name: "Varilux X", price: 530 },
    { name: "Shamir Autograph III", price: 465 }, { name: "VSP Unity VIA", price: 350 }, { name: "Younger Image", price: 255 },
  ],
  "Polycarbonate": [
    { name: "Single Vision POLY", price: 115 }, { name: "Flat Top 28 Bifocal POLY", price: 180 }, { name: "Trifocal 7x28 POLY", price: 205 },
    { name: "Varilux Comfort DRx POLY", price: 405 }, { name: "Varilux X POLY", price: 570 }, { name: "Shamir Autograph III POLY", price: 505 },
    { name: "VSP Unity VIA POLY", price: 410 }, { name: "Younger Image POLY", price: 295 },
  ],
  "Trivex": [
    { name: "Single Vision TRIVEX", price: 150 }, { name: "Flat Top 28 Bifocal TRIVEX", price: 205 }, { name: "Varilux X TRIVEX", price: 630 },
  ],
  "High-Index": [
    { name: "Single Vision 1.67", price: 365 }, { name: "Single Vision 1.74", price: 400 }, { name: "Varilux X 1.67", price: 825 },
    { name: "Shamir Autograph III 1.67", price: 625 },
  ],
  "Glass": [
    { name: "Single Vision GLASS", price: 175 }, { name: "FT-28 GLASS", price: 285 }, { name: "7x-28 GLASS", price: 345 },
  ],
  "Transitions Plastic": [
    { name: "Single Vision TRANS", price: 235 }, { name: "Varilux X TRANS", price: 640 }, { name: "Younger Image TRANS", price: 365 },
  ],
  "Transitions Poly": [
    { name: "Single Vision TRANS POLY", price: 275 }, { name: "Varilux X TRANS POLY", price: 690 },
  ],
  "Polarized Plastic": [
    { name: "Single Vision POLARIZED", price: 175 }, { name: "KBCO Single Vision POLARIZED", price: 250 }, { name: "Younger Image POLARIZED", price: 400 },
  ],
  "Tints and Coatings": [
    { name: "Standard A/R", price: 85 }, { name: "Crizal Rock", price: 215 }, { name: "Blue Light", price: 40 }, { name: "Tint", price: 20 },
  ],
  "Miscellaneous": [
    { name: "Slab Off", price: 185 }, { name: "Drill Mount", price: 40 }, { name: "Roll and Polish", price: 45 },
  ],
}

const MEDICAID_ALLOWED = ["Single Vision Plastic", "Single Vision POLY", "Younger Image", "Younger Image POLY"]

export default function PalQuote() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [insurance, setInsurance] = useState('None')
  const [copay, setCopay] = useState('')
  const [patient, setPatient] = useState('')
  const [optician, setOptician] = useState('')
  const [notes, setNotes] = useState('')
  const [cart, setCart] = useState<CartItem[]>([])
  const [taxEnabled, setTaxEnabled] = useState(false)
  const [frameName, setFrameName] = useState('')
  const [framePrice, setFramePrice] = useState('')
  const [frameAllowance, setFrameAllowance] = useState('')

  const addToCart = (item: CartItem) => setCart(c => [...c, item])
  const removeFromCart = (i: number) => setCart(c => c.filter((_, idx) => idx !== i))

  const addWithInsurance = (name: string, price: number) => {
    if (insurance === 'MEDICAID') { addToCart({ name: `${name} (Covered)`, price: 0 }); return }
    const cp = parseFloat(copay)
    if (isNaN(cp)) { alert('Enter a copay amount first!'); return }
    addToCart({ name: `${name} (Retail)`, price })
    addToCart({ name: `  ↳ Insurance Benefit`, price: -price })
    addToCart({ name: `  ↳ Copay`, price: cp })
  }

  const addFrame = () => {
    const retail = parseFloat(framePrice)
    if (isNaN(retail)) { alert('Enter frame retail price!'); return }
    if (insurance === 'None') { addToCart({ name: `Frame: ${frameName || 'Frame'}`, price: retail }) }
    else {
      addToCart({ name: `Frame: ${frameName || 'Frame'} (Retail)`, price: retail })
      const allow = parseFloat(frameAllowance) || 0
      if (allow > 0) addToCart({ name: `  ↳ Insurance Allowance`, price: -Math.min(allow, retail) })
    }
    setFrameName(''); setFramePrice(''); setFrameAllowance('')
  }

  const subtotal = cart.reduce((s, i) => s + i.price, 0)
  const tax = taxEnabled ? Math.max(0, subtotal) * 0.06 : 0
  const total = subtotal + tax

  const categories = ['All', ...Object.keys(PRICE_LIST)]
  const term = search.toLowerCase()

  const inp = 'w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500'

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <BackButton />

      {/* Catalog */}
      <div className="flex-1 p-5 overflow-y-auto border-r border-gray-200 mt-10">
        <header className="mb-5 border-b-2 border-gray-800 pb-3">
          <h1 className="text-2xl font-bold text-gray-800">Pal Optical</h1>
          <p className="text-gray-500 text-sm">Lens Price List & Estimator</p>
        </header>
        <input className={`${inp} mb-4`} placeholder="Search lenses..." value={search} onChange={e => setSearch(e.target.value)} />
        <div className="flex flex-wrap gap-2 mb-5">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${category === cat ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-600'}`}>{cat}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(PRICE_LIST).map(([cat, items]) => {
            if (category !== 'All' && category !== cat) return null
            const filtered = items.filter(i => i.name.toLowerCase().includes(term) || cat.toLowerCase().includes(term))
              .filter(i => insurance !== 'MEDICAID' || MEDICAID_ALLOWED.includes(i.name.trim()))
            if (!filtered.length) return null
            return filtered.map(item => (
              <div key={item.name} onClick={() => addToCart({ name: item.name, price: item.price })} className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition-all border-l-4 border-blue-400 flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-sm text-gray-800 mb-1">{item.name}</div>
                  <div className="text-green-600 font-bold text-base mb-2">${item.price.toFixed(2)}</div>
                </div>
                {insurance !== 'None' && (
                  <button onClick={e => { e.stopPropagation(); addWithInsurance(item.name, item.price) }} className="bg-green-600 text-white text-xs py-1 rounded font-bold hover:bg-green-700">
                    {insurance === 'MEDICAID' ? '+ Covered' : '+ Add w/ Copay'}
                  </button>
                )}
              </div>
            ))
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-96 bg-white p-5 flex flex-col shadow-lg overflow-y-auto">
        <div className="mb-3">
          <h3 className="font-bold text-sm text-gray-700 mb-1">Patient</h3>
          <input className={inp} placeholder="Patient Full Name" value={patient} onChange={e => setPatient(e.target.value)} />
        </div>
        <div className="mb-3">
          <h3 className="font-bold text-sm text-gray-700 mb-1">Optician</h3>
          <select className={inp} value={optician} onChange={e => setOptician(e.target.value)}>
            <option value="">Select Optician</option>
            {['April','Bobbi','Carribyan','James','Linda','Tracy','Sabrina'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <h3 className="font-bold text-sm text-gray-700 mb-1">Insurance Plan</h3>
          <select className={inp} value={insurance} onChange={e => setInsurance(e.target.value)}>
            <option value="None">Private Pay / None</option>
            {['EYE-MED','VSP','SPECTERA','EYESYNERGY','PREMIER VISION','NVA','UNUM','MEDICAID'].map(i => <option key={i}>{i}</option>)}
          </select>
          {insurance !== 'None' && insurance !== 'MEDICAID' && (
            <input className={`${inp} mt-2`} type="number" placeholder="Item Copay $" value={copay} onChange={e => setCopay(e.target.value)} />
          )}
        </div>
        <hr className="my-3" />
        <div className="mb-3">
          <h3 className="font-bold text-sm text-gray-700 mb-1">Add Frame</h3>
          <div className="flex gap-2 mb-2">
            <input className={inp} placeholder="Model/Brand" value={frameName} onChange={e => setFrameName(e.target.value)} />
            <input className={`${inp} w-24`} type="number" placeholder="Retail $" value={framePrice} onChange={e => setFramePrice(e.target.value)} />
          </div>
          {insurance !== 'None' && insurance !== 'MEDICAID' && (
            <input className={`${inp} mb-2`} type="number" placeholder="Allowance $" value={frameAllowance} onChange={e => setFrameAllowance(e.target.value)} />
          )}
          <button onClick={addFrame} className="w-full py-2 bg-gray-500 text-white rounded font-bold text-sm hover:bg-gray-600">+ Add Frame</button>
        </div>
        <hr className="my-3" />
        <div className="mb-2">
          <h3 className="font-bold text-sm text-gray-700 mb-1">Notes</h3>
          <textarea className={`${inp} resize-y min-h-16`} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Lab instructions..." />
        </div>
        <hr className="my-3" />
        <div className="font-bold text-gray-800 border-b-2 border-gray-800 pb-2 mb-2">Job Estimation</div>
        {patient && <div className="font-bold text-sm mb-1">Patient: {patient}</div>}
        {optician && <div className="text-blue-600 text-sm font-semibold mb-1">Optician: {optician}</div>}
        <div className="text-blue-600 text-sm font-semibold mb-3">Plan: {insurance === 'None' ? 'Private Pay' : insurance}</div>
        <div className="flex-1 overflow-y-auto space-y-1 mb-3">
          {cart.length === 0 ? <div className="text-gray-300 text-center mt-4 text-sm">No items selected</div> : cart.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm py-1 border-b border-gray-100">
              <div><span onClick={() => removeFromCart(i)} className="text-red-500 cursor-pointer font-bold mr-2">×</span>{item.name}</div>
              <div className={`font-bold min-w-16 text-right ${item.price < 0 ? 'text-red-500' : ''}`}>${item.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-gray-800 pt-3 space-y-2">
          <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
          {taxEnabled && <div className="flex justify-between text-sm text-orange-500"><span>Tax (6%)</span><span>${tax.toFixed(2)}</span></div>}
          <div className="flex justify-between text-2xl font-bold text-gray-800"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <button onClick={() => setTaxEnabled(t => !t)} className="w-full py-2 bg-orange-500 text-white rounded font-bold text-sm hover:bg-orange-600">{taxEnabled ? 'Remove Tax' : 'Add Tax (6%)'}</button>
          <button onClick={() => { setCart([]); setPatient(''); setOptician(''); setNotes('') }} className="w-full py-2 bg-gray-400 text-white rounded font-bold text-sm hover:bg-gray-500">Reset Quote</button>
          <button onClick={() => window.print()} className="w-full py-2 bg-blue-600 text-white rounded font-bold text-sm hover:bg-blue-700">Print Quote</button>
        </div>
        <p className="text-center text-xs text-gray-300 mt-3">jamesbrentlinger2026™</p>
      </div>
    </div>
  )
}
