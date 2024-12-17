import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function generateSummary(type: 'car' | 'home' | 'life', insuranceData: any) {
  if (!insuranceData) return '';

  try {
    let prompt = '';

    switch (type) {
      case 'car':
        prompt = `Vennligst analyser følgende bilforsikringssituasjon:

Kundens Bilsituasjon:
- Antall biler: ${insuranceData.antallBiler || 'Ikke spesifisert'}
${insuranceData.kjennerRegistreringsnummer === 'ja' && insuranceData.registreringsnummer 
  ? `- Registreringsnummer: ${insuranceData.registreringsnummer}` 
  : '- Registreringsnummer er ikke oppgitt'}
- Ønsket dekning: ${insuranceData.onsketDekning === 'ansvar' ? 'Kun ansvar' : 'Ansvar og førerulykke'}
- Bonus: ${insuranceData.naverendeBonus || '0'}%
- Årlig kjørelengde: ${insuranceData.arligKjorelengde || 'Ikke spesifisert'} km

Tilleggsinformasjon:
${insuranceData.additionalInfo ? insuranceData.additionalInfo : 'Ingen tilleggsinformasjon oppgitt'}

Vurder spesielt:
- Om valgt dekning er tilstrekkelig for kundens behov
- Muligheter for oppgradering av dekning
- Relevante tilleggsforsikringer basert på kjøremønster
- Potensielle risikoer basert på oppgitt informasjon`;
        break;

      case 'home':
        prompt = `Vennligst analyser følgende husforsikringssituasjon:

Boligsituasjon:
- Type: ${insuranceData.boligType || 'Ikke spesifisert'}
- Areal: ${insuranceData.boligAreal || 'Ikke spesifisert'} m²
- Byggeår: ${insuranceData.byggeaar || 'Ikke spesifisert'}
- Forsikringsbeløp: ${insuranceData.forsikringsBeløp || 'Ikke spesifisert'} NOK

Tilleggsinformasjon:
${insuranceData.additionalInfo ? insuranceData.additionalInfo : 'Ingen tilleggsinformasjon oppgitt'}

Vurder spesielt:
- Om forsikringssum er tilstrekkelig basert på boligtype og areal
- Relevante tilleggsdekninger basert på boligens alder og type
- Potensielle risikoer knyttet til boligen
- Muligheter for kombinasjon med innboforsikring`;
        break;

      case 'life':
        prompt = `Vennligst analyser følgende livsforsikringssituasjon:

Kundeprofil:
- Alder: ${insuranceData.alder || 'Ikke spesifisert'} år
- Kjønn: ${insuranceData.kjonn || 'Ikke spesifisert'}
- Røykestatus: ${insuranceData.roker || 'Ikke spesifisert'}
- Ønsket forsikringssum: ${insuranceData.forsikringsSum || 'Ikke spesifisert'} NOK

Tilleggsinformasjon:
${insuranceData.additionalInfo ? insuranceData.additionalInfo : 'Ingen tilleggsinformasjon oppgitt'}

Vurder spesielt:
- Om forsikringssum er tilstrekkelig basert på kundens alder og situasjon
- Relevante tilleggsdekninger (uføreforsikring, kritisk sykdom, etc.)
- Helserisikovurdering basert på oppgitt informasjon
- Muligheter for familierelaterte forsikringer`;
        break;

      default:
        return '';
    }

    const response = await fetch('/api/generate-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        prompt: prompt.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate summary');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.text || 'Ingen oppsummering tilgjengelig';

  } catch (error) {
    console.error('Error generating summary:', error);
    return 'Kunne ikke generere oppsummering. Vennligst prøv igjen.';
  }
}