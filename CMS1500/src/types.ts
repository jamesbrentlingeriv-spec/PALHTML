/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CMS1500Data {
  // 1. Program Type
  programType: 'MEDICARE' | 'MEDICAID' | 'TRICARE' | 'CHAMPVA' | 'GROUP' | 'FECA' | 'OTHER' | '';
  // 1a. Insured ID
  insuredId: string;
  
  // 2. Patient Name
  patientName: string;
  // 3. Patient Birth Date & Sex
  patientBirthDate: string;
  patientSex: 'M' | 'F' | '';
  
  // 4. Insured Name
  insuredName: string;
  // 5. Patient Address
  patientAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };

  // 6. Relationship to Insured
  patientRelationship: 'SELF' | 'SPOUSE' | 'CHILD' | 'OTHER' | '';

  // 7. Insured Address
  insuredAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };

  // 9. Other Insured Name
  otherInsuredName: string;
  otherInsuredPolicy: string;

  // 10. Condition Related to
  conditionRelatedTo: {
    employment: boolean;
    autoAccident: boolean;
    place: string;
    otherAccident: boolean;
  };

  // 11. Insured's Policy/Group
  insuredGroupNumber: string;
  insuredBirthDate: string;
  insuredSex: 'M' | 'F' | '';
  insuredEmployer: string;
  insuredPlanName: string;
  otherHealthPlan: boolean;

  // 12. Patient's Signature
  patientSignatureDate: string;
  // 13. Insured's Signature
  insuredSignatureAuthorized: boolean;

  // 14. Date of Current Illness/Injury
  dateOfIllness: string;
  dateOfIllnessQual: '431' | '484' | '';

  // 15. Other Date
  otherDate: string;
  otherDateQual: string;

  // 16. Dates Patient Unable to Work
  unableToWorkFrom: string;
  unableToWorkTo: string;

  // 17. Referring Provider
  referringProviderName: string;
  referringProviderQual: 'DN' | 'DK' | 'DQ' | '';
  referringProviderNpi: string;

  // 18. Hospitalization Dates
  hospFrom: string;
  hospTo: string;

  // 19. Additional Claim Info
  additionalClaimInfo: string;

  // 20. Outside Lab
  outsideLab: boolean;
  outsideLabCharges: string;

  // 21. Diagnosis
  diagnosisCodeIcd: '9' | '0'; // 9 or 0 (ICD-10)
  diagnosisCodes: string[]; // Up to 12

  // 22. Resubmission
  resubmissionCode: string;
  resubmissionReference: string;

  // 23. Prior Auth
  priorAuthNumber: string;

  // 24. Service Lines (Up to 6)
  serviceLines: {
    fromDate: string;
    toDate: string;
    placeOfService: string;
    emergency: boolean;
    cptCode: string;
    modifier: string;
    diagnosisPointer: string;
    charges: string;
    daysOrUnits: string;
    renderingProviderNpi: string;
  }[];

  // 25. Federal Tax ID
  taxId: string;
  taxIdType: 'SSN' | 'EIN' | '';

  // 26. Patient Account No
  patientAccountNo: string;

  // 27. Accept Assignment
  acceptAssignment: boolean;

  // 28. Total Charge
  totalCharge: string;
  // 29. Amount Paid
  amountPaid: string;
  // 30. Rsvd for Local Use (often Blank)
  
  // 31. Signature of Physician
  physicianSignatureDate: string;

  // 32. Service Facility Location
  facilityInfo: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    npi: string;
  };

  // 33. Billing Provider
  billingProviderInfo: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    npi: string;
    otherId: string;
  };
}

export type CMS1500Step = 
  | 'PATIENT_INFO' 
  | 'INSURED_INFO' 
  | 'ILLNESS_INFO' 
  | 'DIAGNOSIS' 
  | 'SERVICES' 
  | 'PROVIDER_INFO';
