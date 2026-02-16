import iso9001 from "@/assets/docs/certifications/iso9001-2015.pdf";

interface RouteData {
  name: string;
  href?: string;
  description?: string;
  children?: RouteData[];
  i18nKey?: string;
  i18nDescriptionKey?: string;
}

interface RoutesConfig {
  home: RouteData;
  products: RouteData;
  services: RouteData;
  gallery: RouteData;
  // news: RouteData
  company: RouteData;
  contact: RouteData;
}

export const ROUTES: RoutesConfig = {
  home: { name: "Home", href: "/", i18nKey: "navbar-home" },
  products: { name: "Products", href: "/products", i18nKey: "navbar-products" },
  gallery: { name: "Gallery", href: "/gallery", i18nKey: "Products Gallery" },
  services: {
    name: "Services",
    i18nKey: "footer-services",
    children: [
      {
        name: "Cleanroom Design",
        href: "/services/design",
        i18nKey: "navbar-service-design",
        i18nDescriptionKey: "navbar-service-design-desc",
        description:
          "GMP-compliant layout and workflow design for ISO 8-5 environments.",
      },
      {
        name: "Precision Manufacturing",
        href: "/services/manufacturing",
        i18nKey: "navbar-service-manufacturing",
        i18nDescriptionKey: "navbar-service-manufacturing-desc",
        description:
          "Pharmaceutical-grade stainless steel fabrication with 150k annual capacity.",
      },
      {
        name: "OEM Partnership",
        href: "/services/oem",
        i18nKey: "navbar-service-oem",
        i18nDescriptionKey: "navbar-service-oem-desc",
        description:
          "Contract manufacturing for global life science and medical device brands.",
      },
      {
        name: "ODM Development",
        href: "/services/odm",
        i18nKey: "navbar-service-odm",
        i18nDescriptionKey: "navbar-service-odm-desc",
        description:
          "Custom instrumentation and equipment design from concept to commercialization.",
      },
    ],
  },
  company: {
    name: "Company",
    i18nKey: "navbar-company",
    children: [
      {
        name: "About",
        href: "/about",
        i18nKey: "navbar-aboutus",
      },
      {
        name: "Certifications",
        i18nKey: "navbar-certifications",
        children: [
          {
            name: "ISO 9001:2015",
            href: iso9001,
            i18nKey: "navbar-iso9001",
            i18nDescriptionKey: "navbar-iso9001-desc",
            description: "Quality Management System Certification",
          },
        ],
      },
    ],
  },
  // news: { name: 'News', href: '/news' },
  contact: { name: "Contact", href: "/contact", i18nKey: "navbar-contact" },
};

export const ROUTES_DATA = Object.values(ROUTES) as RouteData[];
