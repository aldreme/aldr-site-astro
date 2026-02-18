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
import { ChevronRight, FileText, Menu as MenuIcon } from "lucide-react";
import { useEffect, useState } from "react";
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


// ... (keep Imports, verify NO duplicate imports)

function NavLinksDesktop({ currentLang = 'en' }: { currentLang?: string }) {
  const t = useTranslations(currentLang as keyof typeof ui);

  return (
    <div className='hidden md:flex items-center space-x-1'>
      {ROUTES_DATA.map((route, index) => (
        <NavigationMenu key={index}>
          <NavigationMenuList>
            <NavigationMenuItem>
              {route.children ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent text-zinc-100 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white data-active:bg-zinc-800 data-[state=open]:bg-zinc-800">
                    {/* @ts-ignore */}
                    {route.i18nKey ? t(route.i18nKey) : route.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul
                      className={cn(
                        "gap-3 p-4",
                        route.name === "Company"
                          ? "w-max max-w-75 grid-cols-1"
                          : "grid w-100 md:w-125 md:grid-cols-2 lg:w-150"
                      )}
                    >
                      {route.children.map((child) => (
                        <li key={child.name} className={child.children ? "col-span-2" : ""}>
                          {child.children ? (
                            <div className="group relative">
                              {/* Parent Item (Certifications) - acts as trigger */}
                              <div className="flex w-full select-none items-center justify-between rounded-md p-3 text-sm font-medium leading-none no-underline outline-hidden transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer">
                                {/* @ts-ignore */}
                                {child.i18nKey ? t(child.i18nKey) : child.name}
                                <ChevronRight className="ml-auto h-4 w-4" />
                              </div>

                              {/* Flyout Sub-menu */}
                              <ul className="invisible opacity-0 absolute left-full top-0 ml-5 w-64 rounded-md border bg-popover text-popover-foreground shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100 z-50 p-1">
                                {child.children.map((grandChild) => (
                                  <li key={grandChild.name}>
                                    <NavigationMenuLink asChild>
                                      <a
                                        href={grandChild.href || '#'}
                                        target={grandChild.href?.endsWith('.pdf') ? '_blank' : undefined}
                                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                      >
                                        {/* @ts-ignore */}
                                        <div className="text-sm font-medium leading-none">{grandChild.i18nKey ? t(grandChild.i18nKey) : grandChild.name}</div>
                                        {/* @ts-ignore */}
                                        {/* @ts-ignore */}
                                        {(grandChild.description || grandChild.i18nDescriptionKey) && (
                                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground whitespace-normal mt-1">
                                            {/* @ts-ignore */}
                                            {grandChild.i18nDescriptionKey ? t(grandChild.i18nDescriptionKey) : grandChild.description}
                                          </p>
                                        )}
                                      </a>
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <NavigationMenuLink asChild>
                              <a
                                href={getLocalizedRoute(child.href || '#', currentLang)}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                {/* @ts-ignore */}
                                <div className="text-sm font-medium leading-none">{child.i18nKey ? t(child.i18nKey) : child.name}</div>
                                {/* @ts-ignore */}
                                {(child.description || child.i18nDescriptionKey) && (
                                  <p className="line-clamp-2 text-sm leading-snug text-zinc-400 whitespace-normal">
                                    {/* @ts-ignore */}
                                    {child.i18nDescriptionKey ? t(child.i18nDescriptionKey) : child.description}
                                  </p>
                                )}
                              </a>
                            </NavigationMenuLink>
                          )}
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
                      "bg-transparent text-zinc-100 hover:bg-zinc-800 hover:text-white focus:bg-zinc-800 focus:text-white data-active:bg-zinc-800"
                    )}
                  >
                    {/* @ts-ignore */}
                    {route.i18nKey ? t(route.i18nKey) : route.name}
                  </a>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      ))}
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
                            child.children ? (
                              <div key={child.name} className="flex flex-col space-y-2">
                                {/* @ts-ignore */}
                                <div className="text-sm font-semibold text-zinc-100 px-2 pt-2">{child.i18nKey ? t(child.i18nKey) : child.name}</div>
                                {child.children.map((grandChild) => (
                                  <a
                                    key={grandChild.name}
                                    href={grandChild.href || '#'}
                                    target={grandChild.href?.endsWith('.pdf') ? '_blank' : undefined}
                                    className='block py-2 pl-4 text-zinc-400 hover:text-white'
                                  >
                                    {/* @ts-ignore */}
                                    {grandChild.i18nKey ? t(grandChild.i18nKey) : grandChild.name}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <a
                                key={child.name}
                                href={getLocalizedRoute(child.href || '#', currentLang)}
                                className='block py-2 text-zinc-400 hover:text-white'
                              >
                                {/* @ts-ignore */}
                                {child.i18nKey ? t(child.i18nKey) : child.name}
                              </a>
                            )
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
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const $cartItems = useStore(cartItems);
  const cartCount = Object.values($cartItems).reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300 md:min-w-400',
        isScrolled
          ? 'bg-zinc-900/70 backdrop-blur-md border-b border-zinc-800/50 shadow-lg'
          : 'bg-zinc-900 border-b border-zinc-700'
      )}
    >
      <div className='container mx-auto flex h-16 items-center px-4'>
        <NavbarBrand currentLang={currentLang} />
        <NavLinksDesktop currentLang={currentLang} />
        <div className='grow' />
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="relative text-zinc-100 hover:bg-zinc-800 hover:text-white" onClick={() => isCartOpen.set(true)}>
              <FileText className="h-5 w-5" />
              {isMounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4.5 h-4.5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>

          <NavLinksMobile currentLang={currentLang} currentPath={currentPath} />

          <div className="hidden md:flex items-center ml-2">
            <LanguagePicker currentLang={currentLang} currentPath={currentPath} />
          </div>

          <CartSheet currentLang={currentLang} />
        </div>
      </div>
    </header>
  );
}
