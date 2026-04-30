import { useState, useRef, useEffect } from 'react'
import BackButton from '../components/BackButton'

type Theme = 'light' | 'dark' | 'rainbow'

export default function OptiCalc() {
  const [theme, setTheme] = useState<Theme>('light')
  const [display, setDisplay] = useState('')
  const [receipt, setReceipt] = useState<string[]>(['--- Session Started ---'])
  const [frameA, setFrameA] = useState('')
  const [bridge, setBridge] = useState('')
  const [decPd, setDecPd] = useState('')
  const [ed, setEd] = useState('')
  const [patPd, setPatPd] = useState('')
  const [index, setIndex] = useState('1.59')
  const [frameType, setFrameType] = useState('2.5')
  const [power, setPower] = useState('')
  const [diameter, setDiameter] = useState('')
  const [decentration, setDecentration] = useState('0')
  const [minThick, setMinThick] = useState('1.5')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const themes: Theme[] = ['light', 'dark', 'rainbow']
  const cycleTheme = () => setTheme(t => themes[(themes.indexOf(t) + 1) % 3])

  const addReceipt = (text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setReceipt(r => [...r, `[${time}] ${text}`])
  }

  // Safe math expression evaluator function
  const safeEval = (expression: string): number => {
    // Remove whitespace and convert operators
    const sanitizedExpression = expression.replace(/\s+/g, '').replace(/×/g, '*').replace(/÷/g, '/');
    
    // Validate expression only contains allowed characters (numbers, operators, parentheses, Math functions)
    if (!/^[\d+\-*/.()sqrtlnabsceilfloormaxminroundPIE\s]+$/.test(sanitizedExpression.replace(/Math\.[a-zA-Z]+/g, ''))) {
      throw new Error('Invalid characters in expression');
    }

    // Replace Math functions with their actual names
    const processedExpression = sanitizedExpression
      .replace(/Math\.([a-zA-Z]+)/g, 'Math.$1')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/ln/g, 'Math.log')
      .replace(/abs/g, 'Math.abs')
      .replace(/ceil/g, 'Math.ceil')
      .replace(/floor/g, 'Math.floor')
      .replace(/max/g, 'Math.max')
      .replace(/min/g, 'Math.min')
      .replace(/round/g, 'Math.round')
      .replace(/PI/g, 'Math.PI')
      .replace(/E/g, 'Math.E');

    // Evaluate using Function constructor instead of eval (safer but still limited)
    return Function('"use strict"; return (' + processedExpression + ')')();
  };

  const append = (ch: string) => setDisplay(d => d + ch)
  const clear = () => setDisplay('')
  const calculate = () => {
    try {
      // Use safe evaluator instead of eval
      const result = safeEval(display.replace(/Math\./g, 'Math.'))
      addReceipt(`${display} = ${result}`)
      setDisplay(String(result))
    } catch { setDisplay('Error') }
  }
  const applyRetail = (mult: number, label: string) => {
    try {
      // Use safe evaluator instead of eval
      const cur = parseFloat(safeEval(display).toString())
      if (isNaN(cur)) return
      const newTotal = (cur * mult).toFixed(2)
      addReceipt(`${cur} ${label} = ${newTotal}`)
      setDisplay(newTotal)
    } catch { /* ignore */ }
  }

  const calcDecentration = () => {
    const a = parseFloat(frameA), b = parseFloat(bridge), pd = parseFloat(decPd)
    if (isNaN(a) || isNaN(b) || isNaN(pd)) { alert('Fill all decentration fields.'); return }
    const fp = a + b, dec = (fp - pd) / 2
    addReceipt(`Decentration: (A:${a} + DBL:${b} - PD:${pd}) / 2 = ${dec.toFixed(2)}mm`)
    setDecentration(Math.abs(dec).toFixed(2))
    setEdPd(fp.toFixed(1))
    setPatPd(pd.toFixed(1))
  }

  const calcMBS = () => {
    const e = parseFloat(ed), fp = parseFloat(edPd), pp = parseFloat(patPd)
    if (isNaN(e) || isNaN(fp) || isNaN(pp)) { alert('Fill all MBS fields.'); return }
    const mbs = e + (fp - pp) + 2
    addReceipt(`MBS: ED(${e}) + F.PD(${fp}) - P.PD(${pp}) + 2 = ${mbs.toFixed(1)}mm`)
  }

  const calcThickness = () => {
    const n = parseFloat(index), p = parseFloat(power), d = parseFloat(diameter), dec = parseFloat(decentration) || 0, mt = parseFloat(minThick)
    if (isNaN(p) || isNaN(d) || isNaN(mt)) { alert('Fill all thickness fields.'); return }
    const r = d / 2 + Math.abs(dec)
    const sag = (r * r * Math.abs(p)) / (2000 * (n - 1))
    const thick = sag + mt
    const label = p > 0 ? 'Center Thickness (Plus)' : 'Edge Thickness (Minus)'
    addReceipt(`Thickness: ${p}D, Index ${n}, Ø${d}mm → ${label}: ${thick.toFixed(2)}mm`)
    drawCanvas(thick, parseFloat(frameType), p > 0)
  }

  const drawCanvas = (maxT: number, frameThick: number, isPlus: boolean) => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, 400, 300)
    const isDark = theme === 'dark'
    const lensColor = isDark ? 'rgba(26,255,128,0.2)' : 'rgba(0,150,255,0.3)'
    const outline = isDark ? '#1aff80' : '#0066cc'
    const frameColor = isDark ? '#1aff80' : '#222'
    const textColor = isDark ? '#1aff80' : '#000'
    const scale = 5
    const lensThickPx = maxT * scale
    const frameThickPx = frameThick * scale
    const frontX = 225, topY = 75, lensH = 90, backX = frontX - lensThickPx
    ctx.fillStyle = lensColor; ctx.strokeStyle = outline; ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(frontX, topY)
    ctx.quadraticCurveTo(frontX + 3, topY + lensH / 2, frontX, topY + lensH)
    ctx.lineTo(backX, topY + lensH)
    ctx.quadraticCurveTo(backX - (isPlus ? 8 : 4), topY + lensH / 2, backX, topY)
    ctx.closePath(); ctx.fill(); ctx.stroke()
    ctx.strokeStyle = frameColor; ctx.lineWidth = 1.5
    ctx.strokeRect(frontX - frameThickPx, topY - 1, frameThickPx + 1, lensH + 2)
    ctx.fillStyle = frameColor; ctx.fillRect(50, topY + 15, backX - 50, 5)
    ctx.fillStyle = textColor; ctx.font = '13px Arial'
    ctx.fillText(`Max Thickness: ${maxT.toFixed(2)} mm`, 10, 20)
    ctx.fillText(`Frame Coverage: ${frameThick.toFixed(2)} mm`, 10, 40)
    const exposed = Math.max(0, maxT - frameThick)
    ctx.fillStyle = exposed > 0 ? '#cc0000' : '#008800'
    ctx.fillText(`Exposed: ${exposed.toFixed(2)} mm`, 10, 62)
  }

  useEffect(() => {
    if (power && diameter) {
      calcThickness();
    }
  }, [power, diameter, theme, index, frameType, minThick, frameA, bridge, decPd, ed, patPd, calcThickness]); // Removed edPd which is not a dependency

  const bgCls = theme === 'dark' ? 'bg-black text-green-400' : theme === 'rainbow' ? 'bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 text-gray-800' : 'bg-white text-black'
  const cardCls = theme === 'dark' ? 'bg-gray-950 border-green-700' : theme === 'rainbow' ? 'bg-white/60 backdrop-blur border-white/80' : 'bg-gray-100 border-gray-300'
  const btnCls = theme === 'dark' ? 'bg-gray-900 text-green-400 border border-green-700 hover:bg-gray-800' : theme === 'rainbow' ? 'bg-gradient-to-br from-purple-500 to-indigo-500 text-white border-none' : 'bg-black text-white hover:bg-gray-800'
  const inp = `w-full px-2 py-1.5 border rounded text-sm ${theme === 'dark' ? 'bg-gray-900 border-green-700 text-green-400' : 'bg-white border-gray-300 text-black'}`

  return (
    <div className={`min-h-screen p-4 transition-all ${bgCls}`}>
      <BackButton />
      <div className="flex justify-between items-center mt-10 mb-4 max-w-5xl mx-auto">
        <h2 className="text-xl font-bold">Optician Calculator</h2>
        <div className="flex gap-2">
          <button onClick={cycleTheme} className={`px-3 py-2 rounded text-sm font-bold ${btnCls}`}>Toggle Theme</button>
          <button onClick={() => window.print()} className={`px-3 py-2 rounded text-sm font-bold ${btnCls}`}>Print Session</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calculator */}
        <div className={`p-4 rounded-xl border ${cardCls}`}>
          <h3 className="font-bold mb-3">Standard & Retail Calc</h3>
          <textarea className={`${inp} h-20 resize-none mb-3 text-right font-mono`} value={display} readOnly />
          <div className="grid grid-cols-4 gap-2">
            {['+6% Tax','-10% Off','-20% Off','C','sin','cos','tan','√','log','(',')','/','7','8','9','×','4','5','6','-','1','2','3','+','0','.','='].map(k => (
              <button key={k} onClick={() => {
                if (k === 'C') clear()
                else if (k === '=') calculate()
                else if (k === '+6% Tax') applyRetail(1.06, '+6% Tax')
                else if (k === '-10% Off') applyRetail(0.90, '-10% Off')
                else if (k === '-20% Off') applyRetail(0.80, '-20% Off')
                else if (k === '×') append('*')
                else if (k === '÷') append('/')
                else if (k === '√') append('Math.sqrt(')
                else if (k === 'sin') append('Math.sin(')
                else if (k === 'cos') append('Math.cos(')
                else if (k === 'tan') append('Math.tan(')
                else if (k === 'log') append('Math.log10(')
                else append(k)
              }} className={`py-3 rounded font-bold text-sm transition-all active:scale-95 ${['+6% Tax','-10% Off','-20% Off','C','sin','cos','tan','√','log','(',')','/','×','-','+'].includes(k) ? (theme === 'dark' ? 'bg-gray-700 text-green-400' : 'bg-gray-500 text-white') : btnCls}`}>
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Optician Tools */}
        <div className={`p-4 rounded-xl border ${cardCls} space-y-4`}>
          <h3 className="font-bold">Optician Formulas</h3>
          <div>
            <h4 className="font-semibold text-sm mb-2">Decentration (Per Eye)</h4>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div><label className="text-xs block mb-1">Frame A (mm)</label><input className={inp} value={frameA} onChange={e => setFrameA(e.target.value)} /></div>
              <div><label className="text-xs block mb-1">Bridge/DBL (mm)</label><input className={inp} value={bridge} onChange={e => setBridge(e.target.value)} /></div>
              <div><label className="text-xs block mb-1">Patient PD (mm)</label><input className={inp} value={decPd} onChange={e => setDecPd(e.target.value)} /></div>
            </div>
            <button onClick={calcDecentration} className={`w-full py-2 rounded font-bold text-sm ${btnCls}`}>Calculate Decentration</button>
          </div>
          <hr className="opacity-30" />
          <div>
            <h4 className="font-semibold text-sm mb-2">Minimum Blank Size (MBS)</h4>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div><label className="text-xs block mb-1">ED (mm)</label><input className={inp} value={ed} onChange={e => setEd(e.target.value)} /></div>
              <div><label className="text-xs block mb-1">Frame PD (mm)</label><input className={inp} value={edPd} onChange={e => setEdPd(e.target.value)} /></div>
              <div><label className="text-xs block mb-1">Patient PD (mm)</label><input className={inp} value={patPd} onChange={e => setPatPd(e.target.value)} /></div>
            </div>
            <button onClick={calcMBS} className={`w-full py-2 rounded font-bold text-sm ${btnCls}`}>Calculate MBS</button>
          </div>
          <hr className="opacity-30" />
          <div>
            <h4 className="font-semibold text-sm mb-2">Lens Thickness</h4>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div><label className="text-xs block mb-1">Material Index</label>
                <select className={inp} value={index} onChange={e => setIndex(e.target.value)}>
                  <option value="1.50">CR-39 (1.50)</option><option value="1.523">Crown Glass (1.523)</option>
                  <option value="1.53">Trivex (1.53)</option><option value="1.59">Polycarbonate (1.59)</option>
                  <option value="1.67">High Index (1.67)</option><option value="1.74">High Index (1.74)</option>
                </select>
              </div>
              <div><label className="text-xs block mb-1">Frame Type</label>
                <select className={inp} value={frameType} onChange={e => setFrameType(e.target.value)}>
                  <option value="2.5">Plastic (2.5mm)</option><option value="1.2">Metal (1.2mm)</option>
                  <option value="1.21">Semi-Rimless (1.2mm)</option><option value="0">Drill-Mount (0mm)</option>
                </select>
              </div>
              <div><label className="text-xs block mb-1">Sphere Power (D)</label><input className={inp} value={power} onChange={e => setPower(e.target.value)} /></div>
              <div><label className="text-xs block mb-1">Diameter/ED (mm)</label><input className={inp} value={diameter} onChange={e => setDiameter(e.target.value)} /></div>
              <div><label className="text-xs block mb-1">Decentration (mm)</label><input className={inp} value={decentration} onChange={e => setDecentration(e.target.value)} /></div>
              <div><label className="text-xs block mb-1">Min Thickness (mm)</label><input className={inp} value={minThick} onChange={e => setMinThick(e.target.value)} /></div>
            </div>
            <button onClick={calcThickness} className={`w-full py-2 rounded font-bold text-sm ${btnCls}`}>Calculate & Visualize</button>
            <canvas ref={canvasRef} width={400} height={300} className="mt-3 w-full border border-current rounded-lg" />
          </div>
        </div>

        {/* Receipt */}
        <div className={`p-4 rounded-xl border md:col-span-2 print:block ${cardCls}`}>
          <h3 className="font-bold mb-3">Session Receipt</h3>
          <div className={`h-48 overflow-y-auto font-mono text-xs p-3 rounded border ${theme === 'dark' ? 'bg-gray-950 border-green-800' : 'bg-yellow-50 border-dashed border-gray-300'}`}>
            {receipt.map((line, i) => <div key={i}>{line}</div>)}
          </div>
          <button onClick={() => setReceipt(['--- Session Cleared ---'])} className={`mt-2 px-4 py-2 rounded font-bold text-sm print:hidden ${btnCls}`}>Clear Session</button>
          <p className="text-center text-xs opacity-40 mt-2">jamesbrentlinger2026™</p>
        </div>
      </div>
    </div>
  )
}
