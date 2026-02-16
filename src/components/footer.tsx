
import { Mail, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ui, useTranslations } from '@/i18n/ui'; // Import i18n utils
import { getLocalizedRoute } from '@/i18n/utils';
// import STRINGS from '@/assets/i18n/en_us.json'; // Remove direct import
import logo from '@/assets/images/logo/logo-light.png';
import policeIcon from '@/assets/images/misc/ccp-police-icon.png';
import { ROUTES_DATA } from '@/config';
import { detectLocation } from '@/lib/utils';

interface FooterProps {
  contactInfo?: {
    tel_us?: string;
    tel_cn?: string;
    email?: string;
    address?: string;
  };
  currentLang?: string;
}

function ChinaICP({ t }: { t: (key: any) => string }) {
  const [isGeoLocationChina, setIsGeoLocationChina] = useState(false);

  useEffect(() => {
    const getGeoLocation = async () => {
      try {
        const location = await detectLocation();
        setIsGeoLocationChina(location?.country === 'CN');
      } catch (error) {
        console.error('Failed to detect location for ICP display', error);
      }
    };

    getGeoLocation();
  }, []);

  if (!isGeoLocationChina) return null;

  return (
    <div className="flex flex-col items-center gap-2 mt-4 md:flex-row md:gap-4 justify-center">
      <a
        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        href="http://beian.miit.gov.cn"
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('cn-icp-license')}
      </a>
      <div className="flex items-center gap-1 text-xs text-zinc-500">
        <img
          className="w-4 h-4 opacity-70"
          alt="police-icon"
          src={policeIcon.src}
        />
        <span>{t('cn-police-license')}</span>
      </div>
    </div>
  );
}

export default function Footer({ contactInfo, currentLang = 'en' }: FooterProps) {
  const t = useTranslations(currentLang as keyof typeof ui);
  const currentYear = new Date().getFullYear();

  // Selected quick links from ROUTES_DATA
  const quickLinks = ROUTES_DATA.filter(route =>
    ['home', 'about', 'products', 'contact'].some(key => route.href?.includes(key) || route.href === '/')
  );

  return (
    <footer className="w-full bg-zinc-950 text-zinc-300 border-t border-zinc-800">
      <div className="container mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 xl:gap-12">

          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <a href="/" className="inline-block">
              <img
                src={logo.src}
                alt="ALDR Logo"
                className="h-10 w-auto object-contain brightness-200 contrast-125" // Enhance logo visibility on dark
              />
            </a>
            <div className="flex flex-col gap-2">
              <p className="font-semibold text-white tracking-wide">
                {t('home-banner-caption1')}
              </p>
              <p className="text-sm text-zinc-400">
                {t('home-banner-caption2')}
              </p>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm">
              {t('footer-quick-links')}
            </h3>
            <nav className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={getLocalizedRoute(link.href || '/', currentLang)}
                  className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 w-fit"
                >
                  {/* @ts-ignore */}
                  {link.i18nKey ? t(link.i18nKey) : link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Services Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm">
              {t('footer-services')}
            </h3>
            <nav className="flex flex-col gap-3">
              <a href={getLocalizedRoute("/services/oem", currentLang)} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 w-fit">
                {t('footer-service-oem') || "OEM Service"}
              </a>
              <a href={getLocalizedRoute("/services/odm", currentLang)} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 w-fit">
                {t('footer-service-odm') || "ODM Service"}
              </a>
              <a href={getLocalizedRoute("/services/design", currentLang)} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 w-fit">
                {t('footer-service-design') || "Design"}
              </a>
              <a href={getLocalizedRoute("/services/manufacturing", currentLang)} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200 w-fit">
                {t('footer-service-manufacturing') || "Manufacturing"}
              </a>
            </nav>
          </div>

          {/* Products Column */}
          <div className="flex flex-col gap-6">
            <h3 className="text-white font-semibold uppercase tracking-wider text-sm">
              {t('footer-products')}
            </h3>
            <div className="flex flex-col gap-3 text-sm text-zinc-400">
              {/* Hardcoded key categories for reliability and SEO structure */}
              <a href={getLocalizedRoute("/products?category=Cleanroom%20Furniture", currentLang)} className="hover:text-white transition-colors duration-200">
                {t('cat-cleanroom-furniture') || "Cleanroom Furniture"}
              </a>
              <a href={getLocalizedRoute("/products?category=Transport", currentLang)} className="hover:text-white transition-colors duration-200">
                {t('cat-transport') || "Transport Solutions"}
              </a>
              <a href={getLocalizedRoute("/products?category=Storage", currentLang)} className="hover:text-white transition-colors duration-200">
                {t('cat-storage') || "Storage Systems"}
              </a>
              <a href={getLocalizedRoute("/products?category=Process%20Equipment", currentLang)} className="hover:text-white transition-colors duration-200">
                {t('cat-process-equipment') || "Process Equipment"}
              </a>
            </div>
          </div>

          {/* Contact Column */}
          <div className="flex flex-col gap-6">
            {/* Contact Info */}
            <div>
              <h3 className='text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4'>
                {t('footer-contact')}
              </h3>
              <ul className='space-y-4'>
                <li className='flex items-start'>
                  <Phone className='w-5 h-5 text-gray-400 mt-1 mr-3' />
                  <div className='flex flex-col'>
                    <span className='text-gray-300 hover:text-white transition-colors'>
                      {contactInfo?.tel_us || "+1 (617) 356-8065"} (US)
                    </span>
                    <span className='text-gray-300 hover:text-white transition-colors'>
                      {contactInfo?.tel_cn || "+86 18051120028"} (China)
                    </span>
                  </div>
                </li>
                <li className='flex items-center'>
                  <Mail className='w-5 h-5 text-gray-400 mr-3' />
                  <a
                    href={`mailto:${contactInfo?.email || "sales@aldreme.com"}`}
                    className='text-gray-300 hover:text-white transition-colors'
                  >
                    {contactInfo?.email || "sales@aldreme.com"}
                  </a>
                </li>
                <li className='flex items-start'>
                  <MapPin className='w-5 h-5 text-gray-400 mt-1 mr-3 shrink-0' />
                  <span className='text-gray-300'>
                    {contactInfo?.address || t('address-info')}
                  </span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col items-center gap-4 text-center">
          <p className="text-zinc-600 text-sm">
            &copy; {currentYear} {t('ALDR Automation Equipment Co., Ltd. All rights reserved')}
          </p>
          <ChinaICP t={t} />
        </div>
      </div>
    </footer>
  );
}