// schemas/insuranceSchemas.ts
import * as z from 'zod';

const carInsuranceFields = z.object({
  enabled: z.boolean(),
  antallBiler: z.string().min(1, { message: 'Vennligst velg antall biler.' }),
  kjennerRegistreringsnummer: z.enum(['ja', 'nei'], {
    required_error: 'Vennligst velg et alternativ.',
  }),
  registreringsnummer: z.string(),
  onsketDekning: z.enum(['ansvar', 'ansvarOgForerulykke'], {
    required_error: 'Vennligst velg ønsket dekning.',
  }),
  naverendeBonus: z.string().min(1, { message: 'Vennligst velg nåværende bonus.' }),
  arligKjorelengde: z.string().min(1, { message: 'Vennligst velg årlig kjørelengde.' }),
  additionalInfo: z.string().optional(),
}).refine(data => !data.enabled || true);

const homeInsuranceFields = z.object({
  enabled: z.boolean(),
  boligType: z.enum(['enebolig', 'leilighet', 'rekkehus']),
  boligAreal: z.string().min(1),
  byggeaar: z.string().min(4),
  forsikringsBeløp: z.string().min(1),
  additionalInfo: z.string().optional(),
}).refine(data => !data.enabled || true);

const lifeInsuranceFields = z.object({
  enabled: z.boolean(),
  alder: z.string().min(1),
  kjonn: z.enum(['mann', 'kvinne']),
  roker: z.enum(['ja', 'nei']),
  forsikringsSum: z.string().min(1),
  additionalInfo: z.string().optional(),
}).refine(data => !data.enabled || true);

export const formSchema = z.object({
  carInsurance: carInsuranceFields,
  homeInsurance: homeInsuranceFields,
  lifeInsurance: lifeInsuranceFields,
});

export type FormSchema = z.infer<typeof formSchema>;