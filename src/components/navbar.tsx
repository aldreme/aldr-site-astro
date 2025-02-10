'use client';

import { Menu as MenuIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

import logo from '@/assets/images/logo/logo-light.png';

import { ROUTES_DATA } from '@/config';
import '@/styles/components/navbar.css';

function NavbarBrand() {
  return (
    <div className='mr-6 flex items-center'>
      <a href='/' className='flex items-center space-x-2'>
        <img alt='logo' src={logo.src} className='navbar-logo' />
      </a>
    </div>
  )
}

function NavLinksDesktop() {
  return (
    <nav className='hidden items-center space-x-6 text-sm font-medium text-zinc-100 md:flex'>
      {
        ROUTES_DATA.map((route, index) => (
          <a key={index} href={route.href} className='transition-colors hover:text-white'>
            {route.name}
          </a>
        ))
      }
    </nav>
  )
}

function NavLinksMobile() {
  return (
    <div className='flex flex-row border-none md:hidden'>
      <Sheet>
        {/* Menu Trigger button */}
        <SheetTrigger asChild>
          <Button variant='ghost' className='p-2 text-zinc-100 hover:bg-zinc-800'>
            <MenuIcon className='h-5 w-5' />
          </Button>
        </SheetTrigger>

        {/* Menu content */}
        <SheetContent
          side='right'
          className='w-56 bg-zinc-900 p-4 text-zinc-100 border-none'
        >
          {/* Menu header */}
          <SheetHeader>
            <SheetTitle className='text-white'>Menu</SheetTitle>
          </SheetHeader>

          {/* Navigation links */}
          <div className='mt-4 flex flex-col space-y-2 text-sm font-medium'>
            {
              ROUTES_DATA.map((route, index) => (
                <a key={index} href={route.href} className='hover:text-white'>
                  {route.name}
                </a>
              ))
            }
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function Navbar() {
  return (
    <header className='sticky top-0 z-40 w-full border-b border-zinc-700 bg-zinc-900'>
      <div className='container mx-auto flex h-16 items-center px-4'>
        <NavbarBrand />
        <NavLinksDesktop />
        <div className='grow' />
        <NavLinksMobile />
      </div>
    </header>
  );
}
