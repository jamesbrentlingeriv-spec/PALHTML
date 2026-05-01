/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Trash2, Info } from 'lucide-react';
import type { CMS1500Data, CMS1500Step } from '../types';

interface WizardProps {
  step: CMS1500Step;
  data: CMS1500Data;
  onChange: (data: CMS1500Data) => void;
}

export default function CMSFormWizard({ step, data, onChange }: WizardProps) {
  const updateData = (updates: Partial<CMS1500Data>) => {
    onChange({ ...data, ...updates });
  };

  const updateNested = (key: keyof CMS1500Data, subKey: string, value: any) => {
    const parent = data[key] as any;
    updateData({ [key]: { ...parent, [subKey]: value } });
  };

  const handleStepRender = () => {
    switch (step) {
      case 'PATIENT_INFO':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">01. Patient & Insured</h2>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Core Identity</h3>
              </div>
              <span className="text-[10px] text-green-600 bg-green-50 px-3 py-1 rounded-full font-bold border border-green-100 uppercase tracking-widest">Validated</span>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Insurance Type (Box 1)</span>
                  <select 
                    value={data.programType}
                    onChange={e => updateData({ programType: e.target.value as any })}
                    className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
                  >
                    <option value="">Select Type</option>
                    <option value="MEDICARE">Medicare</option>
                    <option value="MEDICAID">Medicaid</option>
                    <option value="TRICARE">Tricare</option>
                    <option value="CHAMPVA">Champva</option>
                    <option value="GROUP">Group Health Plan</option>
                    <option value="FECA">FECA Black Lung</option>
                    <option value="OTHER">Other</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Patient Name (Box 2)</span>
                  <input
                    type="text"
                    value={data.patientName}
                    placeholder="DOE, JANE Q"
                    onChange={e => updateData({ patientName: e.target.value })}
                    className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary transition-all font-bold placeholder:text-slate-300"
                  />
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Birth Date (Box 3)</span>
                    <input
                      type="date"
                      value={data.patientBirthDate}
                      onChange={e => updateData({ patientBirthDate: e.target.value })}
                      className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary transition-all font-mono"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Sex (Box 3)</span>
                    <select
                      value={data.patientSex}
                      onChange={e => updateData({ patientSex: e.target.value as any })}
                      className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary transition-all font-medium"
                    >
                      <option value="">Select</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Street Address (Box 5)</span>
                  <input
                    type="text"
                    value={data.patientAddress.street}
                    placeholder="123 HELIX WAY, SUITE 400"
                    onChange={e => updateNested('patientAddress', 'street', e.target.value)}
                    className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary transition-all placeholder:text-slate-300"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">City</span>
                    <input
                      type="text"
                      value={data.patientAddress.city}
                      onChange={e => updateNested('patientAddress', 'city', e.target.value)}
                      className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary transition-all"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">State</span>
                      <input
                        type="text"
                        maxLength={2}
                        value={data.patientAddress.state}
                        onChange={e => updateNested('patientAddress', 'state', e.target.value.toUpperCase())}
                        className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary text-center font-bold"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Zip</span>
                      <input
                        type="text"
                        value={data.patientAddress.zipCode}
                        onChange={e => updateNested('patientAddress', 'zipCode', e.target.value)}
                        className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary font-mono"
                      />
                    </label>
                  </div>
                </div>
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Relationship (Box 6)</span>
                  <select
                    value={data.patientRelationship}
                    onChange={e => updateData({ patientRelationship: e.target.value as any })}
                    className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary transition-all font-medium"
                  >
                    <option value="">Select Relationship</option>
                    <option value="SELF">Self</option>
                    <option value="SPOUSE">Spouse</option>
                    <option value="CHILD">Child</option>
                    <option value="OTHER">Other</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        );

      case 'INSURED_INFO':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">02. Coverage Details</h2>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Insured Party</h3>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Insured's ID Number (Box 1a)</span>
                  <input
                    type="text"
                    value={data.insuredId}
                    onChange={e => updateData({ insuredId: e.target.value })}
                    className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary transition-all font-mono font-bold text-primary"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Insured's Name (Box 4)</span>
                  <input
                    type="text"
                    value={data.insuredName}
                    placeholder="Same as patient"
                    onChange={e => updateData({ insuredName: e.target.value })}
                    className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Group Number (Box 11)</span>
                    <input
                      type="text"
                      value={data.insuredGroupNumber}
                      onChange={e => updateData({ insuredGroupNumber: e.target.value })}
                      className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary font-mono"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Plan Name (Box 11c)</span>
                    <input
                      type="text"
                      value={data.insuredPlanName}
                      onChange={e => updateData({ insuredPlanName: e.target.value })}
                      className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Verifications</h3>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox"
                      checked={data.insuredSignatureAuthorized}
                      onChange={e => updateData({ insuredSignatureAuthorized: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-wider">
                      Insured Signature Authorized
                    </span>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Patient Sign Date (Box 12)</span>
                    <input
                      type="date"
                      value={data.patientSignatureDate}
                      onChange={e => updateData({ patientSignatureDate: e.target.value })}
                      className="block w-full rounded-lg border-slate-200 bg-white border px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                    />
                  </label>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 text-red-900 text-[11px] leading-relaxed font-medium">
                  <Info size={14} className="shrink-0 mt-0.5 text-primary" />
                  Note: Box 7 (Insured Address) remains blank if relationship is "Self" to prevent redundant data on the printed form.
                </div>
              </div>
            </div>
          </div>
        );

      case 'ILLNESS_INFO':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">03. Clinical Data</h2>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Claim Details</h3>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Date of Illness (Box 14)</span>
                    <input
                      type="date"
                      value={data.dateOfIllness}
                      onChange={e => updateData({ dateOfIllness: e.target.value })}
                      className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary transition-all font-mono"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Qualifier (Box 14)</span>
                    <select
                      value={data.dateOfIllnessQual}
                      onChange={e => updateData({ dateOfIllnessQual: e.target.value as any })}
                      className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary transition-all font-bold"
                    >
                      <option value="">Select</option>
                      <option value="431">431 (Onset)</option>
                      <option value="484">484 (LMP)</option>
                    </select>
                  </label>
                </div>

                <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Condition Linked To (Box 10)</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={data.conditionRelatedTo.employment}
                        onChange={e => updateNested('conditionRelatedTo', 'employment', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Employment Related</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={data.conditionRelatedTo.autoAccident}
                        onChange={e => updateNested('conditionRelatedTo', 'autoAccident', e.target.checked)}
                        className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Auto Accident</span>
                    </label>
                    {data.conditionRelatedTo.autoAccident && (
                      <input 
                        type="text"
                        placeholder="STATE CODE (MM)"
                        maxLength={2}
                        value={data.conditionRelatedTo.place}
                        onChange={e => updateNested('conditionRelatedTo', 'place', e.target.value.toUpperCase())}
                        className="w-full text-xs font-bold p-2 border border-slate-200 rounded bg-white font-mono"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Referring Provider (Box 17)</span>
                  <input
                    type="text"
                    value={data.referringProviderName}
                    placeholder="PROVIDER FULL NAME"
                    onChange={e => updateData({ referringProviderName: e.target.value })}
                    className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary transition-all uppercase font-bold"
                  />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Qualifier</span>
                    <select
                      value={data.referringProviderQual}
                      onChange={e => updateData({ referringProviderQual: e.target.value as any })}
                      className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary transition-all font-mono"
                    >
                      <option value="">None</option>
                      <option value="DN">DN (Referring)</option>
                      <option value="DK">DK (Ordering)</option>
                      <option value="DQ">DQ (Supervising)</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">NPI (Box 17b)</span>
                    <input
                      type="text"
                      maxLength={10}
                      value={data.referringProviderNpi}
                      onChange={e => updateData({ referringProviderNpi: e.target.value })}
                      className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary transition-all font-mono font-bold tracking-widest"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Prior Auth Number (Box 23)</span>
                  <input
                    type="text"
                    value={data.priorAuthNumber}
                    onChange={e => updateData({ priorAuthNumber: e.target.value })}
                    className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-2 text-sm focus:ring-2 focus:ring-primary transition-all font-mono"
                  />
                </label>
              </div>
            </div>
          </div>
        );

      case 'DIAGNOSIS':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">04. ICD-10 Classification</h2>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Diagnosis Codes</h3>
            </header>

            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-full pointer-events-none"></div>
              
              <div className="flex items-center gap-8 mb-8 relative z-10">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Indicator</span>
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="icdInd" 
                      checked={data.diagnosisCodeIcd === '0'} 
                      onChange={() => updateData({ diagnosisCodeIcd: '0' })}
                      className="w-4 h-4 text-primary border-slate-300"
                    />
                    <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600 group-hover:text-slate-900 transition-colors">ICD-10 (0)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="icdInd" 
                      checked={data.diagnosisCodeIcd === '9'} 
                      onChange={() => updateData({ diagnosisCodeIcd: '9' })}
                      className="w-4 h-4 text-primary border-slate-300"
                    />
                    <span className="font-bold text-[11px] uppercase tracking-wider text-slate-600 group-hover:text-slate-900 transition-colors">ICD-9 (9)</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
                {data.diagnosisCodes.map((code, idx) => (
                  <div key={idx} className="relative group">
                    <span className="absolute -top-2 left-2 bg-slate-50 px-1 text-[9px] font-black text-slate-300 rounded group-focus-within:text-primary transition-colors uppercase">
                      Code {String.fromCharCode(65 + idx)}
                    </span>
                    <input
                      type="text"
                      value={code}
                      placeholder="--"
                      onChange={e => {
                        const newCodes = [...data.diagnosisCodes];
                        newCodes[idx] = e.target.value.toUpperCase();
                        updateData({ diagnosisCodes: newCodes });
                      }}
                      className="w-full rounded-xl border-slate-200 bg-white border px-4 py-3 focus:ring-2 focus:ring-primary transition-all font-mono font-bold text-slate-900 shadow-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-900 p-5 rounded-2xl text-slate-400 text-[11px] leading-relaxed font-medium">
              <span className="text-red-400 font-black uppercase tracking-widest mr-2">System Note</span>
              Diagnosis pointers are linked in sequential order (A-L). These pointers must match the 'DIAG' field in Service Lines for accurate adjudication.
            </div>
          </div>
        );

      case 'SERVICES':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex items-center justify-between">
              <div>
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">05. Procedure Logs</h2>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Service & Charges</h3>
              </div>
              <button
                disabled={data.serviceLines.length >= 6}
                onClick={() => updateData({ 
                  serviceLines: [...data.serviceLines, {
                    fromDate: '', toDate: '', placeOfService: '', emergency: false,
                    cptCode: '', modifier: '', diagnosisPointer: '', charges: '',
                    daysOrUnits: '1', renderingProviderNpi: ''
                  }] 
                })}
                className="flex items-center gap-2 px-5 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all disabled:opacity-30"
              >
                <Plus size={14} />
                New Row
              </button>
            </header>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50 border-b border-slate-100">
                    <th className="py-4 px-4">Date Range</th>
                    <th className="py-4 px-2 w-16 text-center">POS</th>
                    <th className="py-4 px-4 w-32">CPT/HCPCS</th>
                    <th className="py-4 px-2 w-16 text-center">MOD</th>
                    <th className="py-4 px-2 w-16 text-center">DIAG</th>
                    <th className="py-4 px-4 w-32">Charges</th>
                    <th className="py-4 px-2 w-16 text-center">UNITS</th>
                    <th className="py-4 px-4">Rendering NPI</th>
                    <th className="py-4 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.serviceLines.map((line, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1.5">
                          <input type="text" placeholder="MMDDYY" value={line.fromDate} onChange={e => {
                            const lines = [...data.serviceLines]; lines[idx].fromDate = e.target.value; updateData({ serviceLines: lines });
                          }} className="w-28 text-xs font-mono p-2 border border-slate-100 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-primary transition-all" />
                          <input type="text" placeholder="MMDDYY" value={line.toDate} onChange={e => {
                            const lines = [...data.serviceLines]; lines[idx].toDate = e.target.value; updateData({ serviceLines: lines });
                          }} className="w-28 text-xs font-mono p-2 border border-slate-100 rounded bg-slate-50 focus:bg-white focus:ring-1 focus:ring-primary transition-all font-medium text-slate-400" />
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <input type="text" placeholder="11" maxLength={2} value={line.placeOfService} onChange={e => {
                          const lines = [...data.serviceLines]; lines[idx].placeOfService = e.target.value; updateData({ serviceLines: lines });
                        }} className="w-12 text-xs font-black font-mono p-2 border border-slate-100 rounded bg-slate-50 focus:bg-white text-center" />
                      </td>
                      <td className="py-3 px-4">
                        <input type="text" placeholder="99214" maxLength={5} value={line.cptCode} onChange={e => {
                          const lines = [...data.serviceLines]; lines[idx].cptCode = e.target.value; updateData({ serviceLines: lines });
                        }} className="w-full text-sm font-black font-mono p-2 border border-slate-200 rounded bg-white shadow-sm focus:ring-2 focus:ring-primary text-primary" />
                      </td>
                      <td className="py-3 px-2">
                        <input type="text" value={line.modifier} maxLength={2} placeholder="--" onChange={e => {
                          const lines = [...data.serviceLines]; lines[idx].modifier = e.target.value; updateData({ serviceLines: lines });
                        }} className="w-12 text-xs font-mono p-2 border border-slate-100 rounded bg-slate-50 text-center uppercase" />
                      </td>
                      <td className="py-3 px-2">
                        <input type="text" placeholder="A" maxLength={4} value={line.diagnosisPointer} onChange={e => {
                          const lines = [...data.serviceLines]; lines[idx].diagnosisPointer = e.target.value.toUpperCase(); updateData({ serviceLines: lines });
                        }} className="w-14 text-xs font-black font-mono p-2 border border-slate-200 rounded bg-white text-center shadow-sm" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 px-2 py-2 border border-slate-100 rounded bg-slate-50 group-focus-within:bg-white transition-all">
                          <span className="text-[10px] font-black text-slate-300">$</span>
                          <input type="text" placeholder="0.00" value={line.charges} onChange={e => {
                            const lines = [...data.serviceLines]; lines[idx].charges = e.target.value; updateData({ serviceLines: lines });
                          }} className="w-full text-sm font-black font-mono bg-transparent outline-none text-slate-800" />
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <input type="text" value={line.daysOrUnits} onChange={e => {
                          const lines = [...data.serviceLines]; lines[idx].daysOrUnits = e.target.value; updateData({ serviceLines: lines });
                        }} className="w-12 text-xs font-black font-mono p-2 border border-slate-100 rounded bg-slate-50 text-center" />
                      </td>
                      <td className="py-3 px-4">
                        <input type="text" placeholder="0000000000" value={line.renderingProviderNpi} onChange={e => {
                          const lines = [...data.serviceLines]; lines[idx].renderingProviderNpi = e.target.value; updateData({ serviceLines: lines });
                        }} className="w-full text-xs font-mono p-2 border border-slate-100 rounded bg-slate-50 tracking-widest" />
                      </td>
                      <td className="py-3 px-4 text-right">
                        {data.serviceLines.length > 1 && (
                          <button
                            onClick={() => updateData({ serviceLines: data.serviceLines.filter((_, i) => i !== idx) })}
                            className="p-2 text-slate-300 hover:text-primary hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <div className="p-6 bg-slate-900 rounded-3xl flex justify-between items-center shadow-lg shadow-slate-200">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Total Validated Charge</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-red-400 font-black text-xs">$</span>
                  <input
                    type="text"
                    value={data.totalCharge}
                    placeholder="0.00"
                    onChange={e => updateData({ totalCharge: e.target.value })}
                    className="bg-transparent border-none outline-none font-mono font-black text-2xl text-white w-32 placeholder:text-slate-700"
                  />
                </div>
              </div>
              <div className="p-6 bg-white border border-slate-200 rounded-3xl flex justify-between items-center shadow-sm">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Amount Collected</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-slate-300 font-black text-xs">$</span>
                  <input
                    type="text"
                    value={data.amountPaid}
                    placeholder="0.00"
                    onChange={e => updateData({ amountPaid: e.target.value })}
                    className="bg-transparent border-none outline-none font-mono font-black text-2xl text-slate-900 w-32 placeholder:text-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'PROVIDER_INFO':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">06. Entity Disclosure</h2>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">Billing Provider</h3>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 block">Federal Identification</span>
                  <div className="flex gap-4">
                    <div className="w-2/3">
                      <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Full Tax ID (Box 25)</label>
                      <input
                        type="text"
                        value={data.taxId}
                        onChange={e => updateData({ taxId: e.target.value })}
                        className="block w-full rounded-lg border-slate-200 bg-slate-50 border px-3 py-3 text-sm focus:ring-2 focus:ring-primary font-mono font-bold tracking-widest"
                      />
                    </div>
                    <div className="w-1/3">
                      <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Type</label>
                      <select
                        value={data.taxIdType}
                        onChange={e => updateData({ taxIdType: e.target.value as any })}
                        className="block w-full h-[46px] rounded-lg border-slate-200 bg-slate-50 border px-3 text-xs font-black uppercase tracking-wider"
                      >
                        <option value="">--</option>
                        <option value="EIN">EIN</option>
                        <option value="SSN">SSN</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Rendering Facility (Box 32)</h3>
                  <div className="space-y-3">
                    <input
                      type="text" placeholder="FACILITY NAME"
                      value={data.facilityInfo.name}
                      onChange={e => updateNested('facilityInfo', 'name', e.target.value)}
                      className="w-full rounded-lg border-slate-200 bg-white border px-4 py-3 text-sm focus:ring-2 focus:ring-primary font-bold"
                    />
                    <input
                      type="text" placeholder="STREET ADDRESS"
                      value={data.facilityInfo.street}
                      onChange={e => updateNested('facilityInfo', 'street', e.target.value)}
                      className="w-full rounded-lg border-slate-200 bg-white border px-4 py-3 text-sm focus:ring-2 focus:ring-primary"
                    />
                    <div className="grid grid-cols-4 gap-2">
                      <input
                        type="text" placeholder="CITY"
                        value={data.facilityInfo.city}
                        onChange={e => updateNested('facilityInfo', 'city', e.target.value)}
                        className="col-span-2 rounded-lg border-slate-200 bg-white border px-4 py-3 text-sm"
                      />
                      <input
                        type="text" placeholder="ST" maxLength={2}
                        value={data.facilityInfo.state}
                        onChange={e => updateNested('facilityInfo', 'state', e.target.value.toUpperCase())}
                        className="rounded-lg border-slate-200 bg-white border px-2 text-center text-sm font-black"
                      />
                      <input
                        type="text" placeholder="ZIP"
                        value={data.facilityInfo.zipCode}
                        onChange={e => updateNested('facilityInfo', 'zipCode', e.target.value)}
                        className="rounded-lg border-slate-200 bg-white border px-2 text-sm font-mono"
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">Facility NPI (Box 32a)</label>
                    <input
                      type="text" value={data.facilityInfo.npi}
                      onChange={e => updateNested('facilityInfo', 'npi', e.target.value)}
                      className="w-full rounded-lg border-slate-200 bg-white border px-4 py-3 text-sm font-mono tracking-widest font-black"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-900 rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none"></div>
                
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mb-2 relative z-10">Billing Entity Profile</h3>
                
                <div className="space-y-4 relative z-10">
                  <input
                    type="text" placeholder="LEGAL BUSINESS NAME"
                    value={data.billingProviderInfo.name}
                    onChange={e => updateNested('billingProviderInfo', 'name', e.target.value.toUpperCase())}
                    className="w-full rounded-xl border-slate-700 bg-slate-800 border px-5 py-4 text-sm font-black text-white focus:ring-2 focus:ring-primary transition-all uppercase placeholder:text-slate-600"
                  />
                  <input
                    type="text" placeholder="BUSINESS STREET ADDRESS"
                    value={data.billingProviderInfo.street}
                    onChange={e => updateNested('billingProviderInfo', 'street', e.target.value)}
                    className="w-full rounded-xl border-slate-700 bg-slate-800 border px-5 py-3 text-sm text-slate-300 focus:ring-2 focus:ring-primary transition-all placeholder:text-slate-600"
                  />
                  <div className="grid grid-cols-4 gap-2">
                    <input
                      type="text" placeholder="CITY"
                      value={data.billingProviderInfo.city}
                      onChange={e => updateNested('billingProviderInfo', 'city', e.target.value)}
                      className="col-span-2 rounded-xl border-slate-700 bg-slate-800 border px-4 py-3 text-sm text-slate-300"
                    />
                    <input
                      type="text" placeholder="ST" maxLength={2}
                      value={data.billingProviderInfo.state}
                      onChange={e => updateNested('billingProviderInfo', 'state', e.target.value.toUpperCase())}
                      className="rounded-xl border-slate-700 bg-slate-800 border px-2 text-center text-sm font-black text-white"
                    />
                    <input
                      type="text" placeholder="ZIP"
                      value={data.billingProviderInfo.zipCode}
                      onChange={e => updateNested('billingProviderInfo', 'zipCode', e.target.value)}
                      className="rounded-xl border-slate-700 bg-slate-800 border px-2 text-sm font-mono text-slate-400"
                    />
                  </div>
                  <input
                    type="text" placeholder="CONTACT PHONE"
                    value={data.billingProviderInfo.phone}
                    onChange={e => updateNested('billingProviderInfo', 'phone', e.target.value)}
                    className="w-full rounded-xl border-slate-700 bg-slate-800 border px-5 py-3 text-sm text-slate-300 tracking-widest"
                  />
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Billing NPI (Box 33a)</label>
                      <input
                        type="text" value={data.billingProviderInfo.npi}
                        onChange={e => updateNested('billingProviderInfo', 'npi', e.target.value)}
                        className="w-full rounded-xl border-slate-700 bg-slate-800 border px-4 py-3 text-sm font-mono font-black text-primary tracking-widest"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 block">Legacy ID (Box 33b)</label>
                      <input
                        type="text" value={data.billingProviderInfo.otherId}
                        onChange={e => updateNested('billingProviderInfo', 'otherId', e.target.value)}
                        className="w-full rounded-xl border-slate-700 bg-slate-800 border px-4 py-3 text-sm font-mono text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 relative z-10">
                  <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2 block">Physician Attestation Date</label>
                    <input
                      type="date"
                      value={data.physicianSignatureDate}
                      onChange={e => updateData({ physicianSignatureDate: e.target.value })}
                      className="w-full rounded-lg border-primary/20 bg-primary/10 border px-4 py-2 text-sm text-white focus:ring-1 focus:ring-primary outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {handleStepRender()}
    </div>
  );
}
