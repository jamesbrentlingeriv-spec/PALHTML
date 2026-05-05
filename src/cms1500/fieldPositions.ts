export interface FieldPosition {
  top: number;
  left: number;
  width?: number;
  align?: "left" | "center" | "right";
}

export const FIELD_POSITIONS: Record<string, FieldPosition | number> = {
  // Box 1 - Insurance type checkboxes (top row, ~0.45in from top)
  box1_medicare: { top: 0.42, left: 0.70 },
  box1_medicaid: { top: 0.42, left: 1.40 },
  box1_tricare: { top: 0.42, left: 2.15 },
  box1_champva: { top: 0.42, left: 2.95 },
  box1_group: { top: 0.42, left: 3.65 },
  box1_feca: { top: 0.42, left: 4.35 },
  box1_other: { top: 0.42, left: 5.05 },

  // Box 1a - Insured's ID Number
  insuredId: { top: 0.43, left: 5.55, width: 2.75 },

  // Box 2 - Patient Name
  patientName: { top: 0.78, left: 0.15, width: 3.3 },

  // Box 3 - Patient DOB (MM DD YY) and Sex
  patientDobMonth: { top: 0.78, left: 4.30 },
  patientDobDay: { top: 0.78, left: 4.62 },
  patientDobYear: { top: 0.78, left: 4.92 },
  patientSexM: { top: 0.78, left: 5.40 },
  patientSexF: { top: 0.78, left: 6.00 },

  // Box 4 - Insured's Name
  insuredName: { top: 0.78, left: 6.40, width: 3.3 },

  // Box 5 - Patient Address
  patientStreet: { top: 1.08, left: 0.15, width: 4.0 },
  patientCity: { top: 1.38, left: 0.15, width: 2.8 },
  patientState: { top: 1.38, left: 3.00 },
  patientZip: { top: 1.68, left: 0.15 },
  patientPhone: { top: 1.68, left: 1.50, width: 2.0 },

  // Box 6 - Patient Relationship to Insured
  relSelf: { top: 1.08, left: 4.40 },
  relSpouse: { top: 1.08, left: 4.88 },
  relChild: { top: 1.08, left: 5.40 },
  relOther: { top: 1.08, left: 5.95 },

  // Box 7 - Insured's Address (only if different from patient)
  insuredStreet: { top: 1.08, left: 6.40, width: 2.0 },
  insuredCity: { top: 1.38, left: 6.40, width: 1.3 },
  insuredState: { top: 1.38, left: 7.75 },
  insuredZip: { top: 1.68, left: 6.40 },

  // Box 10 - Is condition related to... checkboxes
  condEmploymentYes: { top: 2.05, left: 4.40 },
  condEmploymentNo: { top: 2.05, left: 5.00 },
  condAutoYes: { top: 2.35, left: 4.40 },
  condAutoNo: { top: 2.35, left: 5.00 },
  condAutoPlace: { top: 2.35, left: 5.40, width: 0.50 },
  condOtherYes: { top: 2.65, left: 4.40 },
  condOtherNo: { top: 2.65, left: 5.00 },

  // Box 11 - Insured's Policy/Group Number
  insuredGroupNum: { top: 2.05, left: 6.40, width: 2.0 },
  insuredPlanName: { top: 2.65, left: 6.40, width: 2.0 },

  // Box 12 - Patient Signature
  patientSig: { top: 3.38, left: 1.00, width: 2.5 },
  patientSigDate: { top: 3.38, left: 3.80 },

  // Box 13 - Insured's Signature
  insuredSig: { top: 3.38, left: 6.40, width: 2.0 },

  // Box 14 - Date of Current Illness
  dateIllness: { top: 3.95, left: 0.15, width: 0.80 },
  dateIllnessQual: { top: 3.95, left: 1.30, width: 0.40 },

  // Box 17 - Referring Provider
  referringProv: { top: 3.95, left: 4.40, width: 1.20 },
  referringNpi: { top: 4.25, left: 5.80, width: 1.00 },

  // Box 21 - Diagnosis Codes
  diagIcdInd: { top: 4.80, left: 6.30, width: 0.30 },
  diagA: { top: 5.10, left: 0.25, width: 1.40 },
  diagB: { top: 5.10, left: 1.75, width: 1.40 },
  diagC: { top: 5.40, left: 0.25, width: 1.40 },
  diagD: { top: 5.40, left: 1.75, width: 1.40 },

  // Box 23 - Prior Authorization Number
  priorAuth: { top: 5.65, left: 4.40, width: 1.50 },

  // Service line positions (Box 24)
  serviceRowBaseTop: 6.25,
  serviceRowHeight: 0.31,

  serviceFrom: 0.15,
  serviceTo: 1.15,
  servicePos: 2.05,
  serviceEmerg: 2.35,
  serviceCpt: 2.65,
  serviceMod: 3.55,
  serviceDiag: 4.00,
  serviceChargeDol: 4.50,
  serviceChargeCen: 5.22,
  serviceUnits: 5.45,
  serviceRendNpi: 7.35,

  // Box 25 - Federal Tax ID Number
  taxId: { top: 8.40, left: 0.15, width: 1.60 },
  taxSsn: { top: 8.40, left: 2.30 },
  taxEin: { top: 8.40, left: 2.65 },

  // Box 26 - Patient Account Number
  acctNo: { top: 8.40, left: 3.00, width: 1.40 },

  // Box 27 - Accept Assignment
  acceptYes: { top: 8.40, left: 4.70 },
  acceptNo: { top: 8.40, left: 5.30 },

  // Box 28 - Total Charge
  totalDol: { top: 8.40, left: 5.80, width: 0.75, align: "right" as const },
  totalCen: { top: 8.40, left: 6.60, width: 0.25 },

  // Box 29 - Amount Paid
  paidDol: { top: 8.40, left: 6.95, width: 0.60, align: "right" as const },
  paidCen: { top: 8.40, left: 7.60, width: 0.25 },

  // Box 31 - Physician Signature
  physSig: { top: 8.95, left: 0.15, width: 2.50 },
  physSigDate: { top: 8.95, left: 2.80, width: 1.00 },

  // Box 32 - Service Facility Location
  facilityNpi: { top: 9.45, left: 4.40, width: 1.20 },

  // Box 33 - Billing Provider
  billingNpi: { top: 9.45, left: 7.40, width: 1.00 },
  billingId: { top: 9.45, left: 6.40, width: 1.00 },
};