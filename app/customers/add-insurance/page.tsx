// components/insurance/InsuranceForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCustomer } from '@/lib/Context/CustomerContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { formSchema, type FormSchema } from '@/schemas/insuranceSchemas';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from '@/components/ui/form';
import { generateSummary } from '@/lib/utils';
import { CarInsuranceForm } from '@/components/insurance/CarInsuranceForm';
import { HomeInsuranceForm } from '@/components/insurance/HomeInsuranceForm';
import { LifeInsuranceForm } from '@/components/insurance/LifeInsuranceForm';
import { InsuranceSummary } from '@/components/insurance/InsuranceSummary';

export default function InsuranceForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState({ car: '', home: '', life: '' });
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const { customerInfo } = useCustomer();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      carInsurance: {
        enabled: false,
        antallBiler: '1',
        kjennerRegistreringsnummer: 'ja',
        registreringsnummer: '',
        onsketDekning: 'ansvarOgForerulykke',
        naverendeBonus: '60',
        arligKjorelengde: '10000',
        additionalInfo: '',
      },
      homeInsurance: {
        enabled: false,
        boligType: 'enebolig',
        boligAreal: '',
        byggeaar: '',
        forsikringsBeløp: '',
        additionalInfo: '',
      },
      lifeInsurance: {
        enabled: false,
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
      // You can pre-fill form fields based on customer info here
    }
  }, [customerInfo]);

  const onSubmit = async (values: FormSchema) => {
    console.log('Form submitted with values:', values);
    setIsLoading(true);
    setIsSummaryLoading(true);
    try {
      const fullData = {
        customer: customerInfo,
        insurance: values,
      };
      console.log('Full submission data:', fullData);

      const summaries = {
        car: values.carInsurance
          ? await generateSummary('car', values.carInsurance)
          : '',
        home: values.homeInsurance
          ? await generateSummary('home', values.homeInsurance)
          : '',
        life: values.lifeInsurance
          ? await generateSummary('life', values.lifeInsurance)
          : '',
      };

      setSummary(summaries);

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
      setIsSummaryLoading(false);
    }
  };

  const handleSubmit = async () => {
    console.log('Handle submit called');
    const values = form.getValues();
    const filteredValues = {
      ...(values.carInsurance.enabled && { carInsurance: values.carInsurance }),
      ...(values.homeInsurance.enabled && {
        homeInsurance: values.homeInsurance,
      }),
      ...(values.lifeInsurance.enabled && {
        lifeInsurance: values.lifeInsurance,
      }),
    };

    console.log('Filtered form values:', filteredValues);
    await onSubmit(filteredValues as FormSchema);
  };

  return (
    <div className='space-y-6'>
      <Card className='w-full max-w-4xl mx-auto'>
        <CardHeader>
          <CardTitle>
            Forsikringsskjema for {customerInfo?.name || 'Kunde'}
          </CardTitle>
          <CardDescription>
            Velg forsikringstyper og fyll ut informasjon for de forsikringene
            kundene er interessert i.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-8'
              >
                {/* Insurance type toggles */}
                <div className='space-y-4'>
                  <FormField
                    control={form.control}
                    name='carInsurance.enabled'
                    render={({ field }) => (
                      <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                        <div className='space-y-0.5'>
                          <FormLabel className='text-base'>
                            Bilforsikring
                          </FormLabel>
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
                          <FormLabel className='text-base'>
                            Husforsikring
                          </FormLabel>
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

                {/* Conditional rendering of insurance forms */}
                {form.watch('carInsurance.enabled') && <CarInsuranceForm />}
                {form.watch('homeInsurance.enabled') && <HomeInsuranceForm />}
                {form.watch('lifeInsurance.enabled') && <LifeInsuranceForm />}

                <Button
                  type='button'
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? 'Sender inn...' : 'Send inn'}
                </Button>
              </form>
            </Form>
          </FormProvider>
        </CardContent>
        <InsuranceSummary summaries={summary} isLoading={isSummaryLoading} />
      </Card>
    </div>
  );
}
