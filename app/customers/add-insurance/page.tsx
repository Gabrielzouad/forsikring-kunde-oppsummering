'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

import { useCustomer } from '@/lib/Context/CustomerContext';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

const carInsuranceSchema = z.object({
  enabled: z.boolean(),
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

const homeInsuranceSchema = z.object({
  enabled: z.boolean(),
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

const lifeInsuranceSchema = z.object({
  enabled: z.boolean(),
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

const formSchema = z.object({
  carInsurance: carInsuranceSchema,
  homeInsurance: homeInsuranceSchema,
  lifeInsurance: lifeInsuranceSchema,
});

export default function InsuranceForm() {
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState({ car: '', home: '', life: '' });
  const { customerInfo } = useCustomer();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carInsurance: {
        enabled: true,
        antallBiler: '1',
        kjennerRegistreringsnummer: 'ja',
        registreringsnummer: '',
        onsketDekning: 'ansvarOgForerulykke',
        naverendeBonus: '60',
        arligKjorelengde: '10000',
        additionalInfo: '',
      },
      homeInsurance: {
        enabled: true,
        boligType: 'enebolig',
        boligAreal: '',
        byggeaar: '',
        forsikringsBeløp: '',
        additionalInfo: '',
      },
      lifeInsurance: {
        enabled: true,
        alder: '',
        kjonn: 'mann',
        roker: 'nei',
        forsikringsSum: '',
        additionalInfo: '',
      },
    },
  });

  useEffect(() => {
    if (customerInfo) {
      console.log('Customer Info:', customerInfo);
    }
  }, [customerInfo]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const fullData = {
        customer: customerInfo,
        insurance: values,
      };

      console.log('Full submission data:', fullData);

      const summaries = await Promise.all([
        values.carInsurance.enabled
          ? generateSummary('car', values.carInsurance.additionalInfo)
          : Promise.resolve(''),
        values.homeInsurance.enabled
          ? generateSummary('home', values.homeInsurance.additionalInfo)
          : Promise.resolve(''),
        values.lifeInsurance.enabled
          ? generateSummary('life', values.lifeInsurance.additionalInfo)
          : Promise.resolve(''),
      ]);

      setSummary({
        car: summaries[0],
        home: summaries[1],
        life: summaries[2],
      });

      toast({
        title: 'Skjema sendt inn',
        description: 'Forsikringsinformasjonen er mottatt og oppsummert.',
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Feil',
        description:
          'Det oppstod en feil ved innsending av skjemaet. Vennligst prøv igjen.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function generateSummary(
    type: string,
    additionalInfo: string | undefined
  ) {
    if (!additionalInfo) return '';
    const prompt = `Oppsummer følgende tilleggsinformasjon for ${
      type === 'car'
        ? 'bilforsikring'
        : type === 'home'
        ? 'husforsikring'
        : 'livsforsikring'
    }:\n\n${additionalInfo}`;
    const { text } = await generateText({
      model: openai('gpt-4-turbo'),
      prompt: prompt,
    });
    return text;
  }

  return (
    <Card className='w-full max-w-4xl mx-auto'>
      <CardHeader>
        <CardTitle>
          Forsikringsskjema for {customerInfo?.name || 'Kunde'}
        </CardTitle>
        <CardDescription>
          Velg forsikringstyper og fyll ut informasjon for de forsikringene du
          er interessert i.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='carInsurance.enabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Bilforsikring</FormLabel>
                      <FormDescription>
                        Aktiver for å inkludere bilforsikring i søknaden.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='homeInsurance.enabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>Husforsikring</FormLabel>
                      <FormDescription>
                        Aktiver for å inkludere husforsikring i søknaden.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='lifeInsurance.enabled'
                render={({ field }) => (
                  <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                    <div className='space-y-0.5'>
                      <FormLabel className='text-base'>
                        Livsforsikring
                      </FormLabel>
                      <FormDescription>
                        Aktiver for å inkludere livsforsikring i søknaden.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {form.watch('carInsurance.enabled') && (
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Bilforsikring</h3>
                <FormField
                  control={form.control}
                  name='carInsurance.antallBiler'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Antall biler</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Velg antall biler' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='1'>1</SelectItem>
                          <SelectItem value='2'>2</SelectItem>
                          <SelectItem value='3'>3</SelectItem>
                          <SelectItem value='4'>4</SelectItem>
                          <SelectItem value='5'>5+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='carInsurance.kjennerRegistreringsnummer'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>
                        Kjenner du bilens registreringsnummer?
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex flex-col space-y-1'
                        >
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='ja' />
                            </FormControl>
                            <FormLabel className='font-normal'>Ja</FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='nei' />
                            </FormControl>
                            <FormLabel className='font-normal'>Nei</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('carInsurance.kjennerRegistreringsnummer') ===
                  'ja' && (
                  <FormField
                    control={form.control}
                    name='carInsurance.registreringsnummer'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Registreringsnummer</FormLabel>
                        <FormControl>
                          <Input placeholder='AB12345' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name='carInsurance.onsketDekning'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Ønsket dekning</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex flex-col space-y-1'
                        >
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='ansvar' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Ansvar
                            </FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='ansvarOgForerulykke' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Ansvar og førerulykke
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='carInsurance.naverendeBonus'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nåværende bonus</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Velg nåværende bonus' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[0, 10, 20, 30, 40, 50, 60, 70, 75].map((bonus) => (
                            <SelectItem key={bonus} value={bonus.toString()}>
                              {bonus} %
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='carInsurance.arligKjorelengde'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Årlig kjørelengde</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Velg årlig kjørelengde' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='8000'>Inntil 8 000 km</SelectItem>
                          <SelectItem value='10000'>
                            8 001 - 10 000 km
                          </SelectItem>
                          <SelectItem value='12000'>
                            10 001 - 12 000 km
                          </SelectItem>
                          <SelectItem value='16000'>
                            12 001 - 16 000 km
                          </SelectItem>
                          <SelectItem value='20000'>
                            16 001 - 20 000 km
                          </SelectItem>
                          <SelectItem value='30000'>
                            20 001 - 30 000 km
                          </SelectItem>
                          <SelectItem value='50000'>Over 30 000 km</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='carInsurance.additionalInfo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tilleggsinformasjon</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Skriv inn eventuell tilleggsinformasjon her...'
                          className='min-h-[100px]'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Legg til eventuell tilleggsinformasjon som kan være
                        relevant for bilforsikringen.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {form.watch('homeInsurance.enabled') && (
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Husforsikring</h3>
                <FormField
                  control={form.control}
                  name='homeInsurance.boligType'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Boligtype</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Velg boligtype' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='enebolig'>Enebolig</SelectItem>
                          <SelectItem value='leilighet'>Leilighet</SelectItem>
                          <SelectItem value='rekkehus'>Rekkehus</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='homeInsurance.boligAreal'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Boligareal (m²)</FormLabel>
                      <FormControl>
                        <Input type='number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='homeInsurance.byggeaar'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Byggeår</FormLabel>
                      <FormControl>
                        <Input type='number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='homeInsurance.forsikringsBeløp'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forsikringsbeløp (NOK)</FormLabel>
                      <FormControl>
                        <Input type='number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='homeInsurance.additionalInfo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tilleggsinformasjon</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Skriv inn eventuell tilleggsinformasjon her...'
                          className='min-h-[100px]'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Legg til eventuell tilleggsinformasjon som kan være
                        relevant for husforsikringen.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {form.watch('lifeInsurance.enabled') && (
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Livsforsikring</h3>
                <FormField
                  control={form.control}
                  name='lifeInsurance.alder'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alder</FormLabel>
                      <FormControl>
                        <Input type='number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lifeInsurance.kjonn'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Kjønn</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex flex-col space-y-1'
                        >
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='mann' />
                            </FormControl>
                            <FormLabel className='font-normal'>Mann</FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='kvinne' />
                            </FormControl>
                            <FormLabel className='font-normal'>
                              Kvinne
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lifeInsurance.roker'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormLabel>Røyker du?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className='flex flex-col space-y-1'
                        >
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='ja' />
                            </FormControl>
                            <FormLabel className='font-normal'>Ja</FormLabel>
                          </FormItem>
                          <FormItem className='flex items-center space-x-3 space-y-0'>
                            <FormControl>
                              <RadioGroupItem value='nei' />
                            </FormControl>
                            <FormLabel className='font-normal'>Nei</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lifeInsurance.forsikringsSum'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ønsket forsikringssum (NOK)</FormLabel>
                      <FormControl>
                        <Input type='number' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lifeInsurance.additionalInfo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tilleggsinformasjon</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='Skriv inn eventuell tilleggsinformasjon her...'
                          className='min-h-[100px]'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Legg til eventuell tilleggsinformasjon som kan være
                        relevant for livsforsikringen.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type='submit' disabled={isLoading}>
              {isLoading ? 'Sender inn...' : 'Send inn'}
            </Button>
          </form>
        </Form>
      </CardContent>
      {(summary.car || summary.home || summary.life) && (
        <CardFooter>
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>AI-generert oppsummering</CardTitle>
              <CardDescription>
                Basert på tilleggsinformasjonen du ga
              </CardDescription>
            </CardHeader>
            <CardContent>
              {summary.car && (
                <div className='mb-4'>
                  <h4 className='font-semibold'>Bilforsikring</h4>
                  <p>{summary.car}</p>
                </div>
              )}
              {summary.home && (
                <div className='mb-4'>
                  <h4 className='font-semibold'>Husforsikring</h4>
                  <p>{summary.home}</p>
                </div>
              )}
              {summary.life && (
                <div>
                  <h4 className='font-semibold'>Livsforsikring</h4>
                  <p>{summary.life}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </CardFooter>
      )}
    </Card>
  );
}
