'use client';

import policeIcon from '@/assets/images/misc/ccp-police-icon.png';
import { detectLocation } from '@/lib/utils';
import { useEffect, useState } from 'react';

function ChinaICP() {
  const [isGeoLocationChina, setIsGeoLocationChina] = useState(false);

  useEffect(() => {
    console.info('fetching geolocation ...')

    const getGeoLocation = async () => {
      const location = await detectLocation();
      setIsGeoLocationChina(location?.country === 'CN');
    };

    getGeoLocation();
  }, []);

  return (
    isGeoLocationChina &&
    <>
      <p>
        <a className="text-xs text-white" href="http://beian.miit.gov.cn">{"苏ICP备2020053862号-1"}</a>
      </p>
      <div className="flex flex-row items-center text-white no-underline">
        <img className="mr-1 w-4 h-4" alt="police-icon" src={policeIcon.src} /> <span className='text-xs'>{"苏公网安备 32050902101167号"}</span>
      </div>
    </>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <div className='flex flex-col items-center bg-slate-800 border-none p-4'>
      <p className='text-white'>
        {"Copyright"} @{currentYear} {"ALDR Co., Ltd. All rights reserved"}
      </p>

      <ChinaICP />
    </div>
  )
}