export interface FieldPosition {
  top: number;
  left: number;
  width?: number;
  align?: "left" | "center" | "right";
}

export const FIELD_POSITIONS: Record<string, FieldPosition | number> = {
  // Box 1 Program/Medicare/Medicaid etc checkboxes (top row)
  box1_medicare: { top: 0.48, left: 0.71 },
  box1_medicaid: { top: 0.48, left: 1.46 },
  box1_tricare: { top: 0.48, left: 2.26 },
  box1_champva: { top: 0.48, left: 3.03 },
  box1_group: { top: 0.48, left: 3.7 },
  box1_feca: { top: 0.48, left: 4.46 },
  box1_other: { top: 0.48, left: 5.1 },

  // 1a Insured ID
  insuredId: { top: 0.5, left: 5.6, width: 2.7 },

  // 2 Patient Name
  patientName: { top: 0.87, left: 0.15, width: 3.3 },

  // 3 Patient DOB MM DD YY
  patientDobMonth: { top: 0.87, left: 4.45 },
  patientDobDay: { top: 0.87, left: 4.75 },
  patientDobYear: { top: 0.87, left: 5.04 },

  // 3 Sex M/F
  patientSexM: { top: 0.87, left: 5.45 },
  patientSexF: { top: 0.87, left: 6.03 },

  // 4 Insured Name
  insuredName: { top: 0.87, left: 6.5, width: 3.3 },

  // 5 Patient Address lines
  patientStreet: { top: 1.17, left: 0.15 },
  patientCity: { top: 1.48, left: 0.15 },
  patientState: { top: 1.48, left: 3.05 },
  patientZip: { top: 1.79, left: 0.15 },
  patientPhone: { top: 1.79, left: 1.9 },

  // 6 Relationship checkboxes
  relSelf: { top: 1.17, left: 4.45 },
  relSpouse: { top: 1.17, left: 4.9 },
  relChild: { top: 1.17, left: 5.46 },
  relOther: { top: 1.17, left: 6.03 },

  // 7 Insured Address (conditional)
  insuredStreet: { top: 1.17, left: 6.5 },
  insuredCity: { top: 1.48, left: 6.5 },
  insuredState: { top: 1.48, left: 7.8 },
  insuredZip: { top: 1.79, left: 6.5 },

  // 10 Condition related checkboxes
  condEmploymentYes: { top: 2.1, left: 4.46 },
  condEmploymentNo: { top: 2.1, left: 5.04 },
  condAutoYes: { top: 2.41, left: 4.46 },
  condAutoNo: { top: 2.41, left: 5.04 },
  condAutoPlace: { top: 2.41, left: 5.46 },
  condOtherYes: { top: 2.72, left: 4.46 },
  condOtherNo: { top: 2.72, left: 5.04 },

  // 11 Insured policy/group
  insuredGroupNum: { top: 2.1, left: 6.5 },
  insuredPlanName: { top: 2.72, left: 6.5 },

  // 12 Patient sig
  patientSig: { top: 3.4, left: 1.2 },
  patientSigDate: { top: 3.4, left: 3.8 },

  // 13 Insured sig
  insuredSig: { top: 3.4, left: 6.8 },

  // 14 Date illness
  dateIllness: { top: 4.05, left: 0.15 },
  dateIllnessQual: { top: 4.05, left: 1.3 },

  // 17 Referring
  referringProv: { top: 4.05, left: 4.45 },
  referringNpi: { top: 4.35, left: 5.6, width: 1 },

  // 21 Diagnosis pointers A B C D etc
  diagIcdInd: { top: 4.95, left: 6.2 },
  diagA: { top: 5.15, left: 0.3 },
  diagB: { top: 5.15, left: 1.8 },
  diagC: { top: 5.45, left: 0.3 },
  diagD: { top: 5.45, left: 1.8 },

  // 23 Prior auth
  priorAuth: { top: 5.65, left: 4.45 },

  // Service lines 24A-F, rowTop base 6.30 step 0.31in
  serviceRowBaseTop: 6.3,
  serviceRowHeight: 0.31,

  // Service col lefts: from 0.15,1.15,2.05,2.35,2.65,3.55,4.0,4.5,5.22,5.45,7.35
  serviceFrom: 0.15,
  serviceTo: 1.15,
  servicePos: 2.05,
  serviceEmerg: 2.35,
  serviceCpt: 2.65,
  serviceMod: 3.55,
  serviceDiag: 4.0,
  serviceChargeDol: 4.5,
  serviceChargeCen: 5.22,
  serviceUnits: 5.45,
  serviceRendNpi: 7.35,

  // 25 Tax ID
  taxId: { top: 8.5, left: 0.15 },
  taxSsn: { top: 8.5, left: 2.35 },
  taxEin: { top: 8.5, left: 2.65 },

  // 26 Acct no
  acctNo: { top: 8.5, left: 3.0 },

  // 27 Accept assign
  acceptYes: { top: 8.5, left: 4.7 },
  acceptNo: { top: 8.5, left: 5.3 },

  // 28 Total charge
  totalDol: { top: 8.5, left: 5.8, width: 0.8, align: "right" as const },
  totalCen: { top: 8.5, left: 6.65 },

  // 29 Paid
  paidDol: { top: 8.5, left: 7.0, width: 0.6, align: "right" as const },
  paidCen: { top: 8.5, left: 7.65 },

  // 31 Phys sig
  physSig: { top: 9.05, left: 0.15 },
  physSigDate: { top: 9.05, left: 2.8 },

  // 32 Facility multiline top 8.80 left 3.50 width 2.8, npi top9.55 left4.50
  facilityNpi: { top: 9.55, left: 4.5 },

  // 33 Billing multiline top 8.80 left 6.50 width 2.0, npi top9.55 left7.50, id top9.55 left6.50
  billingNpi: { top: 9.55, left: 7.5 },
  billingId: { top: 9.55, left: 6.5 },
};