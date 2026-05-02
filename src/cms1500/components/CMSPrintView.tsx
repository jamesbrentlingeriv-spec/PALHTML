/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import type { CMS1500Data } from "../types";

interface PrintViewProps {
  data: CMS1500Data;
}

const formatPhone = (phone: string = "") => {
  if (!phone || phone.length < 3) return "";
  return `( ${phone.slice(0, 3)} ) ${phone.slice(3)}`;
};

const splitCharge = (charge: string = "") => {
  if (!charge) return { dollars: "0", cents: "00" };
  const parts = charge.split(".");
  return { dollars: parts[0] || "0", cents: parts[1] || "00" };
};

function Field({
  top, left, children, width, align = "left",
}: {
  top: number; left: number; children: React.ReactNode; width?: number; align?: "left" | "center" | "right";
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: `${top}in`,
        left: `${left}in`,
        width: width ? `${width}in` : "auto",
        textAlign: align,
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "11pt",
        fontWeight: "bold",
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}

export default function CMSPrintView({ data }: PrintViewProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}${date.getFullYear().toString().slice(-2)}`;
  };

  const getDay = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "" : d.getDate().toString().padStart(2, "0");
  };
  const getMonth = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "" : (d.getMonth() + 1).toString().padStart(2, "0");
  };
  const getYear = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "" : d.getFullYear().toString().slice(-2);
  };

  return (
    <div
      className="print-view relative bg-white overflow-hidden shadow-sm"
      style={{ width: "8.5in", height: "11in", padding: 0, margin: 0 }}
    >
      {/* CMS Form background — screen only for alignment, hidden when printing */}
      <iframe
        src="/cms1500-form.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH"
        className="cms-form-bg"
        style={{
          position: "absolute",
          top: 0, left: 0,
          width: "8.5in", height: "11in",
          border: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
        title="CMS-1500 Form Background"
      />

      {/* All data fields sit above the background */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Box 1 - Program Type */}
        {data.programType === "MEDICARE"  && <Field top={0.53} left={0.71}>X</Field>}
        {data.programType === "MEDICAID"  && <Field top={0.53} left={1.46}>X</Field>}
        {data.programType === "TRICARE"   && <Field top={0.53} left={2.26}>X</Field>}
        {data.programType === "CHAMPVA"   && <Field top={0.53} left={3.03}>X</Field>}
        {data.programType === "GROUP"     && <Field top={0.53} left={3.7}>X</Field>}
        {data.programType === "FECA"      && <Field top={0.53} left={4.46}>X</Field>}
        {data.programType === "OTHER"     && <Field top={0.53} left={5.1}>X</Field>}

        {/* 1a. Insured's ID */}
        <Field top={0.55} left={5.6} width={2.7}>{data.insuredId}</Field>

        {/* 2. Patient's Name */}
        <Field top={0.92} left={0.15} width={3.3}>{data.patientName}</Field>

        {/* 3. Patient Birth Date */}
        <Field top={0.92} left={4.45}>{getMonth(data.patientBirthDate)}</Field>
        <Field top={0.92} left={4.75}>{getDay(data.patientBirthDate)}</Field>
        <Field top={0.92} left={5.04}>{getYear(data.patientBirthDate)}</Field>

        {/* 3. Sex */}
        {data.patientSex === "M" && <Field top={0.92} left={5.45}>X</Field>}
        {data.patientSex === "F" && <Field top={0.92} left={6.03}>X</Field>}

        {/* 4. Insured's Name */}
        <Field top={0.92} left={6.5} width={3.3}>
          {data.insuredName || (data.patientRelationship === "SELF" ? data.patientName : "")}
        </Field>

        {/* 5. Patient's Address */}
        <Field top={1.22} left={0.15}>{data.patientAddress.street}</Field>
        <Field top={1.53} left={0.15}>{data.patientAddress.city}</Field>
        <Field top={1.53} left={3.05}>{data.patientAddress.state}</Field>
        <Field top={1.84} left={0.15}>{data.patientAddress.zipCode}</Field>
        <Field top={1.84} left={1.9}>{formatPhone(data.patientAddress.phone)}</Field>

        {/* 6. Relationship */}
        {data.patientRelationship === "SELF"   && <Field top={1.22} left={4.45}>X</Field>}
        {data.patientRelationship === "SPOUSE" && <Field top={1.22} left={4.9}>X</Field>}
        {data.patientRelationship === "CHILD"  && <Field top={1.22} left={5.46}>X</Field>}
        {data.patientRelationship === "OTHER"  && <Field top={1.22} left={6.03}>X</Field>}

        {/* 7. Insured's Address */}
        {data.patientRelationship !== "SELF" && (
          <>
            <Field top={1.22} left={6.5}>{data.insuredAddress.street}</Field>
            <Field top={1.53} left={6.5}>{data.insuredAddress.city}</Field>
            <Field top={1.53} left={7.8}>{data.insuredAddress.state}</Field>
            <Field top={1.84} left={6.5}>{data.insuredAddress.zipCode}</Field>
          </>
        )}

        {/* 10. Condition Related To */}
        {data.conditionRelatedTo.employment  ? <Field top={2.15} left={4.46}>X</Field> : <Field top={2.15} left={5.04}>X</Field>}
        {data.conditionRelatedTo.autoAccident ? <Field top={2.46} left={4.46}>X</Field> : <Field top={2.46} left={5.04}>X</Field>}
        {data.conditionRelatedTo.autoAccident && <Field top={2.46} left={5.46}>{data.conditionRelatedTo.place}</Field>}
        {data.conditionRelatedTo.otherAccident ? <Field top={2.77} left={4.46}>X</Field> : <Field top={2.77} left={5.04}>X</Field>}

        {/* 11. Insured's Policy/Group */}
        <Field top={2.15} left={6.5}>{data.insuredGroupNumber}</Field>
        <Field top={2.77} left={6.5}>{data.insuredPlanName}</Field>

        {/* 12. Patient's Signature */}
        <Field top={3.45} left={1.2}>SIGNATURE ON FILE</Field>
        <Field top={3.45} left={3.8}>{formatDate(data.patientSignatureDate)}</Field>

        {/* 13. Insured's Signature */}
        {data.insuredSignatureAuthorized && <Field top={3.45} left={6.8}>SIGNATURE ON FILE</Field>}

        {/* 14. Date of Illness */}
        <Field top={4.1} left={0.15}>{getMonth(data.dateOfIllness)} {getDay(data.dateOfIllness)} {getYear(data.dateOfIllness)}</Field>
        <Field top={4.1} left={1.3}>{data.dateOfIllnessQual}</Field>

        {/* 17. Referring Provider */}
        <Field top={4.1} left={4.45}>
          {data.referringProviderQual && `${data.referringProviderQual} `}{data.referringProviderName}
        </Field>
        <Field top={4.4} left={5.6} width={1}>{data.referringProviderNpi}</Field>

        {/* 21. Diagnosis Codes */}
        <Field top={5.0} left={6.2}>{data.diagnosisCodeIcd}</Field>
        {data.diagnosisCodes.slice(0, 4).map((code, idx) => (
          <Field key={idx} top={5.2 + (idx > 1 ? 0.3 : 0)} left={0.3 + (idx % 2 === 1 ? 1.5 : 0)}>
            {code}
          </Field>
        ))}

        {/* 23. Prior Auth */}
        <Field top={5.7} left={4.45}>{data.priorAuthNumber}</Field>

        {/* 24. Service Lines */}
        {data.serviceLines.slice(0, 6).map((line, idx) => {
          const rowTop = 6.35 + idx * 0.31;
          const charge = splitCharge(line.charges);
          return (
            <React.Fragment key={idx}>
              <Field top={rowTop} left={0.15}>{line.fromDate}</Field>
              <Field top={rowTop} left={1.15}>{line.toDate}</Field>
              <Field top={rowTop} left={2.05}>{line.placeOfService}</Field>
              <Field top={rowTop} left={2.35}>{line.emergency ? "X" : ""}</Field>
              <Field top={rowTop} left={2.65}>{line.cptCode}</Field>
              <Field top={rowTop} left={3.55}>{line.modifier}</Field>
              <Field top={rowTop} left={4.0}>{line.diagnosisPointer}</Field>
              <Field top={rowTop} left={4.5} width={0.7} align="right">{charge.dollars}</Field>
              <Field top={rowTop} left={5.22} width={0.2}>{charge.cents}</Field>
              <Field top={rowTop} left={5.45} width={0.3} align="center">{line.daysOrUnits}</Field>
              <Field top={rowTop} left={7.35} width={1.0}>{line.renderingProviderNpi}</Field>
            </React.Fragment>
          );
        })}

        {/* 25. Federal Tax ID */}
        <Field top={8.55} left={0.15}>{data.taxId}</Field>
        {data.taxIdType === "SSN" && <Field top={8.55} left={2.35}>X</Field>}
        {data.taxIdType === "EIN" && <Field top={8.55} left={2.65}>X</Field>}

        {/* 26. Patient Account No */}
        <Field top={8.55} left={3.0}>{data.patientAccountNo}</Field>

        {/* 27. Accept Assignment */}
        {data.acceptAssignment  ? <Field top={8.55} left={4.7}>X</Field> : <Field top={8.55} left={5.3}>X</Field>}

        {/* 28. Total Charge */}
        {(() => { const tc = splitCharge(data.totalCharge); return (<><Field top={8.55} left={5.8} width={0.8} align="right">{tc.dollars}</Field><Field top={8.55} left={6.65}>{tc.cents}</Field></>); })()}

        {/* 29. Amount Paid */}
        {(() => { const ap = splitCharge(data.amountPaid); return (<><Field top={8.55} left={7.0} width={0.6} align="right">{ap.dollars}</Field><Field top={8.55} left={7.65}>{ap.cents}</Field></>); })()}

        {/* 31. Signature of Physician */}
        <Field top={9.1} left={0.15}>SIGNATURE ON FILE</Field>
        <Field top={9.1} left={2.8}>{formatDate(data.physicianSignatureDate)}</Field>

        {/* 32. Facility Info */}
        <div style={{ position: "absolute", top: "8.85in", left: "3.5in", width: "2.8in", fontFamily: '"Courier New", Courier, monospace', fontSize: "9pt", lineHeight: 1.1 }}>
          <div>{data.facilityInfo.name}</div>
          <div>{data.facilityInfo.street}</div>
          <div>{data.facilityInfo.city} {data.facilityInfo.state} {data.facilityInfo.zipCode}</div>
        </div>
        <Field top={9.6} left={4.5}>{data.facilityInfo.npi}</Field>

        {/* 33. Billing Provider */}
        <div style={{ position: "absolute", top: "8.85in", left: "6.5in", width: "2in", fontFamily: '"Courier New", Courier, monospace', fontSize: "9pt", lineHeight: 1.1 }}>
          <div>{data.billingProviderInfo.name}</div>
          <div>{data.billingProviderInfo.street}</div>
          <div>{data.billingProviderInfo.city} {data.billingProviderInfo.state} {data.billingProviderInfo.zipCode}</div>
          <div style={{ marginTop: "0.1in" }}>{formatPhone(data.billingProviderInfo.phone)}</div>
        </div>
        <Field top={9.6} left={7.5}>{data.billingProviderInfo.npi}</Field>
        <Field top={9.6} left={6.5}>{data.billingProviderInfo.otherId}</Field>

      </div>{/* end fields wrapper */}

      <style>{`
        @media print {
          body { background: white !important; margin: 0; padding: 0; }
          .print-view { margin: 0 !important; box-shadow: none !important; }
          .cms-form-bg { display: none !important; }
          header, footer, .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
