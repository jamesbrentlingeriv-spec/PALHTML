import { useForm, FormProvider, useFormContext, type Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FeeSlipSchema, type FeeSlipData } from './DrFeeSlipTypes';
import { Printer, Save, Check } from 'lucide-react';


// --- Components ---

const SectionHeader = ({ title }: { title: string }) => (
  <h2 className="text-center py-1 mb-1.5 bg-neutral-100 border-x-4 border-black text-[12px] font-black uppercase tracking-tight">{title}</h2>
);

const GroupTitle = ({ title }: { title: string }) => (
  <h3 className="font-black text-[11px] uppercase border-b border-black inline-block mb-1.5">{title}</h3>
);

const ProcedureItem = ({ label, code, name }: { label: string, code?: string, name: string }) => {
  const { register } = useFormContext<FeeSlipData>();
  return (
    <div className="flex items-center justify-between gap-1 py-0.5">
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <input type="checkbox" {...register(`procedures.${name}` as Path<FeeSlipData>)} className="w-3 h-3 shrink-0" />
        <span className="text-[10px] uppercase font-bold truncate">{label}</span>
      </div>
      {code && <span className="text-[9px] text-gray-500 font-mono shrink-0">{code}</span>}
      <input 
        type="text" 
        {...register(`procedureValues.${name}` as Path<FeeSlipData>)}
        className="w-12 border-b border-black text-right text-[10px] focus:outline-none" 
      />
    </div>
  );
};

const DiagnosisItem = ({ label, name }: { label: string, name: string }) => {
  const { register } = useFormContext<FeeSlipData>();
  return (
    <div className="flex items-start gap-1.5 py-0.5">
      <input type="checkbox" {...register(`diagnosis.${name}` as Path<FeeSlipData>)} className="w-3 h-3 mt-0.5 shrink-0" />
      <span className="text-[10px] uppercase font-bold leading-tight">{label}</span>
    </div>
  );
};

// --- Main Application ---

