import { useState, useRef } from 'react'
import BackButton from '../components/BackButton'

interface LineItem { id: number; code: string; desc: string; qty: number; price: number }

interface ReceiptProps {
  defaultName: string
  defaultAddress: string
  defaultCity: string
  defaultPhone: string
  defaultFax?: string
}

export default function ReceiptPage({ defaultName, defaultAddress, defaultCity, defaultPhone, defaultFax }: ReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const [clinicName, setClinicName] = useState(defaultName)
  const [address, setAddress] = useState(defaultAddress)
  const [city, setCity] = useState(defaultCity)
  const [phone, setPhone] = useState(defaultPhone)
  const [fax, setFax] = useState(defaultFax || '')
  const [date, setDate] = useState(new Date().toLocaleDateString())
  const [rcptNum, setRcptNum] = useState('001')
  const [patName, setPatName] = useState('')
  const [patAddr, setPatAddr] = useState('')
  const [patPhone, setPatPhone] = useState('')
  const [insPlan, setInsPlan] = useState('')
  const [memberId, setMemberId] = useState('')
  const [authNum, setAuthNum] = useState('')
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, code: '', desc: '', qty: 1, price: 0 },
    { id: 2, code: '', desc: '', qty: 1, price: 0 },
  ])
  const [insAdj, setInsAdj] = useState(0)
  const [amtPaid, setAmtPaid] = useState(0)
  const [payments, setPayments] = useState<string[]>([])
  const [showConfirm, setShowConfirm] = useState(false)

  const subtotal = items.reduce((s, i) => s + i.qty * i.price, 0)
  const balance = subtotal - insAdj - amtPaid

  const addRow = () => setItems(it => [...it, { id: Date.now(), code: '', desc: '', qty: 1, price: 0 }])
  const removeRow = (id: number) => setItems(it => it.filter(i => i.id !== id))
  const updateItem = (id: number, field: keyof LineItem, val: string | number) =>
    setItems(it => it.map(i => i.id === id ? { ...i, [field]: val } : i))
  const togglePayment = (p: string) => setPayments(ps => ps.includes(p) ? ps.filter(x => x !== p) : [...ps, p])

  const handlePrint = () => {
    setShowConfirm(false)
    // Small delay to ensure modal is gone before print dialog opens
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const inp = 'border border-gray-300 rounded px-2 py-1 text-sm w-full focus:outline-none focus:border-blue-400 bg-white'

  return (
    <div className="min-h-screen bg-gray-100 p-5 print:bg-white print:p-0">
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-container {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0.5in !important;
            width: 100% !important;
          }
          @page {
            size: letter;
            margin: 0.5in;
          }
        }
      `}</style>

      <div className="no-print">
      <BackButton />
      </div>

      {/* Controls */}
      <div className="max-w-3xl mx-auto mb-4 flex justify-end gap-2 no-print">
        <button onClick={addRow} className="px-4 py-2 bg-green-600 text-white rounded text-sm font-bold hover:bg-green-700">+ Add Item</button>
        <button onClick={() => setShowConfirm(true)} className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-bold hover:bg-blue-700">Save & Print</button>
          </div>

      <div ref={receiptRef} className="print-container max-w-3xl mx-auto bg-white p-10 shadow-lg border border-gray-200 print:shadow-none print:border-none">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-gray-800 pb-5 mb-5">
          <div className="w-3/5 space-y-1">
            <input className={`${inp} text-xl font-bold`} value={clinicName} onChange={e => setClinicName(e.target.value)} />
            <input className={inp} value={address} onChange={e => setAddress(e.target.value)} />
            <input className={inp} value={city} onChange={e => setCity(e.target.value)} />
            <input className={inp} value={phone} onChange={e => setPhone(e.target.value)} />
            {defaultFax !== undefined && <input className={inp} value={fax} onChange={e => setFax(e.target.value)} />}
          </div>
          <div className="text-right w-2/5 space-y-2">
            <h2 className="text-gray-400 font-bold text-lg">RECEIPT</h2>
            <div className="flex justify-end items-center gap-2"><label className="text-sm font-semibold">Date:</label><input className={`${inp} w-28 text-right`} value={date} onChange={e => setDate(e.target.value)} /></div>
            <div className="flex justify-end items-center gap-2"><label className="text-sm font-semibold">Rcpt #:</label><input className={`${inp} w-28 text-right`} value={rcptNum} onChange={e => setRcptNum(e.target.value)} /></div>
        </div>
              </div>

        {/* Patient / Insurance */}
        <div className="flex gap-4 mb-6">
          <div className="w-1/2">
            <h3 className="text-xs uppercase text-gray-400 font-bold border-b border-gray-200 mb-2">Patient Information</h3>
            {([['Name:', patName, setPatName, 'Patient Name'], ['Address:', patAddr, setPatAddr, 'Patient Address'], ['Phone:', patPhone, setPatPhone, 'Patient Phone']] as [string, string, (v: string) => void, string][]).map(([lbl, val, set, ph]) => (
              <div key={lbl} className="flex items-center gap-2 mb-1">
                <label className="w-16 text-xs font-semibold shrink-0">{lbl}</label>
                <input className={inp} value={val} placeholder={ph} onChange={e => set(e.target.value)} />
              </div>
            ))}
          </div>
          <div className="w-1/2">
            <h3 className="text-xs uppercase text-gray-400 font-bold border-b border-gray-200 mb-2">Insurance / Reference</h3>
            {([['Ins Plan:', insPlan, setInsPlan, 'VSP / EyeMed'], ['Member ID:', memberId, setMemberId, 'ID Number'], ['Auth #:', authNum, setAuthNum, 'Auth Number']] as [string, string, (v: string) => void, string][]).map(([lbl, val, set, ph]) => (
              <div key={lbl} className="flex items-center gap-2 mb-1">
                <label className="w-16 text-xs font-semibold shrink-0">{lbl}</label>
                <input className={inp} value={val} placeholder={ph} onChange={e => set(e.target.value)} />
        </div>
            ))}
          </div>
        </div>
        {/* Items Table */}
        <table className="w-full border-collapse mb-4 text-sm">
          <thead><tr className="bg-gray-800 text-white">
            <th className="p-2 text-left w-1/12">Code</th>
            <th className="p-2 text-left w-5/12">Description</th>
            <th className="p-2 text-center w-1/12">Qty</th>
            <th className="p-2 text-right w-2/12">Unit Price</th>
            <th className="p-2 text-right w-2/12">Total</th>
            <th className="p-2 w-8 print:hidden"></th>
          </tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="p-1"><input className={inp} value={item.code} onChange={e => updateItem(item.id, 'code', e.target.value)} placeholder="Code" /></td>
                <td className="p-1"><input className={inp} value={item.desc} onChange={e => updateItem(item.id, 'desc', e.target.value)} placeholder="Description" /></td>
                <td className="p-1"><input type="number" className={`${inp} text-center`} value={item.qty} min={1} onChange={e => updateItem(item.id, 'qty', +e.target.value)} /></td>
                <td className="p-1"><input type="number" className={`${inp} text-right`} value={item.price} step={0.01} onChange={e => updateItem(item.id, 'price', +e.target.value)} /></td>
                <td className="p-1 text-right font-bold pr-3">${(item.qty * item.price).toFixed(2)}</td>
                <td className="p-1 print:hidden"><button onClick={() => removeRow(item.id)} className="text-red-500 font-bold text-xs px-1 hover:text-red-700">X</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={addRow} className="text-blue-600 font-bold text-sm mb-5 print:hidden hover:underline">+ Add Line Item</button>

        {/* Totals */}
        <div className="ml-auto w-80 space-y-2">
          <div className="flex justify-between text-sm"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between items-center text-sm text-red-600">
            <span>Insurance Adj (-):</span>
            <input type="number" className="w-24 border border-gray-300 rounded px-2 py-1 text-right text-sm" value={insAdj} step={0.01} onChange={e => setInsAdj(+e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2 p-2 border border-gray-100 rounded bg-gray-50 text-xs">
            {['VISA','MC','AmEx','Discover','Check','Cash'].map(p => (
              <label key={p} className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" checked={payments.includes(p)} onChange={() => togglePayment(p)} />{p}
              </label>
            ))}
          </div>
          <div className="flex justify-between items-center text-sm text-green-600 font-bold">
            <span>Amount Paid (-):</span>
            <input type="number" className="w-24 border border-gray-300 rounded px-2 py-1 text-right text-sm" value={amtPaid} step={0.01} onChange={e => setAmtPaid(+e.target.value)} />
        </div>
          <div className="flex justify-between font-bold text-lg border-t-2 border-gray-800 pt-2">
            <span>Balance Due:</span><span>${balance.toFixed(2)}</span>
        </div>
      </div>

        <div className="mt-12 text-center text-xs text-gray-400 border-t border-gray-100 pt-4">
          <input className="text-center w-full border-none outline-none text-xs text-gray-400" defaultValue="Thank you for trusting us with your vision care!" />
            </div>
        <p className="text-center text-xs text-gray-300 mt-3">jamesbrentlinger2026™</p>
          </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 no-print">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-sm text-center border-2 border-gray-800">
            <p className="text-lg font-bold text-gray-800 mb-6">Did you make sure the date is for the date of service, not today's date?</p>
            <div className="flex justify-center gap-4">
              <button onClick={handlePrint} className="px-8 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700">Yes</button>
              <button onClick={() => setShowConfirm(false)} className="px-8 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700">No</button>
        </div>
    </div>
        </div>
      )}
    </div>
  )
}

