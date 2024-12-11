import { z } from "zod";

export const carInsuranceSchema = z.object({
    antallBiler: z.string().min(1, { message: 'Vennligst velg antall biler.' }),
    kjennerRegistreringsnummer: z.enum(['ja', 'nei'], {
      required_error: 'Vennligst velg et alternativ.',
    }),
    registreringsnummer: z
      .string()
      .regex(/^[A-Z]{2}[0-9]{5}$/, {
        message:
          'Vennligst skriv inn et gyldig registreringsnummer (f.eks. AB12345).',
      })
      .optional()
      .or(z.literal('')),
    onsketDekning: z.enum(['ansvar', 'ansvarOgForerulykke'], {
      required_error: 'Vennligst velg ønsket dekning.',
    }),
    naverendeBonus: z
      .string()
      .min(1, { message: 'Vennligst velg nåværende bonus.' }),
    arligKjorelengde: z
      .string()
      .min(1, { message: 'Vennligst velg årlig kjørelengde.' }),
    additionalInfo: z.string().optional(),
  });
  
  export const homeInsuranceSchema = z.object({
    boligType: z.enum(['enebolig', 'leilighet', 'rekkehus'], {
      required_error: 'Vennligst velg boligtype.',
    }),
    boligAreal: z.string().min(1, { message: 'Vennligst oppgi boligareal.' }),
    byggeaar: z.string().min(4, { message: 'Vennligst oppgi gyldig byggeår.' }),
    forsikringsBeløp: z
      .string()
      .min(1, { message: 'Vennligst oppgi forsikringsbeløp.' }),
    additionalInfo: z.string().optional(),
  });
  
  export const lifeInsuranceSchema = z.object({
    alder: z.string().min(1, { message: 'Vennligst oppgi alder.' }),
    kjonn: z.enum(['mann', 'kvinne'], {
      required_error: 'Vennligst velg kjønn.',
    }),
    roker: z.enum(['ja', 'nei'], {
      required_error: 'Vennligst velg røykestatus.',
    }),
    forsikringsSum: z
      .string()
      .min(1, { message: 'Vennligst oppgi ønsket forsikringssum.' }),
    additionalInfo: z.string().optional(),
  });