import { useState, useEffect } from 'react';
import BackButton from '../components/BackButton'

interface LensRow { content: string[]; mat: string }
interface DBData { 'table-pal': LensRow[]; 'table-multi': LensRow[] }

const STORAGE_KEY = 'palOptical_Global_V5'
const MATERIALS = ['All', 'Plastic', 'Polycarbonate', 'Mid Index', 'High Index', 'Glass']

const PAL_HEADERS = ['Brand / Design', 'Material', 'Sph Range', 'Cyl Range', 'Add Range', 'Min Fit Height']
const MULTI_HEADERS = ['Brand / Design', 'Type', 'Material', 'Sph Range', 'Cyl Range', 'Add Range', 'Seg Size/Notes']

const DEFAULT_PAL: LensRow[] = [{ content: ['Varilux® X Series™', 'Polycarbonate', '-10.00 to +6.00', 'to -6.00', '0.75 to 3.50', '14mm / 17mm'], mat: 'Polycarbonate' }]
const DEFAULT_MULTI: LensRow[] = [{ content: ['KBco Xperio 7x28', 'Trifocal', 'Polycarbonate', '-8.00 to +4.00', 'to -4.00', '1.50 to 3.50', 'Polarized Poly'], mat: 'Polycarbonate' }]

export default function LensAvail() {
  const [filter, setFilter] = useState('All')
  const [palRows, setPalRows] = useState<LensRow[]>(DEFAULT_PAL)
  const [multiRows, setMultiRows] = useState<LensRow[]>(DEFAULT_MULTI)
  const [status, setStatus] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data: DBData = JSON.parse(saved)
      // Using setTimeout to defer the state updates to the next render cycle
      setTimeout(() => {
        if (data['table-pal']) setPalRows(data['table-pal'])
        if (data['table-multi']) setMultiRows(data['table-multi'])
      }, 0);
    }
  }, [])

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ 'table-pal': palRows, 'table-multi': multiRows }))
    setStatus('Saved! 💾'); setTimeout(() => setStatus(''), 3000)
  }

  const exportJSON = () => {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) { alert('Save first!'); return }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' })); a.download = 'Pal_Optical_Lens_Database.json'; a.click()
  }

  const importJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const data: DBData = JSON.parse(ev.target?.result as string)
        if (data['table-pal']) setPalRows(data['table-pal'])
        if (data['table-multi']) setMultiRows(data['table-multi'])
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        setStatus('Imported! ✅'); setTimeout(() => setStatus(''), 3000)
      } catch { alert('Invalid JSON file.') }
    }
    reader.readAsText(file)
  }

  const addPalRow = () => {
    const mat = filter === 'All' ? 'Plastic' : filter
    setPalRows(r => [...r, { content: Array(PAL_HEADERS.length).fill(''), mat }])
  }
  const addMultiRow = () => {
    const mat = filter === 'All' ? 'Plastic' : filter
    setMultiRows(r => [...r, { content: Array(MULTI_HEADERS.length).fill(''), mat }])
  }

  const updatePal = (i: number, j: number, val: string) => setPalRows(r => r.map((row, ri) => ri === i ? { ...row, content: row.content.map((c, ci) => ci === j ? val : c) } : row))
  const updateMulti = (i: number, j: number, val: string) => setMultiRows(r => r.map((row, ri) => ri === i ? { ...row, content: row.content.map((c, ci) => ci === j ? val : c) } : row))

  const visible = (mat: string) => filter === 'All' || mat === filter

  const thCls = 'bg-gray-200 text-xs uppercase px-3 py-2 text-left border border-gray-300'
  const tdCls = 'px-3 py-2 border border-gray-200 text-sm'
  const editCls = 'bg-yellow-50 px-2 py-1 text-sm w-full outline-none focus:bg-yellow-100 rounded'

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <BackButton />
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8">
        <header className="text-center border-b-4 border-blue-700 pb-5 mb-6">
          <h1 className="text-2xl font-bold">Master Multi-Focal Catalog</h1>
          <p className="text-gray-500 text-sm">Pal Optical | Lexington, KY Professional Database</p>
        </header>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 justify-center mb-4 print:hidden">
          <button onClick={save} className="px-4 py-2 bg-blue-700 text-white rounded font-bold text-sm hover:bg-blue-800">💾 Save</button>
          <button onClick={exportJSON} className="px-4 py-2 bg-green-600 text-white rounded font-bold text-sm hover:bg-green-700">📤 Export JSON</button>
          <label className="px-4 py-2 bg-purple-600 text-white rounded font-bold text-sm cursor-pointer hover:bg-purple-700">📥 Import JSON<input type="file" accept=".json" className="hidden" onChange={importJSON} /></label>
          {status && <span className="text-blue-600 italic text-sm self-center">{status}</span>}
        </div>

        {/* Material Filter */}
        <div className="flex flex-wrap gap-2 justify-center p-4 bg-gray-100 rounded-lg mb-6 print:hidden">
          <strong className="self-center text-sm">Filter:</strong>
          {MATERIALS.map(m => (
            <button key={m} onClick={() => setFilter(m)} className={`px-3 py-1 rounded text-sm font-bold border transition-colors ${filter === m ? 'bg-blue-700 text-white border-blue-700' : 'bg-white text-blue-700 border-blue-700 hover:bg-blue-50'}`}>{m}</button>
          ))}
        </div>

        {/* Progressives */}
        <section className="mb-12">
          <div className="flex justify-between items-center bg-blue-700 text-white px-4 py-2 rounded-t">
            <h2 className="font-bold">Progressives</h2>
            <button onClick={addPalRow} className="text-xs px-2 py-1 bg-white text-blue-700 rounded font-bold print:hidden">+ Add</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead><tr>{PAL_HEADERS.map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
              <tbody>
                {palRows.filter(r => visible(r.mat)).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {row.content.map((cell, j) => (
                      <td key={j} className={tdCls}>
                        {j === 1 ? <span>{cell}</span> : <input className={editCls} value={cell} onChange={e => updatePal(palRows.indexOf(row), j, e.target.value)} />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Multifocals */}
        <section className="mb-6">
          <div className="flex justify-between items-center bg-blue-700 text-white px-4 py-2 rounded-t">
            <h2 className="font-bold">Multifocals (Bifocal/Trifocal/Task)</h2>
            <button onClick={addMultiRow} className="text-xs px-2 py-1 bg-white text-blue-700 rounded font-bold print:hidden">+ Add</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead><tr>{MULTI_HEADERS.map(h => <th key={h} className={thCls}>{h}</th>)}</tr></thead>
              <tbody>
                {multiRows.filter(r => visible(r.mat)).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {row.content.map((cell, j) => (
                      <td key={j} className={tdCls}>
                        {j === 2 ? <span>{cell}</span> : <input className={editCls} value={cell} onChange={e => updateMulti(multiRows.indexOf(row), j, e.target.value)} />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-center text-xs text-gray-300">jamesbrentlinger2026™</p>
      </div>
    </div>
  )
}
