import logo from '@/assets/images/logo/logo-light.png';
import { CartSheet } from "@/components/cart/cart-sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ROUTES_DATA } from "@/config";
import { ui, useTranslations } from "@/i18n/ui";
import { getLocalizedRoute } from "@/i18n/utils";
import { cn } from "@/lib/utils";
import { cartItems, isCartOpen } from "@/store/cart";
import '@/styles/components/navbar.css';
import { useStore } from "@nanostores/react";
import { FileText, Menu as MenuIcon } from "lucide-react";
import { LanguagePicker } from "./language-picker";

function NavbarBrand({ currentLang = 'en' }: { currentLang?: string }) {
  return (
    <div className='mr-6 flex items-center'>
      <a href={getLocalizedRoute('/', currentLang)} className='flex items-center space-x-2'>
        <img alt='logo' src={logo.src} className='navbar-logo' />
      </a>
    </div>
  )
}

function NavLinksDesktop({ currentLang = 'en' }: { currentLang?: string }) {
  const t = useTranslations(currentLang as keyof typeof ui);

  return (
    <div className='hidden md:flex'>
      <NavigationMenu>
        <NavigationMenuList>
          {ROUTES_DATA.map((route, index) => (
            <NavigationMenuItem key={index}>
              {route.children ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent text-zinc-100 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white data-active:bg-zinc-800 data-[state=open]:bg-zinc-800">
                    {/* @ts-ignore */}
                    {route.i18nKey ? t(route.i18nKey) : route.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {route.children.map((child) => (
                        <li key={child.name}>
                          <NavigationMenuLink asChild>
                            <a
                              href={getLocalizedRoute(child.href || '#', currentLang)}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              {/* @ts-ignore */}
                              <div className="text-sm font-medium leading-none">{child.i18nKey ? t(child.i18nKey) : child.name}</div>
                              {/* @ts-ignore */}
                              {(child.description || child.i18nDescriptionKey) && (
                                <p className="line-clamp-2 text-sm leading-snug text-zinc-400">
                                  {/* @ts-ignore */}
                                  {child.i18nDescriptionKey ? t(child.i18nDescriptionKey) : child.description}
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
                    href={getLocalizedRoute(route.href || '#', currentLang)}
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent text-zinc-100 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white data-[active]:bg-zinc-800"
                    )}
                  >
                    {/* @ts-ignore */}
                    {route.i18nKey ? t(route.i18nKey) : route.name}
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

function NavLinksMobile({ currentLang = 'en', currentPath }: { currentLang?: string, currentPath?: string }) {
  const t = useTranslations(currentLang as keyof typeof ui);

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
                        {/* @ts-ignore */}
                        {route.i18nKey ? t(route.i18nKey) : route.name}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col space-y-2 pl-4 pt-2">
                          {route.children.map((child) => (
                            <a
                              key={child.name}
                              href={getLocalizedRoute(child.href || '#', currentLang)}
                              className='block py-2 text-zinc-400 hover:text-white'
                            >
                              {/* @ts-ignore */}
                              {child.i18nKey ? t(child.i18nKey) : child.name}
                            </a>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ) : (
                    <a
                      href={getLocalizedRoute(route.href || '#', currentLang)}
                      className='flex items-center py-3 border-b border-b-zinc-700 text-zinc-100 hover:text-white'
                    >
                      {/* @ts-ignore */}
                      {route.i18nKey ? t(route.i18nKey) : route.name}
                    </a>
                  )}
                </div>
              ))}
            </Accordion>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-sm text-zinc-400">Language</span>
            <LanguagePicker currentLang={currentLang} currentPath={currentPath} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default function Navbar({ currentLang, currentPath }: { currentLang?: string, currentPath?: string }) {
  const $cartItems = useStore(cartItems);
  const cartCount = Object.values($cartItems).reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className='sticky top-0 z-40 w-full border-b border-zinc-700 bg-zinc-900 md:min-w-400'>
      <div className='container mx-auto flex h-16 items-center px-4'>
        <NavbarBrand currentLang={currentLang} />
        <NavLinksDesktop currentLang={currentLang} />
        <div className='grow' />
        <div className="flex items-center space-x-4">
          <NavLinksMobile currentLang={currentLang} currentPath={currentPath} />

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

          <div className="hidden md:flex items-center ml-2">
            <LanguagePicker currentLang={currentLang} currentPath={currentPath} />
          </div>

          <CartSheet />
        </div>
      </div>
    </header>
  );
}
