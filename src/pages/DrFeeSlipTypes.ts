import { z } from "zod";

export const FeeSlipSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  dateOfService: z.string().min(1, "Date of service is required"),
  
  // Procedures
  procedures: z.record(z.string(), z.boolean()),
  procedureValues: z.record(z.string(), z.string()),

  // Diagnosis
  diagnosis: z.record(z.string(), z.boolean()),
  
  // Contact Lens Materials
  clMaterials: z.object({
    rt: z.string().optional(),
    lt: z.string().optional(),
    s1: z.string().optional(),
    s2: z.string().optional(),
    sphere: z.enum(["V2510", "V2520", ""]).optional(),
    toric: z.enum(["V2511", "V2521", ""]).optional(),
    bifocal: z.enum(["V2512", "V2522", ""]).optional(),
    extWear: z.enum(["V2513", "V2523", ""]).optional(),
  }),

  // Summary
  routineMedical: z.string().optional(),
  contactsOther: z.string().optional(),
  routine: z.boolean().default(false),
  contacts: z.boolean().default(false),
  both: z.boolean().default(false),
  total: z.number().min(0).default(0),
  received: z.number().min(0).default(0),
  paymentType: z.string().optional(),
  insUsed: z.string().optional(),
});

export type FeeSlipData = z.infer<typeof FeeSlipSchema>;
