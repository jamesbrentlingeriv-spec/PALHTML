import { useState, useEffect } from 'react'
import BackButton from '../components/BackButton'

interface Patient {
  id: number
  name: string
  dob: string
  phone: string
  supply: string
  boxes: string
  perEye: boolean
  hasIns: boolean
  insName: string
  pay: string
  notes: string
  dateAdded: string
}

const STORAGE_KEY = 'palOpticalOrders'

export default function ContactOrders() {
  const [patients, setPatients] = useState<Patient[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
  })
  const [form, setForm] = useState({ name: '', dob: '', phone: '', supply: 'Annual Supply', boxes: '0', perEye: false, hasIns: false, insName: '', pay: 'N/A', notes: '' })

  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(patients)) }, [patients])

  const add = () => {
    if (!form.name) { alert('Please enter a patient name.'); return }
    setPatients(p => [...p, { ...form, id: Date.now(), dateAdded: new Date().toLocaleDateString() }])
    setForm({ name: '', dob: '', phone: '', supply: 'Annual Supply', boxes: '0', perEye: false, hasIns: false, insName: '', pay: 'N/A', notes: '' })
  }

  const remove = (id: number) => setPatients(p => p.filter(x => x.id !== id))

  const exportExcel = () => {
    if (!patients.length) { alert('List is empty!'); return }
    const sorted = [...patients].sort((a, b) => a.name.localeCompare(b.name))
    let xml = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>'
    xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"><Worksheet ss:Name="Orders"><Table>'
    xml += '<Row><Cell><Data ss:Type="String">Patient</Data></Cell><Cell><Data ss:Type="String">DOB</Data></Cell><Cell><Data ss:Type="String">Phone</Data></Cell><Cell><Data ss:Type="String">Supply</Data></Cell><Cell><Data ss:Type="String">Insurance</Data></Cell><Cell><Data ss:Type="String">Payment</Data></Cell><Cell><Data ss:Type="String">Notes</Data></Cell></Row>'
    sorted.forEach(p => {
      const supply = p.supply === 'Custom Box Count' ? `${p.boxes} Boxes (${p.perEye ? 'Per Eye' : 'Total'})` : p.supply
      xml += `<Row><Cell><Data ss:Type="String">${p.name}</Data></Cell><Cell><Data ss:Type="String">${p.dob}</Data></Cell><Cell><Data ss:Type="String">${p.phone}</Data></Cell><Cell><Data ss:Type="String">${supply}</Data></Cell><Cell><Data ss:Type="String">${p.hasIns ? p.insName : 'None'}</Data></Cell><Cell><Data ss:Type="String">${p.pay}</Data></Cell><Cell><Data ss:Type="String">${p.notes}</Data></Cell></Row>`
    })
    xml += '</Table></Worksheet></Workbook>'
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([xml], { type: 'application/vnd.ms-excel' }))
    a.download = 'Pal_Optical_Orders.xls'
    a.click()
  }

  const inp = 'w-full px-3 py-2 border border-pink-300 rounded-lg text-sm focus:outline-none focus:border-pink-500'

  return (
    <div className="min-h-screen bg-pink-50 p-5">
      <BackButton />
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border-2 border-pink-300 p-6">
        <h1 className="text-2xl font-bold text-center text-pink-500 mb-6">Contact Lens Order Sheet</h1>

        {/* Add Form */}
        <div className="bg-pink-100 rounded-xl p-5 mb-6">
          <h2 className="text-lg font-bold text-pink-500 mb-4">Add New Order</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div><label className="text-xs font-bold block mb-1">Patient Name</label><input className={inp} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div><label className="text-xs font-bold block mb-1">Date of Birth</label><input type="date" className={inp} value={form.dob} onChange={e => setForm(f => ({ ...f, dob: e.target.value }))} /></div>
            <div><label className="text-xs font-bold block mb-1">Phone</label><input className={inp} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} /></div>
            <div>
              <label className="text-xs font-bold block mb-1">Supply Size</label>
              <select className={inp} value={form.supply} onChange={e => setForm(f => ({ ...f, supply: e.target.value }))}>
                <option>Annual Supply</option>
                <option>6-Month Supply</option>
                <option>Custom Box Count</option>
              </select>
            </div>
            {form.supply === 'Custom Box Count' && <>
              <div><label className="text-xs font-bold block mb-1">Boxes</label><input type="number" className={inp} value={form.boxes} onChange={e => setForm(f => ({ ...f, boxes: e.target.value }))} /></div>
              <div className="flex items-center gap-2 pt-5"><input type="checkbox" checked={form.perEye} onChange={e => setForm(f => ({ ...f, perEye: e.target.checked }))} /><label className="text-xs font-bold">Per Eye?</label></div>
            </>}
            <div className="flex items-center gap-2 pt-5"><input type="checkbox" checked={form.hasIns} onChange={e => setForm(f => ({ ...f, hasIns: e.target.checked }))} /><label className="text-xs font-bold">Using Insurance?</label></div>
            {form.hasIns && <div><label className="text-xs font-bold block mb-1">Insurance Name</label><input className={inp} placeholder="e.g. VSP" value={form.insName} onChange={e => setForm(f => ({ ...f, insName: e.target.value }))} /></div>}
            <div>
              <label className="text-xs font-bold block mb-1">Payment Status</label>
              <select className={inp} value={form.pay} onChange={e => setForm(f => ({ ...f, pay: e.target.value }))}>
                <option value="N/A">Select...</option>
                <option>Cash</option><option>Card</option><option>Check</option>
                <option>Insurance Benefit</option><option>Pay When It Comes In</option>
              </select>
            </div>
            <div className="sm:col-span-2"><label className="text-xs font-bold block mb-1">Notes</label><textarea className={inp} rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} /></div>
          </div>
          <button onClick={add} className="mt-4 px-6 py-2 bg-pink-400 text-white rounded-full font-bold hover:bg-pink-500 transition-colors">Add to Order List</button>
        </div>

        {/* Table */}
        <div className="bg-blue-50 rounded-xl p-5">
          <h2 className="text-lg font-bold text-pink-500 mb-4">Contacts To Be Ordered</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-blue-200 text-gray-600">
                {['Patient','DOB','Phone','Supply','Insurance','Payment','Notes','Added',''].map(h => <th key={h} className="p-2 text-left">{h}</th>)}
              </tr></thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.id} className="border-b border-gray-200 hover:bg-pink-50">
                    <td className="p-2 font-bold">{p.name}</td>
                    <td className="p-2">{p.dob || '-'}</td>
                    <td className="p-2">{p.phone}</td>
                    <td className="p-2">{p.supply === 'Custom Box Count' ? `${p.boxes} Boxes (${p.perEye ? 'Per Eye' : 'Total'})` : <span className="bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-bold">{p.supply}</span>}</td>
                    <td className="p-2">{p.hasIns ? <><span className="bg-purple-200 text-purple-700 px-1 rounded text-xs font-bold mr-1">INS</span>{p.insName}</> : 'No'}</td>
                    <td className="p-2">{p.pay === 'Pay When It Comes In' ? <span className="text-red-600 font-bold">{p.pay}</span> : p.pay}</td>
                    <td className="p-2 text-gray-500 italic max-w-32 truncate">{p.notes || '-'}</td>
                    <td className="p-2">{p.dateAdded}</td>
                    <td className="p-2"><button onClick={() => remove(p.id)} className="bg-red-400 text-white px-2 py-0.5 rounded text-xs font-bold hover:bg-red-600">X</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={exportExcel} className="flex-1 py-2 bg-green-400 text-white rounded-full font-bold hover:bg-green-500 text-sm">Export to Excel</button>
            <button onClick={() => window.print()} className="flex-1 py-2 bg-blue-400 text-white rounded-full font-bold hover:bg-blue-500 text-sm">Print List 🖨️</button>
            <button onClick={() => { if (confirm('Clear entire list?')) { setPatients([]); localStorage.removeItem(STORAGE_KEY) } }} className="flex-1 py-2 bg-red-400 text-white rounded-full font-bold hover:bg-red-600 text-sm">Reset List</button>
          </div>
        </div>
        <p className="text-center text-xs text-pink-300 mt-4">jamesbrentlinger2026™</p>
      </div>
    </div>
  )
}
