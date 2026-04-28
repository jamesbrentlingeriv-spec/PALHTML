import { useState, useEffect } from 'react'
import BackButton from '../components/BackButton'

const PATIENT_DOCS = [
  { label: 'English', url: '../printable-docs/patient-info-en.html' },
  { label: 'Español', url: '../printable-docs/patient-info-es.html' },
  { label: 'Français', url: '../printable-docs/patient-info-fr.html' },
]

const WAIVERS = [
  { label: 'Expired Rx', url: '../printable-docs/waiver-expired-rx.html' },
  { label: 'Patient Own Frame', url: '../printable-docs/waiver-patient-own-frame.html' },
  { label: 'Frame Thickness', url: '../printable-docs/waiver-frame-thickness.html' },
  { label: 'Child Poly', url: '../printable-docs/waiver-child-poly.html' },
  { label: 'Lined to No-Line', url: '../printable-docs/waiver-lined-to-no-line.html' },
  { label: 'Semi-Rimless Chip', url: '../printable-docs/waiver-semi-rimless.html' },
  { label: 'Remake', url: '../printable-docs/waiver-remake.html' },
]

export default function PalDocs() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')

  useEffect(() => { localStorage.setItem('theme', dark ? 'dark' : 'light') }, [dark])

  const open = (url: string) => window.open(url, '_blank')

  const bg = dark ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-800'
  const card = dark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
  const btn = 'w-full py-3 px-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg bg-gradient-to-r from-green-500 to-green-700 shadow-green-400/40 shadow-md'

  return (
    <div className={`min-h-screen ${bg} p-8 transition-colors`}>
      <BackButton />
      <button onClick={() => setDark(d => !d)} className={`fixed top-4 right-4 w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl shadow-lg ${card}`}>
        {dark ? '☀️' : '🌙'}
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black bg-gradient-to-r from-black to-green-600 bg-clip-text text-transparent dark:from-white dark:to-green-400 mb-2">📄 Printable Documents</h1>
          <p className="text-lg opacity-80">Patient Information Sheets & Disclosure Waivers</p>
          <p className="text-sm opacity-60 mt-1">👁️ Click to view in new tab, then Print (Ctrl+P)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Patient Info */}
          <div className={`${card} border rounded-2xl p-6 shadow-lg hover:-translate-y-1 transition-transform`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">👤 Patient Information Sheets</h2>
            {PATIENT_DOCS.map(d => (
              <button key={d.label} onClick={() => open(d.url)} className={`${btn} mb-2`}>
                <span>👁️</span> {d.label}
              </button>
            ))}
          </div>

          {/* Individual Waivers */}
          <div className={`${card} border rounded-2xl p-6 shadow-lg hover:-translate-y-1 transition-transform`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">⚠️ Individual Waivers</h2>
            {WAIVERS.map(w => (
              <button key={w.label} onClick={() => open(w.url)} className={`${btn} mb-2`}>
                <span>👁️</span> {w.label}
              </button>
            ))}
          </div>

          {/* All Waivers Combined */}
          <div className={`${card} border rounded-2xl p-6 shadow-lg hover:-translate-y-1 transition-transform`}>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">📋 Multiple Waivers</h2>
            <p className={`text-sm p-3 rounded-lg mb-4 ${dark ? 'bg-green-900/30' : 'bg-green-50'}`}>
              Select multiple waivers & print combined form with checkboxes & signature.
            </p>
            <button
              onClick={() => open('../printable-docs/all-waivers.html')}
              className="w-full py-3 px-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg bg-gradient-to-r from-orange-500 to-orange-700 shadow-orange-400/40 shadow-md text-lg"
            >
              <span>👁️</span> All Waivers Combined
            </button>
          </div>
        </div>

        <footer className="text-center mt-10 opacity-50 text-sm border-t border-current pt-4">
          Pal Optical | Printable Documents Directory
        </footer>
      </div>
    </div>
  )
}
