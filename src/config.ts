interface RouteData {
  name: string,
  href: string,
}

interface RoutesConfig {
  home: RouteData,
  products: RouteData,
  about: RouteData,
  contact: RouteData,
}

export const ROUTES: RoutesConfig = {
  home: { name: 'Home', href: '/' },
  products: { name: 'Products', href: '/products' },
  about: { name: 'About', href: '/about' },
  contact: { name: 'Contact', href: '/contact' },
}

export const ROUTES_DATA = Object.values(ROUTES) as RouteData[]