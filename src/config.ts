interface RouteData {
  name: string;
  href?: string;
  description?: string;
  children?: RouteData[];
}

interface RoutesConfig {
  home: RouteData;
  products: RouteData;
  services: RouteData;
  // news: RouteData
  about: RouteData;
  contact: RouteData;
}

export const ROUTES: RoutesConfig = {
  home: { name: "Home", href: "/" },
  products: { name: "Products", href: "/products" },
  services: {
    name: "Services",
    children: [
      {
        name: "Cleanroom Design",
        href: "/services/design",
        description:
          "GMP-compliant layout and workflow design for ISO 8-5 environments.",
      },
      {
        name: "Precision Manufacturing",
        href: "/services/manufacturing",
        description:
          "Pharmaceutical-grade stainless steel fabrication with 150k annual capacity.",
      },
      {
        name: "OEM Partnership",
        href: "/services/oem",
        description:
          "Contract manufacturing for global life science and medical device brands.",
      },
      {
        name: "ODM Development",
        href: "/services/odm",
        description:
          "Custom instrumentation and equipment design from concept to commercialization.",
      },
    ],
  },
  // news: { name: 'News', href: '/news' },
  about: { name: "About", href: "/about" },
  contact: { name: "Contact", href: "/contact" },
};

export const ROUTES_DATA = Object.values(ROUTES) as RouteData[];
