import logo from '@/assets/images/logo/logo-light.png';
import { CartSheet } from "@/components/cart/cart-sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ROUTES_DATA } from "@/config";
import { cn } from "@/lib/utils";
import { cartItems, isCartOpen } from "@/store/cart";
import '@/styles/components/navbar.css';
import { useStore } from "@nanostores/react";
import { FileText, Menu as MenuIcon } from "lucide-react";

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
    <div className='hidden md:flex'>
      <NavigationMenu>
        <NavigationMenuList>
          {ROUTES_DATA.map((route, index) => (
            <NavigationMenuItem key={index}>
              {route.children ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent text-zinc-100 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white data-active:bg-zinc-800 data-[state=open]:bg-zinc-800">
                    {route.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {route.children.map((child) => (
                        <li key={child.name}>
                          <NavigationMenuLink asChild>
                            <a
                              href={child.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{child.name}</div>
                              {child.description && (
                                <p className="line-clamp-2 text-sm leading-snug text-zinc-400">
                                  {child.description}
                                </p>
                              )}
                            </a>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink asChild>
                  <a
                    href={route.href}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-zinc-100 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white data-[active]:bg-zinc-800"
                    )}
                  >
                    {route.name}
                  </a>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
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
            <Accordion type="single" collapsible className="w-full">
              {ROUTES_DATA.map((route, index) => (
                <div key={index}>
                  {route.children ? (
                    <AccordionItem value={route.name} className="border-b-zinc-700">
                      <AccordionTrigger className="text-zinc-100 hover:text-white hover:no-underline py-3">
                        {route.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-2 pl-4 pt-2">
                          {route.children.map((child) => (
                            <a
                              key={child.name}
                              href={child.href}
                              className='block py-2 text-zinc-400 hover:text-white'
                            >
                              {child.name}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <a
                      href={route.href}
                      className='flex items-center py-3 border-b border-b-zinc-700 text-zinc-100 hover:text-white'
                    >
                      {route.name}
                    </a>
                  )}
                </div>
              ))}
            </Accordion>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function Navbar() {
  const $cartItems = useStore(cartItems);
  const cartCount = Object.values($cartItems).reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className='sticky top-0 z-40 w-full border-b border-zinc-700 bg-zinc-900 md:min-w-400'>
      <div className='container mx-auto flex h-16 items-center px-4'>
        <NavbarBrand />
        <NavLinksDesktop />
        <div className='grow' />
        <div className="flex items-center space-x-4">
          <NavLinksMobile />

          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="relative text-zinc-100 hover:bg-zinc-800 hover:text-white" onClick={() => isCartOpen.set(true)}>
              <FileText className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>

          <CartSheet />
        </div>
      </div>
    </header>
  );
}
