import { useState } from 'react'
import BackButton from '../components/BackButton'

interface LensData {
  id: string; name: string
  features: string[]; pros: string[]; cons: string[]
  vision: { dist: 'clear' | 'blurry'; inter: 'clear' | 'blurry'; near: 'clear' | 'blurry' }
}

const LENSES: LensData[] = [
  { id: 'sv-dist', name: 'Single Vision Distance', features: ['One continuous focal power.', 'Optimized for objects 20+ feet away.'], pros: ['Widest field of view for driving.', 'Minimal peripheral distortion.'], cons: ['Does not help with near or intermediate vision.'], vision: { dist: 'clear', inter: 'blurry', near: 'blurry' } },
  { id: 'sv-read', name: 'Single Vision Reading', features: ['One continuous focal power.', 'Optimized for ~14-16 inch working distance.'], pros: ['Massive uninterrupted field for reading.', 'Perfect for prolonged close-up tasks.'], cons: ['Blurry for computer and distance.'], vision: { dist: 'blurry', inter: 'blurry', near: 'clear' } },
  { id: 'bifocal', name: 'Lined Bifocal (FT28)', features: ['Distance in top, D-shaped reading segment at bottom.'], pros: ['Both distance and near in one frame.', 'Wide reading area.'], cons: ['Visible line.', 'No intermediate correction.', '"Image jump" crossing the line.'], vision: { dist: 'clear', inter: 'blurry', near: 'clear' } },
  { id: 'trifocal', name: 'Lined Trifocal (7x28)', features: ['Three zones: distance, intermediate, near.', 'Two visible lines.'], pros: ['Addresses computer dead zone.', 'Wide reading and distance zones.'], cons: ['Two visible lines.', 'Narrow intermediate segment.'], vision: { dist: 'clear', inter: 'clear', near: 'clear' } },
  { id: 'std-prog', name: 'Standard Progressive', features: ['Seamless transition from distance to near.', 'No visible lines.'], pros: ['Cosmetically appealing.', 'Continuous range of vision.'], cons: ['Peripheral distortion ("swim" effect).', 'Narrow intermediate corridor.'], vision: { dist: 'clear', inter: 'clear', near: 'clear' } },
  { id: 'prem-prog', name: 'Premium Progressive', features: ['Digitally surfaced, customized to wearer.', 'Advanced seamless power transition.'], pros: ['Wider viewing corridors.', 'Reduced peripheral distortion.', 'Faster adaptation.'], cons: ['Higher price point.'], vision: { dist: 'clear', inter: 'clear', near: 'clear' } },
  { id: 'office', name: 'Office Progressive (Computer)', features: ['Maximizes intermediate and near vision.', 'De-emphasizes distance.'], pros: ['Ideal for desk/computer work.', 'Reduces neck and eye strain.'], cons: ['Cannot be worn for driving.', 'Requires separate distance glasses.'], vision: { dist: 'blurry', inter: 'clear', near: 'clear' } },
]

