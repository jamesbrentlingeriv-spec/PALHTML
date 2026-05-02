/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * CMSPrintView - Refactored with fieldPositions.ts for precise 02/12 alignment
 */

import React from "react";
import type { CMS1500Data } from "../types";
import { FIELD_POSITIONS } from "../fieldPositions";
import type { FieldPosition } from "../fieldPositions";

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
  return { dollars: parts[0] || "0", cents: parts[1]?.padEnd(2, "0") || "00" };
};

function Field({
  position,
  children,
  width,
  align = "left",
}: {
  position: string | FieldPosition;
  children: React.ReactNode;
  width?: number;
  align?: "left" | "center" | "right";
}) {
  // 类型守卫函数
  function isFieldPosition(pos: string | FieldPosition | number): pos is FieldPosition {
    return typeof pos === 'object' && pos !== null && 'top' in pos && 'left' in pos;
  }

  let pos: FieldPosition | undefined;

  if (typeof position === 'string') {
    // 如果position是字符串，则从FIELD_POSITIONS中获取对应的FieldPosition
    const fieldPos = FIELD_POSITIONS[position];
    // 验证 fieldPos 是否为 FieldPosition 对象，而不是 number 类型
    if (isFieldPosition(fieldPos)) {
      pos = fieldPos;
    } else {
      // 如果 fieldPos 是 number 类型，说明这是一个部分值，不能用作 FieldPosition
      console.error(`Field position "${position}" refers to a numeric value, not a FieldPosition object`);
      return null;
    }
  } else if (isFieldPosition(position)) {
    // 如果position已经是FieldPosition对象，则直接使用
    pos = position;
  }

  // 确保pos不为undefined
  if (!pos) {
    console.error(`Field position "${position}" not found in FIELD_POSITIONS`);
    return null;
  }
  
  return (
    <div
      style={{
        position: "absolute",
        top: `${pos.top}in`,
        left: `${pos.left}in`,
        width: width ? `${width}in` : pos.width ? `${pos.width}in` : "auto",
        textAlign: pos.align || align,
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
    return isNaN(d.getTime())
      ? ""
      : (d.getMonth() + 1).toString().padStart(2, "0");
  };
  const getYear = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "" : d.getFullYear().toString().slice(-2);
  };

  const serviceRowTop = (idx: number) =>
    Number(FIELD_POSITIONS.serviceRowBaseTop) +
    idx * Number(FIELD_POSITIONS.serviceRowHeight);

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
          top: 0,
          left: 0,
          width: "8.5in",
          height: "11in",
          border: "none",
          pointerEvents: "none",
          zIndex: 0,
        }}
        title="CMS-1500 Form Background"
      />

      {/* All data fields sit above the background */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Box 1 - Program Type */}
        {data.programType === "MEDICARE" && (
          <Field position="box1_medicare">X</Field>
        )}
        {data.programType === "MEDICAID" && (
          <Field position="box1_medicaid">X</Field>
        )}
        {data.programType === "TRICARE" && (
          <Field position="box1_tricare">X</Field>
        )}
        {data.programType === "CHAMPVA" && (
          <Field position="box1_champva">X</Field>
        )}
        {data.programType === "GROUP" && <Field position="box1_group">X</Field>}
        {data.programType === "FECA" && <Field position="box1_feca">X</Field>}
        {data.programType === "OTHER" && <Field position="box1_other">X</Field>}

        {/* 1a. Insured's ID */}
        <Field position="insuredId">{data.insuredId}</Field>

        {/* 2. Patient's Name */}
        <Field position="patientName">{data.patientName}</Field>

        {/* 3. Patient Birth Date */}
        <Field position="patientDobMonth">
          {getMonth(data.patientBirthDate)}
        </Field>
        <Field position="patientDobDay">{getDay(data.patientBirthDate)}</Field>
        <Field position="patientDobYear">
          {getYear(data.patientBirthDate)}
        </Field>

        {/* 3. Sex */}
        {data.patientSex === "M" && <Field position="patientSexM">X</Field>}
        {data.patientSex === "F" && <Field position="patientSexF">X</Field>}

        {/* 4. Insured's Name */}
        <Field position="insuredName">
          {data.insuredName ||
            (data.patientRelationship === "SELF" ? data.patientName : "")}
        </Field>

        {/* 5. Patient's Address */}
        <Field position="patientStreet">{data.patientAddress.street}</Field>
        <Field position="patientCity">{data.patientAddress.city}</Field>
        <Field position="patientState">{data.patientAddress.state}</Field>
        <Field position="patientZip">{data.patientAddress.zipCode}</Field>
        <Field position="patientPhone">
          {formatPhone(data.patientAddress.phone)}
        </Field>

        {/* 6. Relationship */}
        {data.patientRelationship === "SELF" && (
          <Field position="relSelf">X</Field>
        )}
        {data.patientRelationship === "SPOUSE" && (
          <Field position="relSpouse">X</Field>
        )}
        {data.patientRelationship === "CHILD" && (
          <Field position="relChild">X</Field>
        )}
        {data.patientRelationship === "OTHER" && (
          <Field position="relOther">X</Field>
        )}

        {/* 7. Insured's Address */}
        {data.patientRelationship !== "SELF" && (
          <>
            <Field position="insuredStreet">{data.insuredAddress.street}</Field>
            <Field position="insuredCity">{data.insuredAddress.city}</Field>
            <Field position="insuredState">{data.insuredAddress.state}</Field>
            <Field position="insuredZip">{data.insuredAddress.zipCode}</Field>
          </>
        )}

        {/* 10. Condition Related To */}
        {data.conditionRelatedTo.employment ? (
          <Field position="condEmploymentYes">X</Field>
        ) : (
          <Field position="condEmploymentNo">X</Field>
        )}
        {data.conditionRelatedTo.autoAccident ? (
          <Field position="condAutoYes">X</Field>
        ) : (
          <Field position="condAutoNo">X</Field>
        )}
        {data.conditionRelatedTo.autoAccident && (
          <Field position="condAutoPlace">
            {data.conditionRelatedTo.place}
          </Field>
        )}
        {data.conditionRelatedTo.otherAccident ? (
          <Field position="condOtherYes">X</Field>
        ) : (
          <Field position="condOtherNo">X</Field>
        )}

        {/* 11. Insured's Policy/Group */}
        <Field position="insuredGroupNum">{data.insuredGroupNumber}</Field>
        <Field position="insuredPlanName">{data.insuredPlanName}</Field>

        {/* 12. Patient's Signature */}
        <Field position="patientSig">SIGNATURE ON FILE</Field>
        <Field position="patientSigDate">
          {formatDate(data.patientSignatureDate)}
        </Field>

        {/* 13. Insured's Signature */}
        {data.insuredSignatureAuthorized && (
          <Field position="insuredSig">SIGNATURE ON FILE</Field>
        )}

        {/* 14. Date of Illness */}
        <Field position="dateIllness">
          {getMonth(data.dateOfIllness)} {getDay(data.dateOfIllness)}{" "}
          {getYear(data.dateOfIllness)}
        </Field>
        <Field position="dateIllnessQual">{data.dateOfIllnessQual}</Field>

        {/* 17. Referring Provider */}
        <Field position="referringProv">
          {data.referringProviderQual && `${data.referringProviderQual} `}
          {data.referringProviderName}
        </Field>
        <Field position="referringNpi">{data.referringProviderNpi}</Field>

        {/* 21. Diagnosis Codes */}
        <Field position="diagIcdInd">{data.diagnosisCodeIcd}</Field>
        {data.diagnosisCodes.slice(0, 4).map((code, idx) => (
          <Field
            key={idx}
            position={["diagA", "diagB", "diagC", "diagD"][idx] as string}
          >
            {code}
          </Field>
        ))}

        {/* 23. Prior Auth */}
        <Field position="priorAuth">{data.priorAuthNumber}</Field>

        {/* 24. Service Lines */}
        {data.serviceLines.slice(0, 6).map((line, idx) => {
          const rowTop = serviceRowTop(idx);
          const charge = splitCharge(line.charges);
          return (
            <React.Fragment key={idx}>
              <Field
                position={{ top: rowTop, left: Number(FIELD_POSITIONS.serviceFrom) }}
              >
                {line.fromDate}
              </Field>
              <Field
                position={{ top: rowTop, left: Number(FIELD_POSITIONS.serviceTo) }}
              >
                {line.toDate}
              </Field>
              <Field
                position={{ top: rowTop, left: Number(FIELD_POSITIONS.servicePos) }}
              >
                {line.placeOfService}
              </Field>
              <Field
                position={{ top: rowTop, left: Number(FIELD_POSITIONS.serviceEmerg) }}
              >
                {line.emergency ? "X" : ""}
              </Field>
              <Field
                position={{ top: rowTop, left: Number(FIELD_POSITIONS.serviceCpt) }}
              >
                {line.cptCode}
              </Field>
              <Field
                position={{ top: rowTop, left: Number(FIELD_POSITIONS.serviceMod) }}
              >
                {line.modifier}
              </Field>
              <Field
                position={{ top: rowTop, left: Number(FIELD_POSITIONS.serviceDiag) }}
              >
                {line.diagnosisPointer}
              </Field>
              <Field
                position={{
                  top: rowTop,
                  left: Number(FIELD_POSITIONS.serviceChargeDol),
                  align: "right",
                }}
                width={0.7}
              >
                {charge.dollars}
              </Field>
              <Field
                position={{
                  top: rowTop,
                  left: Number(FIELD_POSITIONS.serviceChargeCen),
                }}
                width={0.2}
              >
                {charge.cents}
              </Field>
              <Field
                position={{
                  top: rowTop,
                  left: Number(FIELD_POSITIONS.serviceUnits),
                  align: "center"
                }}
                width={0.3}
              >
                {line.daysOrUnits}
              </Field>
              <Field
                position={{
                  top: rowTop,
                  left: Number(FIELD_POSITIONS.serviceRendNpi),
                }}
                width={1.0}
              >
                {line.renderingProviderNpi}
              </Field>
            </React.Fragment>
          );
        })}

        {/* 25. Federal Tax ID */}
        <Field position="taxId">{data.taxId}</Field>
        {data.taxIdType === "SSN" && <Field position="taxSsn">X</Field>}
        {data.taxIdType === "EIN" && <Field position="taxEin">X</Field>}

        {/* 26. Patient Account No */}
        <Field position="acctNo">{data.patientAccountNo}</Field>

        {/* 27. Accept Assignment */}
        {data.acceptAssignment ? (
          <Field position="acceptYes">X</Field>
        ) : (
          <Field position="acceptNo">X</Field>
        )}

        {/* 28. Total Charge */}
        {(() => {
          const tc = splitCharge(data.totalCharge);
          return (
            <>
              <Field position="totalDol">{tc.dollars}</Field>
              <Field position="totalCen">{tc.cents}</Field>
            </>
          );
        })()}

        {/* 29. Amount Paid */}
        {(() => {
          const ap = splitCharge(data.amountPaid);
          return (
            <>
              <Field position="paidDol">{ap.dollars}</Field>
              <Field position="paidCen">{ap.cents}</Field>
            </>
          );
        })()}

        {/* 31. Signature of Physician */}
        <Field position="physSig">SIGNATURE ON FILE</Field>
        <Field position="physSigDate">
          {formatDate(data.physicianSignatureDate)}
        </Field>

        {/* 32. Facility Info */}
        <div
          style={{
            position: "absolute",
            top: "8.80in",
            left: "3.50in",
            width: "2.8in",
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "9pt",
            lineHeight: 1.1,
          }}
        >
          <div>{data.facilityInfo.name}</div>
          <div>{data.facilityInfo.street}</div>
          <div>
            {data.facilityInfo.city} {data.facilityInfo.state}{" "}
            {data.facilityInfo.zipCode}
          </div>
        </div>
        <Field position="facilityNpi">{data.facilityInfo.npi}</Field>

        {/* 33. Billing Provider */}
        <div
          style={{
            position: "absolute",
            top: "8.80in",
            left: "6.50in",
            width: "2.0in",
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: "9pt",
            lineHeight: 1.1,
          }}
        >
          <div>{data.billingProviderInfo.name}</div>
          <div>{data.billingProviderInfo.street}</div>
          <div>
            {data.billingProviderInfo.city} {data.billingProviderInfo.state}{" "}
            {data.billingProviderInfo.zipCode}
          </div>
          <div style={{ marginTop: "0.1in" }}>
            {formatPhone(data.billingProviderInfo.phone)}
          </div>
        </div>
        <Field position="billingNpi">{data.billingProviderInfo.npi}</Field>
        <Field position="billingId">{data.billingProviderInfo.otherId}</Field>
      </div>

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
