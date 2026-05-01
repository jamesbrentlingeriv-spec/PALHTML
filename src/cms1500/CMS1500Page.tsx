/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Printer, ChevronRight, ChevronLeft, Save, CheckCircle2 } from 'lucide-react';
import BackButton from '../components/BackButton';
import { CMS1500Data, CMS1500Step } from './types';
import { INITIAL_CMS_DATA } from './constants';
import CMSFormWizard from './components/CMSFormWizard';
import CMSPrintView from './components/CMSPrintView';

export default function CMS1500Page() {
  const [data, setData] = useState<CMS1500Data>(() => {
    const saved = localStorage.getItem('cms-1500-draft');
    return saved ? JSON.parse(saved) : INITIAL_CMS_DATA;
  });
  const [view, setView] = useState<'EDIT' | 'PRINT'>('EDIT');
  const [currentStep, setCurrentStep] = useState<CMS1500Step>('PATIENT_INFO');

  useEffect(() => {
    localStorage.setItem('cms-1500-draft', JSON.stringify(data));
  }, [data]);

  const steps: { key: CMS1500Step; label: string }[] = [
    { key: 'PATIENT_INFO', label: 'Patient' },
    { key: 'INSURED_INFO', label: 'Insurance' },
    { key: 'ILLNESS_INFO', label: 'Claim Details' },
    { key: 'DIAGNOSIS', label: 'Diagnosis' },
    { key: 'SERVICES', label: 'Services' },
    { key: 'PROVIDER_INFO', label: 'Provider' },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].key);
    } else {
      setView('PRINT');
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].key);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <BackButton />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600 rounded flex items-center justify-center text-white shadow-sm shadow-red-200">
              <FileText size={20} />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none tracking-tight">MediForm<span className="text-red-600">Pro</span></h1>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-[0.2em] font-black">CMS-1500 Clinical Systems</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView(view === 'EDIT' ? 'PRINT' : 'EDIT')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${
                view === 'PRINT' 
                  ? 'bg-red-50 text-red-600 border border-red-100' 
                  : 'text-slate-600 hover:bg-slate-50 transition-colors'
              }`}
            >
              {view === 'PRINT' ? <FileText size={18} /> : <Printer size={18} />}
              {view === 'PRINT' ? 'Intake Form' : 'Preview Overlay'}
            </button>
            <button
              onClick={() => view === 'EDIT' ? setView('PRINT') : window.print()}
              className="px-5 py-2 text-sm font-bold bg-red-600 text-white rounded-md shadow-sm shadow-red-200 hover:bg-red-700 transition-all flex items-center gap-2"
            >
              {view === 'PRINT' ? <Printer size={18} /> : <Save size={18} />}
              {view === 'PRINT' ? 'Generate Print File' : 'Save & Close'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {view === 'EDIT' ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Sidebar Tabs */}
              <div className="lg:col-span-3 space-y-2">
                {steps.map((step, idx) => (
                  <button
                    key={step.key}
                    onClick={() => setCurrentStep(step.key)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center justify-between group border ${
                      currentStep === step.key
                        ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
                        : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-black ${
                        currentStep === step.key ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-500'
                      }`}>
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider">{step.label}</span>
                    </div>
                    {idx < currentStepIndex && <CheckCircle2 size={16} className="text-green-500" />}
                    {currentStep === step.key && <ChevronRight size={16} className="text-red-600" />}
                  </button>
                ))}
                
                <div className="pt-6 mt-6 border-t border-slate-200">
                  <div className="p-4 bg-slate-900 rounded-xl text-white">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-slate-400">Print Precision</h3>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                      Ensure your system dialog is set to <span className="text-red-400 font-bold">Actual Size</span>. Margins must be set to 'None' for proper grid alignment.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Area */}
              <div className="lg:col-span-9">
                <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm min-h-[600px] flex flex-col relative overflow-hidden">
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50"></div>
                  
                  <div className="flex-1 relative z-10">
                    <CMSFormWizard 
                      step={currentStep} 
                      data={data} 
                      onChange={setData} 
                    />
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100 relative z-10">
                    <button
                      onClick={prevStep}
                      disabled={currentStepIndex === 0}
                      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all ${
                        currentStepIndex === 0 ? 'opacity-0 cursor-default' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <ChevronLeft size={16} />
                      Previous Step
                    </button>
                    
                    <button
                      onClick={nextStep}
                      className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-lg text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg shadow-slate-200"
                    >
                      {currentStepIndex === steps.length - 1 ? 'Go to Preview' : 'Continue Intake'}
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center"
            >
              <div className="w-full max-w-4xl mb-8 flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600 border border-red-100">
                    <Printer size={24} />
                  </div>
                  <div>
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Alignment Preview</h2>
                    <h3 className="text-xl font-bold text-slate-900">Calibration Grid</h3>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Paper</p>
                    <p className="text-xs font-bold text-slate-700">CMS-1500 (02-12)</p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-red-100 hover:bg-red-700 transition-all flex items-center gap-2"
                  >
                    <Printer size={16} />
                    Execute Print
                  </button>
                </div>
              </div>

              {/* Print Sheet Container */}
              <div className="relative bg-white shadow-2xl rounded-sm overflow-hidden border border-slate-200 group">
                <div className="absolute top-4 left-4 text-[8px] font-black text-red-500/20 uppercase tracking-widest pointer-events-none">Top-Left Origin (0,0)</div>
                <div className="absolute bottom-4 right-4 text-[8px] font-black text-red-500/20 uppercase tracking-widest pointer-events-none transform rotate-180">Bottom-Right Limit</div>
                
                <div className="print:shadow-none print:border-none">
                  <CMSPrintView data={data} />
                </div>
                
                {/* Technical Overlay - visible on screen only */}
                <div className="absolute inset-0 border-[20px] border-red-500/5 pointer-events-none print:hidden group-hover:border-red-500/10 transition-all"></div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl pb-12">
                <div className="bg-slate-100 p-4 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center border border-slate-200">
                  Step 1: Check Tray
                </div>
                <div className="bg-slate-900 p-4 rounded-xl text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
                  Step 2: Scale 100%
                </div>
                <div className="bg-slate-100 p-4 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center border border-slate-200">
                  Step 3: Print Mode
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Persistence Note */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white/80 backdrop-blur-md px-4 py-2 border border-slate-200 rounded-full shadow-lg flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Auto-Sync Active</span>
        </div>
      </div>
    </div>
  );
}