export default function LensGuide() {
  const [dark, setDark] = useState(false)
  const [selected, setSelected] = useState<LensData | null>(null)

  const bg = dark ? 'bg-gray-900 text-white' : 'bg-white text-black'
  const panel = dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
  const btnBase = `w-full text-left px-4 py-3 rounded border font-semibold text-base transition-all`
  const btnActive = dark ? 'bg-white text-black border-white' : 'bg-black text-white border-black'
  const btnInactive = dark ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-white text-black border-gray-200 hover:bg-gray-100'

  return (
    <div className={`min-h-screen flex flex-col ${bg} transition-colors`}>
      <BackButton />
      <header className={`border-b-2 border-current px-8 py-5 flex justify-between items-center ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        <h1 className="text-xl font-black uppercase tracking-wide">Pal Optical Lens Viewing Guide</h1>
        <button onClick={() => setDark(d => !d)} className={`px-4 py-2 rounded font-bold text-sm ${dark ? 'bg-white text-black' : 'bg-black text-white'}`}>Toggle Dark Mode</button>
      </header>

      <div className="flex-1 max-w-5xl mx-auto w-full p-4 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Lens List */}
        <div className="flex flex-col gap-2">
          {LENSES.map(lens => (
            <button key={lens.id} onClick={() => setSelected(lens)} className={`${btnBase} ${selected?.id === lens.id ? btnActive : btnInactive}`}>
              {lens.name}
            </button>
          ))}
        </div>

        {/* Display Panel */}
        <div className={`md:col-span-2 rounded border p-6 ${panel}`}>
          {!selected ? (
            <div className="text-center mt-8 opacity-50">
              <h2 className="text-xl font-bold mb-2">Welcome to the Viewing Guide</h2>
              <p>Select a lens type from the menu to view its specifications and visual corridor diagram.</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold border-b border-current pb-3 mb-4">{selected.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-2">Features</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1 mb-4">{selected.features.map((f, i) => <li key={i}>{f}</li>)}</ul>
                  <h4 className="font-bold border-b border-dashed border-current pb-1 mb-2">Advantages</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1 mb-4">{selected.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
                  <h4 className="font-bold border-b border-dashed border-current pb-1 mb-2">Limitations</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">{selected.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
                </div>
                <div className={`rounded p-3 border ${dark ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="text-center font-semibold text-sm mb-2">Visual Corridor Demonstration</div>
                  <svg viewBox="0 0 400 300" width="100%" className="bg-transparent">
                    {/* Targets */}
                    <rect x="150" y="240" width="150" height="10" fill="currentColor" opacity="0.8" />
                    <text x="200" y="270" fontSize="12" fontWeight="bold" textAnchor="middle" fill="currentColor">📱 PHONE (Near)</text>
                    <rect x="225" y="130" width="30" height="110" fill="none" stroke="currentColor" strokeWidth="3" />
                    <text x="240" y="125" fontSize="11" fontWeight="bold" textAnchor="middle" fill="currentColor">💻 COMPUTER</text>
                    <circle cx="350" cy="60" r="25" fill="none" stroke="currentColor" strokeWidth="3" />
                    <text x="350" y="100" fontSize="11" fontWeight="bold" textAnchor="middle" fill="currentColor">🕐 CLOCK (Dist)</text>
                    {/* Person */}
                    <circle cx="65" cy="130" r="18" fill="#f0f0f0" stroke="currentColor" strokeWidth="3" />
                    <rect x="56" y="148" width="18" height="50" rx="8" fill="#f8f8f8" stroke="currentColor" strokeWidth="3" />
                    <line x1="56" y1="168" x2="46" y2="183" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <line x1="74" y1="168" x2="84" y2="183" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <line x1="61" y1="198" x2="56" y2="228" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <line x1="69" y1="198" x2="74" y2="228" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="65" cy="125" r="5" fill="currentColor" />
                    {/* Vision lines */}
                    <line x1="65" y1="125" x2="325" y2="60" stroke={selected.vision.dist === 'clear' ? '#00ff00' : '#ff0000'} strokeWidth="3" strokeDasharray="8,8" strokeLinecap="round" />
                    <line x1="65" y1="125" x2="230" y2="180" stroke={selected.vision.inter === 'clear' ? '#00ff00' : '#ff0000'} strokeWidth="3" strokeDasharray="8,8" strokeLinecap="round" />
                    <line x1="65" y1="125" x2="190" y2="245" stroke={selected.vision.near === 'clear' ? '#00ff00' : '#ff0000'} strokeWidth="3" strokeDasharray="8,8" strokeLinecap="round" />
                  </svg>
                  <div className="flex justify-center gap-4 text-xs mt-2 opacity-70">
                    <span className="flex items-center gap-1"><span className="inline-block w-5 border-t-2 border-dashed border-green-500"></span> Clear</span>
                    <span className="flex items-center gap-1"><span className="inline-block w-5 border-t-2 border-dotted border-red-500"></span> Blurry</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className={`text-center py-4 text-sm opacity-50 border-t border-current ${dark ? 'bg-gray-800' : 'bg-white'}`}>
        jamesbrentlinger2026™
      </footer>
    </div>
  )
}
