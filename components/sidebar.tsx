'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { BarChart3, Users, FileText, Settings, Menu, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const sidebarItems = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Policies', href: '/policies', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex h-screen bg-gray-100'>
      {/* Sidebar for larger screens */}
      <aside className='hidden md:flex md:flex-shrink-0'>
        <div className='flex flex-col w-64'>
          <div className='flex flex-col h-0 flex-1 border-r border-gray-200 bg-white'>
            <div className='flex-1 flex flex-col pt-5 pb-4 overflow-y-auto'>
              <div className='flex items-center flex-shrink-0 px-4'>
                <span className='text-xl font-semibold'>
                  Insurance Dashboard
                </span>
              </div>
              <nav className='mt-5 flex-1 px-2 bg-white space-y-1'>
                {sidebarItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href
                          ? 'text-gray-500'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'mr-3 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden='true'
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className='flex-shrink-0 flex border-t border-gray-200 p-4'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='flex items-center text-sm'>
                    <span className='sr-only'>Open user menu</span>
                    <img
                      className='h-8 w-8 rounded-full'
                      src='https://avatars.githubusercontent.com/u/1234567?v=4'
                      alt='User avatar'
                    />
                    <span className='ml-3'>John Doe</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div className='md:hidden'>
        <div className='fixed inset-0 flex z-40'>
          <div
            className={cn(
              'fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300',
              sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div
            className={cn(
              'relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transition ease-in-out duration-300 transform',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <div className='absolute top-0 right-0 -mr-12 pt-2'>
              <button
                className='ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                onClick={() => setSidebarOpen(false)}
              >
                <span className='sr-only'>Close sidebar</span>
                <X className='h-6 w-6 text-white' aria-hidden='true' />
              </button>
            </div>

            <div className='flex-shrink-0 flex items-center px-4'>
              <span className='text-xl font-semibold'>Insurance Dashboard</span>
            </div>
            <div className='mt-5 flex-1 h-0 overflow-y-auto'>
              <nav className='px-2 space-y-1'>
                {sidebarItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      pathname === item.href
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                    )}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href
                          ? 'text-gray-500'
                          : 'text-gray-400 group-hover:text-gray-500',
                        'mr-4 flex-shrink-0 h-6 w-6'
                      )}
                      aria-hidden='true'
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className='flex flex-col w-0 flex-1 overflow-hidden'>
        <div className='relative z-10 flex-shrink-0 flex h-16 bg-white shadow md:hidden'>
          <button
            className='px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden'
            onClick={() => setSidebarOpen(true)}
          >
            <span className='sr-only'>Open sidebar</span>
            <Menu className='h-6 w-6' aria-hidden='true' />
          </button>
          <div className='flex-1 px-4 flex justify-between'>
            <div className='flex-1 flex'>
              <span className='flex items-center text-xl font-semibold'>
                Insurance Dashboard
              </span>
            </div>
            <div className='ml-4 flex items-center md:ml-6'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='flex items-center text-sm'>
                    <span className='sr-only'>Open user menu</span>
                    <img
                      className='h-8 w-8 rounded-full'
                      src='https://avatars.githubusercontent.com/u/1234567?v=4'
                      alt='User avatar'
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
