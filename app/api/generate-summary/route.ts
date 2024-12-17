import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const systemPrompt = `Du er en erfaren forsikringsrådgiver i en bank. Strukturer analysen slik:

### [Type]forsikringsanalyse

#### Kundeoversikt
- **Situasjon**: [Kort oppsummering av kundens situasjon]
- **Valgt dekning**: [Beskrivelse av valgt dekning]
- **Nøkkeltall**: [Liste over viktige tall]

#### Salgsmuligheter
- **Anbefalte produkter**
  • [Produkt 1 med kort begrunnelse]
  • [Produkt 2 med kort begrunnelse]

#### Rådgivernotater
- **Fokuspunkter**
  • [Viktig punkt 1]
  • [Viktig punkt 2]
- **Risikofaktorer**
  • [Risiko 1]
  • [Risiko 2]

Bruk BARE denne formateringen. Hold det kort konsist og ryddig. `;

export async function POST(request: Request) {
  try {
    const {  prompt } = await request.json();

    if (!prompt) {
      throw new Error('Empty prompt received');
    }

    const response = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return NextResponse.json({
      text: response.choices[0]?.message.content || ''
    });
  } catch (error) {
    console.error('Error in generate-summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}