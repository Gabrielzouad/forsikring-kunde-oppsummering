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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { FormSchema } from '@/schemas/insuranceSchemas';
export const HomeInsuranceForm = () => {
  const form = useFormContext<FormSchema>();

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>Husforsikring</h3>

      <FormField
        control={form.control}
        name='homeInsurance.boligType'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Boligtype</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              Legg til eventuell tilleggsinformasjon som kan være relevant for
              husforsikringen.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