export default function DrFeeSlip() {
  const methods = useForm({
    resolver: zodResolver(FeeSlipSchema),
    defaultValues: {
      patientName: "",
      dateOfService: new Date().toISOString().split('T')[0],
      procedures: {},
      procedureValues: {},
      diagnosis: {},
      clMaterials: {
        sphere: "",
        toric: "",
        bifocal: "",
        extWear: "",
      },
      routineMedical: "",
      contactsOther: "",
      routine: false,
      contacts: false,
      both: false,
      total: 0,
      received: 0,
      paymentType: "",
      insUsed: "",
    }
  });

  const { handleSubmit, register } = methods;

  const onSubmit = (data: FeeSlipData) => {
    console.log("Form Data:", data);
    alert("Form submitted! Check console for data.");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-10 print:bg-white print:p-0 print:min-h-[calc(100vh-20px)]">
      {/* Floating Toolbar */}
      <div className="fixed top-4 right-4 flex flex-col gap-2 print:hidden z-50">
        <button 
          type="button"
          onClick={handlePrint}
          className="p-3 bg-black text-white hover:bg-neutral-800 transition-colors shadow-lg flex items-center gap-2 font-bold uppercase text-xs rounded-md"
        >
          <Printer size={16} /> Print Slip
        </button>
        <button 
          type="button"
          onClick={handleSubmit(onSubmit)}
          className="p-3 bg-neutral-200 text-black border-2 border-black hover:bg-neutral-300 transition-colors shadow-lg flex items-center gap-2 font-bold uppercase text-xs rounded-md"
        >
          <Save size={16} /> Save Record
        </button>
      </div>

      <div className="fee-slip-container print:shadow-none print:my-0 print:border-none print:w-full print:max-w-none print:flex print:flex-col print:justify-between print:min-h-[95vh] print:py-4 print:px-6">
        <FormProvider {...methods}>
          <form className="grid grid-cols-12 gap-x-4 gap-y-1 h-full flex-grow">

            {/* Header */}
            <div className="col-span-12 flex flex-row items-end gap-x-6 mb-2 print:mb-4 print:text-[14px]">
              <div className="flex-1 flex items-end gap-2 print:text-[14px]">
                <span className="font-black text-sm tracking-tighter uppercase shrink-0 print:text-[14px]">Patients Name:</span>
                <input 
                  {...methods.register("patientName")}
                  className="flex-1 border-b border-black uppercase py-0 focus:outline-none print:text-[14px]"
                />
              </div>
              <div className="w-1/3 flex items-end gap-2 print:text-[14px]">
                <span className="font-black text-sm tracking-tighter uppercase shrink-0 print:text-[14px]">Date of Service:</span>
                <input 
                  type="date"
                  {...methods.register("dateOfService")}
                  className="w-full border-b border-black py-0 focus:outline-none print:text-[14px]"
                />
              </div>
            </div>

            {/* Left Column: Procedures */}
            <div className="col-span-4 flex flex-col gap-4 border-r-2 border-neutral-200 pr-4 print:text-[10px] print:border-r-2 print:border-gray-300">
              <div>
                <SectionHeader title="Office Procedures" />
                <GroupTitle title="Routine Vision Exams" />
                <ProcedureItem label="Routine Vision W/Ref/NP" code="90620" name="v90620" />
                <ProcedureItem label="Routine Vision W/Ref/EP" code="90621" name="v90621" />
                
                <div className="mt-4">
                  <GroupTitle title="Contact Lens Services" />
                  <ProcedureItem label="Contact Lens Fit" code="92320" name="v92320" />
                  <div className="pl-6 flex flex-col">
                    <ProcedureItem label="Low" name="cl_low" />
                    <ProcedureItem label="Med" name="cl_med" />
                    <ProcedureItem label="High" name="cl_high" />
                  </div>
                  <ProcedureItem label="Bridge CL For Ocular Disease" code="92070" name="v92070" />
                </div>

                <div className="mt-4">
                  <GroupTitle title="Vision/Medical Exams" />
                  <ProcedureItem label="Eye Exam Int/NP" code="92002" name="v90620" />
                  <ProcedureItem label="Eye Exam Int/EP" code="92012" name="v92012" />
                  <ProcedureItem label="Eye Exam Xomp/NP" code="92004" name="v92004" />
                  <ProcedureItem label="Eye Exam Comp/EP" code="92014" name="v92014" />
                  <ProcedureItem label="Refraction" code="92015" name="v92015" />
                  <ProcedureItem label="Glaucoma Screening" code="92140" name="v92140" />
                </div>

                <div className="mt-4">
                  <GroupTitle title="Co-Management" />
                  <ProcedureItem label="Laser (IE YAG) Post-OP" code="66821-55" name="v66821" />
                  <ProcedureItem label="Int-Cap Cat 5x W/IOL P-OP" code="66822-55" name="v66822" />
                </div>

                <div className="mt-4">
                  <GroupTitle title="Vision Therapy" />
                  <ProcedureItem label="Sensormotor Exam" code="92060" name="v92060" />
                  <ProcedureItem label="Orthopic/Picoptic Training" code="92065" name="v92065" />
                </div>

                <div className="mt-4">
                  <GroupTitle title="Therapeutics" />
                  <ProcedureItem label="FB Removal, Conj Support" code="65205" name="v65205" />
                  <ProcedureItem label="FB Removal, Corneal NO SLE" code="65210" name="v65210" />
                  <ProcedureItem label="FB Removal, Corneal SLE" code="65222" name="v65222" />
                </div>
              </div>

              <div>
                <SectionHeader title="Special Diagnostic Testing" />
                <ProcedureItem label="Corneal Topography" code="92025" name="v92025" />
                <ProcedureItem label="Gonioscopy" code="92020" name="v92020" />
                <ProcedureItem label="Visual Field, Limited" code="92081" name="v92081" />
                <ProcedureItem label="Visual Field, Intermediate" code="92100" name="v92100" />
                <ProcedureItem label="Visual Field, Extended" code="92083" name="v92083" />
                <ProcedureItem label="Pachymetry (Uni/Bi)" code="76514" name="v76514" />
              </div>
            </div>

            {/* Middle Column: Diagnosis 1 */}
            <div className="col-span-4 flex flex-col gap-4 border-r-2 border-neutral-200 pr-4 print:text-[10px] print:border-r-2 print:border-gray-300">
              <div>
                <SectionHeader title="Conjunctiva" />
                <div className="grid grid-cols-1 gap-x-2">
                  <DiagnosisItem label="Conjunctivitus" name="conj_conjunctivitus" />
                  <DiagnosisItem label="Acute Atropic" name="conj_acute" />
                  <DiagnosisItem label="Chronic Allergic" name="conj_allergic" />
                  <DiagnosisItem label="Subconj Hemorrhage" name="conj_hemorrhage" />
                  <DiagnosisItem label="Pinguecula" name="conj_pinguecula" />
                </div>
              </div>

              <div>
                <SectionHeader title="Cornea" />
                <div className="grid grid-cols-1 gap-x-2">
                  <DiagnosisItem label="Abrasion, Scratch" name="corn_abrasion" />
                  <DiagnosisItem label="Dystrophy, Unsp" name="corn_dystrophy" />
                  <DiagnosisItem label="Edema, Unsp" name="corn_edema" />
                  <DiagnosisItem label="Ulcer, Central" name="corn_ulcer" />
                  <DiagnosisItem label="Dry Eye Syndrome" name="corn_dryeye" />
                  <DiagnosisItem label="Herpes Simplex" name="corn_herpes" />
                </div>
              </div>

              <div>
                <SectionHeader title="Eyelid/Adnexa" />
                <div className="grid grid-cols-1 gap-x-2">
                  <DiagnosisItem label="Black Eye" name="eye_black" />
                  <DiagnosisItem label="Chalazion" name="eye_chalazion" />
                  <DiagnosisItem label="Dermatitis" name="eye_dermatitis" />
                  <DiagnosisItem label="Entropion, Senile" name="eye_entropion" />
                  <DiagnosisItem label="Ectropion, Senile" name="eye_ectropion" />
                </div>
              </div>

              <div>
                <SectionHeader title="Glaucoma" />
                <div className="grid grid-cols-1 gap-x-2">
                  <DiagnosisItem label="Ocular Hypertension" name="glau_htn" />
                  <DiagnosisItem label="Open-Angle" name="glau_open" />
                  <DiagnosisItem label="Glaucoma Suspect" name="glau_suspect" />
                  <DiagnosisItem label="Angle Closure" name="glau_closure" />
                </div>
              </div>

              <div>
                <SectionHeader title="Optic Nerve" />
                <div className="grid grid-cols-1 gap-x-2">
                  <DiagnosisItem label="Drusen of Optic Disk" name="optic_drusen" />
                  <DiagnosisItem label="Optic Atrophy" name="optic_atrophy" />
                  <DiagnosisItem label="Optic Neuritis" name="optic_neuritis" />
                  <DiagnosisItem label="Psuedopapillidema" name="optic_pseudo" />
                </div>
              </div>

              <div>
                <GroupTitle title="Functional" />
                <DiagnosisItem label="Convergence Excess" name="func_conv_ex" />
                <DiagnosisItem label="Amblyopia" name="func_ambly" />
                <DiagnosisItem label="Diplopia" name="func_diplo" />
              </div>

              {/* Relocated Checkboxes */}
              <div className="mt-auto pt-4 flex justify-between items-center border-t border-black print:mt-2 print:pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer print:text-[12px]">
                  <input type="checkbox" {...register("routine")} className="checkbox-custom" />
                  <span className="label-text print:text-[12px]">Routine</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer print:text-[12px]">
                  <input type="checkbox" {...register("contacts")} className="checkbox-custom" />
                  <span className="label-text print:text-[12px]">Contacts</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer print:text-[12px]">
                  <input type="checkbox" {...register("both")} className="checkbox-custom" />
                  <span className="label-text print:text-[12px]">Both</span>
                </label>
              </div>
            </div>

            {/* Right Column: Retina & Summary */}
            <div className="col-span-4 flex flex-col gap-4 print:text-[10px]">
              <div>
                <SectionHeader title="Retina" />
                <div className="grid grid-cols-1 gap-x-2">
                  <DiagnosisItem label="CRAO / CRVO" name="ret_crao" />
                  <DiagnosisItem label="BRAO / BRVO" name="ret_brao" />
                  <DiagnosisItem label="Diabetic Retinopathy" name="ret_diab" />
                  <div className="pl-4">
                    <DiagnosisItem label="Mild / Moderate" name="ret_diab_m" />
                    <DiagnosisItem label="Severe" name="ret_diab_s" />
                  </div>
                  <DiagnosisItem label="Macular Degeneration" name="ret_mac" />
                  <DiagnosisItem label="CME / Edema" name="ret_cme" />
                  <DiagnosisItem label="Retinal Detachment" name="ret_detach" />
                  <DiagnosisItem label="PVD / Floaters" name="ret_pvd" />
                </div>
              </div>

              <div>
                <SectionHeader title="Other / Lens" />
                <div className="grid grid-cols-1">
                  <DiagnosisItem label="After Cataract" name="lens_after" />
                  <DiagnosisItem label="Cataract, Senile" name="lens_cat_sen" />
                  <DiagnosisItem label="Total / Mature" name="lens_cat_tot" />
                </div>
              </div>

              <div className="mt-4">
                <SectionHeader title="Contact Lens Materials" />
                <div className="grid grid-cols-4 gap-x-1 mb-2">
                  <div className="flex items-end gap-1">
                    <span className="text-[8px] font-bold">RT</span>
                    <input {...register("clMaterials.rt")} className="w-full border-b border-black focus:outline-none" />
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-[8px] font-bold">LT</span>
                    <input {...register("clMaterials.lt")} className="w-full border-b border-black focus:outline-none" />
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-[8px] font-bold">S</span>
                    <input {...register("clMaterials.s1")} className="w-full border-b border-black focus:outline-none" />
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-[8px] font-bold">S</span>
                    <input {...register("clMaterials.s2")} className="w-full border-b border-black focus:outline-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold uppercase">Sphere</span>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 text-[8px] font-bold">
                        <input type="radio" {...methods.register("clMaterials.sphere")} value="V2510" className="w-2.5 h-2.5" /> V2510
                      </label>
                      <label className="flex items-center gap-1 text-[8px] font-bold">
                        <input type="radio" {...methods.register("clMaterials.sphere")} value="V2520" className="w-2.5 h-2.5" /> V2520
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-bold uppercase">Toric</span>
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 text-[8px] font-bold">
                        <input type="radio" {...methods.register("clMaterials.toric")} value="V2511" className="w-2.5 h-2.5" /> V2511
                      </label>
                      <label className="flex items-center gap-1 text-[8px] font-bold">
                        <input type="radio" {...methods.register("clMaterials.toric")} value="V2521" className="w-2.5 h-2.5" /> V2521
                      </label>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Row: Summary Section (Right) and Doctor Info (Bottom left) */}
            <div className="col-span-12 mt-2 pt-2 flex justify-between items-end gap-12 print:flex-col print:items-start print:justify-between print:w-full print:mt-0 print:pt-0 print:flex-grow print:gap-0 print:pb-4 print:border-t-4 print:border-black">
              {/* Doctor Info moved to bottom left */}
              <div className="text-xl font-black italic leading-tight uppercase text-left border-t-4 border-black pt-2 pr-12 print:mt-0 print:pt-2 print:text-[10px] print:border-t-2 print:ml-0 print:w-auto print:text-left print:leading-tight print:pr-0 print:mb-0 print:pb-0">
                DRS. KLECKER AND ROBBINS<br />
                1555 E NEW CIRCLE STE 146<br />
                LEXINGTON, KY 40509<br />
                (859) 269-6921
              </div>
              
              {/* Summary Section moved to bottom right */}
              <div className="flex flex-col gap-2 min-w-[320px] border-t-8 border-black pt-2 print:mt-0 print:pt-0 print:w-full print:max-w-[400px] print:ml-auto print:text-[14px]">
                <div className="flex items-end justify-between gap-4 print:gap-8 print:text-[14px]">
                   <span className="font-black text-sm uppercase underline leading-tight print:text-[14px]">ROUTINE /<br />MEDICAL:</span>
                   <input {...methods.register("routineMedical")} className="w-32 border-b-2 border-black focus:outline-none print:text-[14px]" />
                </div>
                
                <div className="flex items-end justify-between gap-4 mt-2 print:gap-8 print:text-[14px]">
                   <span className="font-black text-sm uppercase leading-none print:text-[14px]">TOTAL :</span>
                   <div className="flex items-end gap-1 w-32 border-b-2 border-black print:text-[14px]">
                     <span className="text-base font-bold print:text-[14px]">$</span>
                     <input 
                       type="number" 
                       step="0.01"
                       {...methods.register("total", { valueAsNumber: true })} 
                       className="flex-1 text-left focus:outline-none bg-transparent print:text-[14px]" 
                     />
                   </div>
                </div>
                <div className="flex items-end justify-between gap-4 print:gap-8 print:text-[14px]">
                   <span className="font-black text-sm uppercase leading-none print:text-[14px]">RECIEVED:</span>
                   <div className="flex items-end gap-1 w-32 border-b-2 border-black print:text-[14px]">
                     <span className="text-base font-bold print:text-[14px]">$</span>
                     <input 
                       type="number" 
                       step="0.01"
                       {...methods.register("received", { valueAsNumber: true })} 
                       className="flex-1 text-left focus:outline-none bg-transparent print:text-[14px]" 
                     />
                   </div>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
      
      {/* Footer Info / Legend */}
      <div className="max-w-[1000px] mx-auto px-8 py-4 opacity-50 flex justify-between items-center print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold uppercase">
          <Check size={14} /> Auto-saving enabled
        </div>
        <div className="text-[10px] uppercase font-mono">
          Form ID: DSLIP-2026-BWR-V1
        </div>
      </div>
    </div>
  );
}