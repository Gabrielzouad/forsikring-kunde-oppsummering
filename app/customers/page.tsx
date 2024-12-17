'use client';

import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// This would typically come from your database
const customers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    policy: 'Auto Insurance',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    policy: 'Home Insurance',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    policy: 'Life Insurance',
  },
  {
    id: 4,
    name: 'Alice Brown',
    email: 'alice@example.com',
    policy: 'Auto Insurance',
  },
  {
    id: 5,
    name: 'Charlie Davis',
    email: 'charlie@example.com',
    policy: 'Health Insurance',
  },
];

export default function Page() {
  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-semibold'>Kunder</h1>
        <Button>
          <Link
            href={'/customers/new'}
            className='flex justify-center items-center'
          >
            <PlusCircle className='mr-2 h-4 w-4' />
            <p>Legg til en ny kunde</p>
          </Link>
        </Button>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Navn</TableHead>
              <TableHead>Epost</TableHead>
              <TableHead>Extra</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>
                  <Link href={`/dashboard/customers/${customer.id}`}>
                    <Button variant='outline' size='sm'>
                      Les detaljer
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
