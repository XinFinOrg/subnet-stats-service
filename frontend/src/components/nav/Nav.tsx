import { useEffect, useState } from 'react';
import { useLoaderData, useLocation } from 'react-router-dom';

import CheckerImage from '@/components/images/CheckerImage';
import HouseImage from '@/components/images/HouseImage';
import ManagementImage from '@/components/images/ManagementImage';
import Svg, { SvgNames } from '@/components/images/Svg';
import NavItem from '@/components/nav-item/NavItem';
import ThemeSwitch from '@/components/theme-switch/ThemeSwitch';
import { useIsDesktop, useIsDesktopL } from '@/hooks/useMediaQuery';

import type { AppLoaderData } from '@/types/loaderData';
export type Pages = 'home' | 'checker' | 'management';

export default function Nav(): JSX.Element {
  const loaderData = useLoaderData() as AppLoaderData;
  const isDesktop = useIsDesktop();
  const isDesktopL = useIsDesktopL();
  const location = useLocation();
  const [navOpened, setNavOpened] = useState(false);

  function openNav() {
    setNavOpened(true);
  }

  function closeNav() {
    setNavOpened(false);
  }

  useEffect(() => {
    if (navOpened) {
      closeNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (!isDesktop) {
    if (!navOpened) {
      return (
        <div className='z-[100] dark:bg-bg-dark-900 sticky top-0 left-0'>
          <button className='p-6' onClick={openNav}>
            <Svg svgName={SvgNames.Menu} />
          </button>
        </div>
      );
    }

    return (
      <nav className='z-[100] sticky top-0 left-0 dark:bg-bg-dark-1000 grow shadow-grey flex flex-col justify-between rounded-b-xl'>
        <div>
          <div className='flex items-center flex-col border-text-white dark:border-border-light relative'>
            <button className='absolute left-0 top-0 p-6 text-3xl' onClick={closeNav} >
              x
            </button>
            <div className='pt-12 font-bold text-[26px]'>
              <Svg svgName={SvgNames.Logo} sizeClass='w-[80px]' />
            </div>
            <div className='py-6 dark:text-sky-300'>
              {loaderData.name}
            </div>
          </div>
          <NavItem Image={HouseImage} text='Home' className='pt-2' page='home' />
          <NavItem Image={CheckerImage} text='Confirmation Checker' page='checker' />
          <NavItem Image={ManagementImage} text='Management' page='management' />
        </div>
        <ThemeSwitch />
      </nav>
    );
  }

  return (
    <nav id='nav' className={`sticky top-0 dark:bg-bg-dark-1000 w-[246px] ${isDesktopL ? 'h-[1024px]' : 'h-[600px]'} max-h-screen shrink-0 shadow-grey flex flex-col justify-between`}>
      <div>
        <div className='flex items-center flex-col border-text-white dark:border-border-light'>
          <div className='pt-12 font-bold text-[26px]'>
            <Svg svgName={SvgNames.Logo} sizeClass='w-[80px]' />
          </div>
          <div className='py-6 dark:text-sky-300'>
            {loaderData.name}
          </div>
        </div>
        <NavItem Image={HouseImage} text='Home' className='pt-2' page='home' />
        <NavItem Image={CheckerImage} text='Confirmation Checker' page='checker' />
        <NavItem Image={ManagementImage} text='Management' page='management' />
      </div>
      <ThemeSwitch />
    </nav>
  );
}
