import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Eye, 
  Glasses, 
  Layers, 
  Info, 
  ChevronRight, 
  Settings2,
  Trash2,
  Sun,
  Moon,
  RotateCcw
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { FrameStyle, LensInput } from './types';
import { calculateLensThickness } from './lib/calculators';
import ThreeScene from './components/ThreeScene';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MATERIAL_OPTIONS = [
  { name: 'CR-39 (Standard)', index: 1.498, description: 'Basic plastic, thickest but optical clear.' },
  { name: 'Trivex', index: 1.53, description: 'Lightweight & strong.' },
  { name: 'Polycarbonate', index: 1.586, description: 'Thin & impact resistant.' },
  { name: 'High Index 1.60', index: 1.60, description: 'Thin and crisp optics.' },
  { name: 'High Index 1.67', index: 1.67, description: 'Very thin for high prescriptions.' },
  { name: 'High Index 1.74', index: 1.74, description: 'Ultra thin.' },
];

const FRAME_STYLES: { value: FrameStyle; label: string }[] = [
  { value: 'plastic', label: 'Plastic / Acetate' },
  { value: 'metal', label: 'Metal' },
  { value: 'semi-rimless', label: 'Semi-Rimless' },
  { value: 'rimless', label: 'Rimless' },
];

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [input, setInput] = useState<LensInput>({
    sphere: -6.50,
    cylinder: 0.00,
    axis: 180,
    index: 1.67,
    pd: 64,
    eyesize: 52,
    dbl: 18,
    ed: 54,
    style: 'metal',
    vertex: 12,
  });

  const result = useMemo(() => calculateLensThickness(input), [input]);

  const handleChange = (key: keyof LensInput, value: string | number) => {
    setInput(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className={cn("h-screen flex flex-col bg-sleek-bg overflow-hidden text-sleek-text-main transition-colors duration-200", darkMode && "dark")}>
      {/* Header */}
      <header className="h-[64px] bg-sleek-panel border-b border-sleek-border flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-2 font-extrabold text-xl text-sleek-accent tracking-tighter">
          <span>◈</span> LENS CALC & EVAL 
          <span className="font-light text-sm text-sleek-text-muted ml-1 tracking-normal">/ OPTICAL ENGINE</span>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-sleek-bg rounded-lg text-sleek-text-muted transition-colors"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="text-[12px] font-semibold text-sleek-text-muted uppercase tracking-wider">
            SURFACING LAB SIMULATION
          </div>
        </div>
      </header>

      {/* Main Container - 3 Column Grid */}
      <main className="grid grid-cols-[320px_1fr_280px] grow overflow-hidden bg-sleek-border gap-[1px]">
        
        {/* Left Column: Sidebar for Lens Calculator Inputs */}
        <section className="bg-sleek-panel p-6 flex flex-col gap-5 overflow-y-auto custom-scrollbar">
          <div className="mb-2 pb-2 border-b border-sleek-border">
            <h2 className="text-[14px] font-black uppercase tracking-widest text-sleek-accent">01. Lens Calculator</h2>
            <p className="text-[10px] text-sleek-text-muted font-bold opacity-70">INPUT PARAMETERS & GEOMETRY</p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase text-sleek-text-muted tracking-[0.5px]">Frame Style</label>
            <select 
              value={input.style}
              onChange={(e) => handleChange('style', e.target.value as FrameStyle)}
              className="w-full px-3 py-2.5 border border-sleek-border rounded-lg text-sm bg-slate-50 text-black focus:ring-1 focus:ring-sleek-accent outline-none"
            >
              {FRAME_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase text-sleek-text-muted tracking-[0.5px]">Lens Material (Index)</label>
            <select 
              value={input.index}
              onChange={(e) => handleChange('index', parseFloat(e.target.value))}
              className="w-full px-3 py-2.5 border border-sleek-border rounded-lg text-sm bg-slate-50 text-black focus:ring-1 focus:ring-sleek-accent outline-none"
            >
              {MATERIAL_OPTIONS.map(m => <option key={m.index} value={m.index}>{m.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase text-sleek-text-muted tracking-[0.5px]">Patient PD</label>
              <input 
                type="number" value={input.pd} step="0.5"
                onChange={(e) => handleChange('pd', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 border border-sleek-border rounded-lg text-sm bg-slate-50 text-black font-mono"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase text-sleek-text-muted tracking-[0.5px]">Eye Size (A)</label>
              <input 
                type="number" value={input.eyesize}
                onChange={(e) => handleChange('eyesize', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 border border-sleek-border rounded-lg text-sm bg-slate-50 text-black font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase text-sleek-text-muted tracking-[0.5px]">Bridge (DBL)</label>
              <input 
                type="number" value={input.dbl}
                onChange={(e) => handleChange('dbl', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 border border-sleek-border rounded-lg text-sm bg-slate-50 text-black font-mono"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase text-sleek-text-muted tracking-[0.5px]">B Dimension</label>
              <input 
                type="number" value={input.ed}
                onChange={(e) => handleChange('ed', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 border border-sleek-border rounded-lg text-sm bg-slate-50 text-black font-mono"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-bold uppercase text-sleek-text-muted tracking-[0.5px]">Vertex Distance (mm)</label>
            <input 
              type="number" value={input.vertex}
              onChange={(e) => handleChange('vertex', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2.5 border border-sleek-border rounded-lg text-sm bg-slate-50 text-black font-mono focus:ring-1 focus:ring-sleek-accent outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
            <label className="text-[11px] font-bold uppercase text-sleek-text-muted tracking-[0.5px]">Sphere Power (OD)</label>
            <input 
              type="number" step="0.25"
              value={input.sphere}
              onChange={(e) => handleChange('sphere', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2.5 border border-sleek-border rounded-lg text-sm bg-slate-50 font-bold font-mono text-red-500"
            />
          </div>
          
           <button 
             onClick={() => setInput({
               sphere: -4.0, cylinder: 0, axis: 180, index: 1.498, pd: 63, eyesize: 50, dbl: 20, ed: 52, style: 'plastic', vertex: 12
             })}
             className="mt-2 w-full flex items-center justify-center gap-2 py-2 text-[10px] font-bold text-sleek-text-muted hover:text-sleek-accent hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-sleek-border uppercase tracking-widest"
           >
             <RotateCcw size={12} /> Reset Engine
           </button>
        </section>

        {/* Middle Column: Viewport (3D Scene) */}
        <section className="relative bg-white dark:bg-slate-900 overflow-hidden flex items-center justify-center transition-colors">
          {/* Theme Background Gradient */}
          <div className="absolute inset-0 bg-white dark:bg-[radial-gradient(circle_at_50%_50%,#1e293b_0%,#0f172a_100%)] opacity-60" />
          
          <div className="w-full h-full relative z-10">
            <ThreeScene result={result} input={input} />
          </div>

          <div className="absolute top-6 left-6 text-[10px] font-bold bg-sleek-panel border border-sleek-border px-3 py-1.5 rounded shadow-sm z-20 uppercase tracking-widest text-sleek-text-muted transition-colors">
            VIEW: TEMPORAL ANGLE (35°)
          </div>

          <div className="absolute bottom-6 right-6 bg-sleek-panel/95 backdrop-blur-sm p-4 border border-sleek-border rounded-lg shadow-sm z-20 space-y-2 min-w-[200px] transition-colors">
            <div className="flex items-center gap-3 text-[11px] font-bold text-sleek-text-muted uppercase tracking-tight">
              <div className="w-3 h-3 bg-sleek-text-main rounded-sm" /> Frame Profile
            </div>
            <div className="flex items-center gap-3 text-[11px] font-bold text-sleek-text-muted uppercase tracking-tight transition-colors">
              <div className="w-3 h-3 bg-sleek-panel border border-sleek-text-muted rounded-sm" /> Calculated Edge Protrusion
            </div>
          </div>
        </section>

        {/* Right Column: Results - Thickness Evaluator */}
        <section className="bg-sleek-panel p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
          <div className="mb-2 pb-2 border-b border-sleek-border">
            <h2 className="text-[14px] font-black uppercase tracking-widest text-sleek-text-main">02. Thickness Evaluator</h2>
            <p className="text-[10px] text-sleek-text-muted font-bold opacity-70 uppercase tracking-tighter">Analysis & Assessment</p>
          </div>
          
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-sleek-glass border border-sleek-accent rounded-xl">
              <div className="text-[10px] text-sleek-text-muted font-bold mb-1 uppercase tracking-wider">Decentration (per eye)</div>
              <div className="text-2xl font-bold text-sleek-accent">{result.decentration.toFixed(1)} <span className="text-sm font-medium">mm</span></div>
            </div>

            <div className="p-4 bg-sleek-glass border border-sleek-accent rounded-xl">
              <div className="text-[10px] text-sleek-text-muted font-bold mb-1 uppercase tracking-wider">Temporal Edge Thickness</div>
              <div className="text-2xl font-bold text-sleek-accent">{result.temporalEdgeThickness.toFixed(1)} <span className="text-sm font-medium">mm</span></div>
              {result.temporalEdgeThickness > result.frameDepth && (
                <div className="mt-2 px-2 py-1 bg-red-50 dark:bg-red-950/30 text-[9px] font-bold text-red-500 uppercase tracking-tight rounded border border-red-100 dark:border-red-900 inline-block transition-colors">
                   ⚠ {(result.temporalEdgeThickness - result.frameDepth).toFixed(1)}mm Protrusion Detected
                </div>
              )}
            </div>

            <div className="p-4 bg-sleek-bg border border-sleek-border rounded-xl transition-colors">
              <div className="text-[10px] text-sleek-text-muted font-bold mb-1 uppercase tracking-wider">Nasal Edge Thickness</div>
              <div className="text-2xl font-bold text-sleek-text-main">{result.nasalEdgeThickness.toFixed(1)} <span className="text-sm font-medium">mm</span></div>
            </div>

            <div className="p-4 bg-sleek-bg border border-sleek-border rounded-xl transition-colors">
              <div className="text-[10px] text-sleek-text-muted font-bold mb-1 uppercase tracking-wider">Center Thickness</div>
              <div className="text-2xl font-bold text-sleek-text-main">{result.centerThickness.toFixed(1)} <span className="text-sm font-medium">mm</span></div>
            </div>

            <div className="p-4 bg-sleek-bg border border-sleek-border border-dashed rounded-xl transition-colors">
              <div className="text-[10px] text-sleek-text-muted font-bold mb-1 uppercase tracking-wider">Vertex Comp. Power</div>
              <div className="text-xl font-bold text-sleek-text-main">{result.effectivePower.toFixed(2)} <span className="text-sm font-medium">D</span></div>
            </div>
          </div>

          {/* Evaluator Assessment */}
          <div className="pt-4 border-t border-sleek-border">
            <h3 className="text-[10px] font-black text-sleek-text-muted uppercase tracking-widest mb-4">Assessment Results</h3>
            <div className={cn(
              "p-4 rounded-xl border flex flex-col gap-2 transition-colors",
              result.maxThickness > 6 
                ? "bg-red-50/50 border-red-100 text-red-900" 
                : result.maxThickness > 4 
                  ? "bg-amber-50/50 border-amber-100 text-amber-900" 
                  : "bg-emerald-50/50 border-emerald-100 text-emerald-900"
            )}>
              <div className="flex items-center gap-2 font-black text-[12px] uppercase">
                <Info size={14} />
                {result.maxThickness > 6 ? "High Aesthetic Risk" : result.maxThickness > 4 ? "Moderate Thickness" : "Optimal Result"}
              </div>
              <p className="text-[11px] font-medium leading-relaxed opacity-80">
                {result.maxThickness > 6 
                  ? "Edge thickness exceeds frame hide. High index 1.74 and a smaller A-size are recommended." 
                  : result.maxThickness > 4
                    ? "Visible edge thickness detected. Standard polish recommended. Plastic frame suggested for better coverage."
                    : "Excellent profile match. Light weight and minimal edge visibility achieved with current selection."}
              </p>
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-slate-100 transition-colors">
            <div className="p-4 border border-dashed border-sleek-border rounded-lg text-[10px] leading-relaxed text-sleek-text-muted">
              <strong className="text-sleek-text-main block mb-1 uppercase tracking-wider">LAB NOTE:</strong>
              {input.sphere < -6 
                ? "HIGH MINUS DETECTED: Significant edge frosting will be visible. Consider rolling or polishing edges to reduce the 'coke bottle' ring effect."
                : "Calculations based on a 75mm blank size. Minimal edge thickness set to 1.0mm for safety and stability."
              }
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
