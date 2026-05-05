import { PDFDocument } from "pdf-lib";
import type { CMS1500Data } from "./types";

const formatDateMMDDYY = (dateStr: string) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  if (!year || !month || !day) return "";
  return `${month}${day}${year.slice(-2)}`;
};

const getForm = async (): Promise<ArrayBuffer> => {
  const resp = await fetch("/cms1500-form.pdf");
  if (!resp.ok) throw new Error("Failed to load CMS-1500 PDF form");
  return resp.arrayBuffer();
};

/**
 * Fill the CMS-1500 fillable PDF with the provided data
 * Returns a Uint8Array containing the filled PDF
 */
export async function fillCmsForm(data: CMS1500Data): Promise<Uint8Array> {
  const pdfBytes = await getForm();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  // Box 1 – Program Type checkboxes
  const programBoxes: Record<string, string> = {
    MEDICARE: "MEDICARE",
    MEDICAID: "MEDICAID",
    TRICARE: "TRICARE",
    CHAMPVA: "CHAMPVA",
    GROUP: "GROUP_HEALTH_PLAN",
    FECA: "FECA_BLACK_LUNG",
    OTHER: "OTHER",
  };
  const prog = programBoxes[data.programType];
  if (prog) {
    try {
      form.getCheckBox(prog).check();
    } catch {
      /* skip */
    }
  }

  // Box 1a – Insured ID
  try {
    form.getTextField("1A_INSURED_ID").setText(data.insuredId);
  } catch {
    /* skip */
  }

  // Box 2 – Patient Name
  try {
    form.getTextField("2_PATIENT_NAME").setText(data.patientName);
  } catch {
    /* skip */
  }

  // Box 3 – DOB
  if (data.patientBirthDate) {
    const [y, m, d] = data.patientBirthDate.split("-");
    try {
      form.getTextField("3_MM").setText(m || "");
    } catch {
      /* skip */
    }
    try {
      form.getTextField("3_DD").setText(d || "");
    } catch {
      /* skip */
    }
    try {
      form.getTextField("3_YY").setText((y || "").slice(-2));
    } catch {
      /* skip */
    }
  }
  if (data.patientSex === "M") {
    try {
      form.getCheckBox("3_SEX_M").check();
    } catch {
      /* skip */
    }
  } else if (data.patientSex === "F") {
    try {
      form.getCheckBox("3_SEX_F").check();
    } catch {
      /* skip */
    }
  }

  // Box 4 – Insured Name
  try {
    const insuredNameField = form.getTextField("4_INSURED_NAME");
    insuredNameField.setText(
      data.insuredName ||
        (data.patientRelationship === "SELF" ? data.patientName : ""),
    );
  } catch {
    /* skip */
  }

  // Box 5 – Patient Address
  try {
    form.getTextField("5_ADDRESS").setText(data.patientAddress.street);
  } catch {
    /* skip */
  }
  try {
    form.getTextField("5_CITY").setText(data.patientAddress.city);
  } catch {
    /* skip */
  }
  try {
    form.getTextField("5_STATE").setText(data.patientAddress.state);
  } catch {
    /* skip */
  }
  try {
    form.getTextField("5_ZIP").setText(data.patientAddress.zipCode);
  } catch {
    /* skip */
  }
  try {
    form.getTextField("5_PHONE").setText(data.patientAddress.phone);
  } catch {
    /* skip */
  }

  // Box 6 – Relationship
  const relMap: Record<string, string> = {
    SELF: "6_SELF",
    SPOUSE: "6_SPOUSE",
    CHILD: "6_CHILD",
    OTHER: "6_OTHER",
  };
  if (relMap[data.patientRelationship]) {
    try {
      form.getCheckBox(relMap[data.patientRelationship]).check();
    } catch {
      /* skip */
    }
  }

  // Box 7 – Insured Address (only if NOT Self)
  if (data.patientRelationship !== "SELF") {
    try {
      form.getTextField("7_ADDRESS").setText(data.insuredAddress.street);
    } catch {
      /* skip */
    }
    try {
      form.getTextField("7_CITY").setText(data.insuredAddress.city);
    } catch {
      /* skip */
    }
    try {
      form.getTextField("7_STATE").setText(data.insuredAddress.state);
    } catch {
      /* skip */
    }
    try {
      form.getTextField("7_ZIP").setText(data.insuredAddress.zipCode);
    } catch {
      /* skip */
    }
  }

  // Box 10 – Condition Related
  try {
    (data.conditionRelatedTo.employment
      ? form.getCheckBox("10A_YES")
      : form.getCheckBox("10A_NO")
    ).check();
  } catch {
    /* skip */
  }
  try {
    (data.conditionRelatedTo.autoAccident
      ? form.getCheckBox("10B_YES")
      : form.getCheckBox("10B_NO")
    ).check();
  } catch {
    /* skip */
  }
  if (data.conditionRelatedTo.autoAccident) {
    try {
      form.getTextField("10B_STATE").setText(data.conditionRelatedTo.place);
    } catch {
      /* skip */
    }
  }
  try {
    (data.conditionRelatedTo.otherAccident
      ? form.getCheckBox("10C_YES")
      : form.getCheckBox("10C_NO")
    ).check();
  } catch {
    /* skip */
  }

  // Box 11 – Policy / Group
  try {
    form.getTextField("11_GROUP_NUMBER").setText(data.insuredGroupNumber);
  } catch {
    /* skip */
  }
  try {
    form.getTextField("11C_PLAN_NAME").setText(data.insuredPlanName);
  } catch {
    /* skip */
  }

  // Box 12 – Patient Signature
  try {
    form.getTextField("12_SIGNATURE").setText(data.patientName);
  } catch {
    /* skip */
  }
  try {
    form
      .getTextField("12_DATE")
      .setText(formatDateMMDDYY(data.patientSignatureDate));
  } catch {
    /* skip */
  }

  // Box 13 – Insured Signature
  if (data.insuredSignatureAuthorized) {
    try {
      form.getTextField("13_SIGNATURE").setText("SIGNATURE ON FILE");
    } catch {
      /* skip */
    }
  }

  // Box 14 – Date of Illness
  if (data.dateOfIllness) {
    const [y, m, d] = data.dateOfIllness.split("-");
    try {
      form.getTextField("14_MM").setText(m || "");
    } catch {
      /* skip */
    }
    try {
      form.getTextField("14_DD").setText(d || "");
    } catch {
      /* skip */
    }
    try {
      form.getTextField("14_YY").setText((y || "").slice(-2));
    } catch {
      /* skip */
    }
  }
  try {
    form.getTextField("14_QUAL").setText(data.dateOfIllnessQual);
  } catch {
    /* skip */
  }

  // Box 17 – Referring Provider
  try {
    form.getTextField("17_REFERRING_NAME").setText(data.referringProviderName);
  } catch {
    /* skip */
  }
  try {
    form.getTextField("17A_QUAL").setText(data.referringProviderQual);
  } catch {
    /* skip */
  }
  try {
    form.getTextField("17B_NPI").setText(data.referringProviderNpi);
  } catch {
    /* skip */
  }

  // Box 21 – Diagnosis
  try {
    form.getTextField("21_INDICATOR").setText(data.diagnosisCodeIcd);
  } catch {
    /* skip */
  }
  const diagLetters = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
  ];
  data.diagnosisCodes.slice(0, 12).forEach((code, i) => {
    try {
      form.getTextField(`21_${diagLetters[i]}`).setText(code);
    } catch {
      /* skip */
    }
  });

  // Box 23 – Prior Auth
  try {
    form.getTextField("23_PRIOR_AUTH").setText(data.priorAuthNumber);
  } catch {
    /* skip */
  }

  // Box 24 – Service Lines (6 lines)
  const svcFields = [
    {
      from: "24A_FROM",
      to: "24A_TO",
      pos: "24B_POS",
      emg: "24B_EMG",
      cpt: "24D_CPT",
      mod: "24D_MOD",
      diag: "24E_DIAG",
      charge: "24F_CHARGE",
      units: "24G_UNITS",
      npi: "24J_RENDERING_NPI",
    },
    {
      from: "24A_FROM_2",
      to: "24A_TO_2",
      pos: "24B_POS_2",
      emg: "24B_EMG_2",
      cpt: "24D_CPT_2",
      mod: "24D_MOD_2",
      diag: "24E_DIAG_2",
      charge: "24F_CHARGE_2",
      units: "24G_UNITS_2",
      npi: "24J_RENDERING_NPI_2",
    },
    {
      from: "24A_FROM_3",
      to: "24A_TO_3",
      pos: "24B_POS_3",
      emg: "24B_EMG_3",
      cpt: "24D_CPT_3",
      mod: "24D_MOD_3",
      diag: "24E_DIAG_3",
      charge: "24F_CHARGE_3",
      units: "24G_UNITS_3",
      npi: "24J_RENDERING_NPI_3",
    },
    {
      from: "24A_FROM_4",
      to: "24A_TO_4",
      pos: "24B_POS_4",
      emg: "24B_EMG_4",
      cpt: "24D_CPT_4",
      mod: "24D_MOD_4",
      diag: "24E_DIAG_4",
      charge: "24F_CHARGE_4",
      units: "24G_UNITS_4",
      npi: "24J_RENDERING_NPI_4",
    },
    {
      from: "24A_FROM_5",
      to: "24A_TO_5",
      pos: "24B_POS_5",
      emg: "24B_EMG_5",
      cpt: "24D_CPT_5",
      mod: "24D_MOD_5",
      diag: "24E_DIAG_5",
      charge: "24F_CHARGE_5",
      units: "24G_UNITS_5",
      npi: "24J_RENDERING_NPI_5",
    },
    {
      from: "24A_FROM_6",
      to: "24A_TO_6",
      pos: "24B_POS_6",
      emg: "24B_EMG_6",
      cpt: "24D_CPT_6",
      mod: "24D_MOD_6",
      diag: "24E_DIAG_6",
      charge: "24F_CHARGE_6",
      units: "24G_UNITS_6",
      npi: "24J_RENDERING_NPI_6",
    },
  ];
  data.serviceLines.slice(0, 6).forEach((line, i) => {
    const f = svcFields[i];
    try {
      form.getTextField(f.from).setText(line.fromDate);
    } catch {
      /* skip */
    }
    try {
      form.getTextField(f.to).setText(line.toDate);
    } catch {
      /* skip */
    }
    try {
      form.getTextField(f.pos).setText(line.placeOfService);
    } catch {
      /* skip */
    }
    if (line.emergency) {
      try {
        form.getCheckBox(f.emg).check();
      } catch {
        /* skip */
      }
    }
    try {
      form.getTextField(f.cpt).setText(line.cptCode);
    } catch {
      /* skip */
    }
    try {
      form.getTextField(f.mod).setText(line.modifier);
    } catch {
      /* skip */
    }
    try {
      form.getTextField(f.diag).setText(line.diagnosisPointer);
    } catch {
      /* skip */
    }
    try {
      form.getTextField(f.charge).setText(line.charges);
    } catch {
      /* skip */
    }
    try {
      form.getTextField(f.units).setText(line.daysOrUnits);
    } catch {
      /* skip */
    }
    try {
      form.getTextField(f.npi).setText(line.renderingProviderNpi);
    } catch {
      /* skip */
    }
  });

  // Box 25 – Tax ID
  try {
    form.getTextField("25_TAX_ID").setText(data.taxId);
  } catch {
    /* skip */
  }
  if (data.taxIdType === "SSN") {
    try {
      form.getCheckBox("25_SSN").check();
    } catch {
      /* skip */
    }
  } else if (data.taxIdType === "EIN") {
    try {
      form.getCheckBox("25_EIN").check();
    } catch {
      /* skip */
    }
  }

  // Box 26 – Account Number
  try {
    form.getTextField("26_ACCT_NO").setText(data.patientAccountNo);
  } catch {
    /* skip */
  }

  // Box 27 – Accept Assignment
  try {
    (data.acceptAssignment
      ? form.getCheckBox("27_YES")
      : form.getCheckBox("27_NO")
    ).check();
  } catch {
    /* skip */
  }

  // Box 28 – Total Charge
  try {
    form.getTextField("28_TOTAL_CHARGE").setText(data.totalCharge);
  } catch {
    /* skip */
  }

  // Box 29 – Amount Paid
  try {
    form.getTextField("29_AMOUNT_PAID").setText(data.amountPaid);
  } catch {
    /* skip */
  }

  // Box 31 – Physician Signature
  try {
    form.getTextField("31_SIGNATURE").setText("SIGNATURE ON FILE");
  } catch {
    /* skip */
  }
  try {
    form
      .getTextField("31_DATE")
      .setText(formatDateMMDDYY(data.physicianSignatureDate));
  } catch {
    /* skip */
  }

  // Box 32 – Service Facility
  try {
    form.getTextField("32_NAME").setText(data.facilityInfo.name);
  } catch {
    /* skip */
  }
  try {
    form.getTextField("32_ADDRESS").setText(data.facilityInfo.street);
  } catch {
    /* skip */
  }
  try {
    form
      .getTextField("32_CITY")
      .setText(
        `${data.facilityInfo.city} ${data.facilityInfo.state} ${data.facilityInfo.zipCode}`,
      );
  } catch {
    /* skip */
  }
  try {
    form.getTextField("32A_NPI").setText(data.facilityInfo.npi);
  } catch {
    /* skip */
  }

  // Box 33 – Billing Provider
  try {
    form.getTextField("33_NAME").setText(data.billingProviderInfo.name);
  } catch {
    /* skip */
  }
  try {
    form.getTextField("33_ADDRESS").setText(data.billingProviderInfo.street);
  } catch {
    /* skip */
  }
  try {
    form
      .getTextField("33_CITY")
      .setText(
        `${data.billingProviderInfo.city} ${data.billingProviderInfo.state} ${data.billingProviderInfo.zipCode}`,
      );
  } catch {
    /* skip */
  }
  try {
    form.getTextField("33_PHONE").setText(data.billingProviderInfo.phone);
  } catch {
    /* skip */
  }
  try {
    form.getTextField("33A_NPI").setText(data.billingProviderInfo.npi);
  } catch {
    /* skip */
  }
  try {
    form.getTextField("33B_ID").setText(data.billingProviderInfo.otherId);
  } catch {
    /* skip */
  }

  // Disable editing (flatten) to prevent field boxes showing as empty rects on print
  form.flatten();

  const filledPdfBytes = await pdfDoc.save();
  return filledPdfBytes;
}
