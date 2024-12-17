import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { FormSchema } from '@/schemas/insuranceSchemas';
export const LifeInsuranceForm = () => {
  const form = useFormContext<FormSchema>();

  return (
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
                  <FormLabel className='font-normal'>Kvinne</FormLabel>
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
              Legg til eventuell tilleggsinformasjon som kan være relevant for
              livsforsikringen.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
