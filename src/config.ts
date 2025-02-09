interface RouteData {
  name: string,
  href?: string,
}

interface RoutesConfig {
  home: RouteData,
  products: RouteData,
  services: RouteData,
  blog: RouteData
  about: RouteData,
  contact: RouteData,
}

export const ROUTES: RoutesConfig = {
  home: { name: 'Home', href: '/' },
  products: { name: 'Products', href: '/products' },
  services: { name: 'Services' },
  blog: { name: 'Blog', href: '/blog' },
  about: { name: 'About', href: '/about' },
  contact: { name: 'Contact', href: '/contact' },
}

export const ROUTES_DATA = Object.values(ROUTES) as RouteData[]