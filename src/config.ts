interface RouteData {
  name: string,
  href?: string,
  children?: RouteData[]
}

interface RoutesConfig {
  home: RouteData,
  products: RouteData,
  services: RouteData,
  news: RouteData
  about: RouteData,
  contact: RouteData,
}

export const ROUTES: RoutesConfig = {
  home: { name: 'Home', href: '/' },
  products: { name: 'Products', href: '/products' },
  services: {
    name: 'Services',
    children: [
      { name: 'Design', href: '/services/design' },
      { name: 'Manufacturing', href: '/services/manufacturing' },
    ]
  },
  news: { name: 'News', href: '/news' },
  about: { name: 'About', href: '/about' },
  contact: { name: 'Contact', href: '/contact' },
}

export const ROUTES_DATA = Object.values(ROUTES) as RouteData[]