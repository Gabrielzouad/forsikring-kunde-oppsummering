// components/insurance/CarInsuranceForm.tsx
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { FormSchema } from '@/schemas/insuranceSchemas';

export const CarInsuranceForm = () => {
  const form = useFormContext<FormSchema>();

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Bilforsikring</h3>

      <FormField
        control={form.control}
        name='carInsurance.antallBiler'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Antall biler</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <FormLabel>Kjenner du bilens registreringsnummer?</FormLabel>
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

      {form.watch('carInsurance.kjennerRegistreringsnummer') === 'ja' && (
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
                  <FormLabel className='font-normal'>Ansvar</FormLabel>
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Velg årlig kjørelengde' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='8000'>Inntil 8 000 km</SelectItem>
                <SelectItem value='10000'>8 001 - 10 000 km</SelectItem>
                <SelectItem value='12000'>10 001 - 12 000 km</SelectItem>
                <SelectItem value='16000'>12 001 - 16 000 km</SelectItem>
                <SelectItem value='20000'>16 001 - 20 000 km</SelectItem>
                <SelectItem value='30000'>20 001 - 30 000 km</SelectItem>
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
              Legg til eventuell tilleggsinformasjon som kan være relevant for
              bilforsikringen.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
