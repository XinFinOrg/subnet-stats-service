import { PropsWithChildren, useEffect, useState } from 'react';
import { useLoaderData, useLocation } from 'react-router-dom';

import CheckerImage from '@/components/images/CheckerImage';
import HouseImage from '@/components/images/HouseImage';
import ManagementImage from '@/components/images/ManagementImage';
import ManagementLoginImage from '@/components/images/ManagementLoginImage';
import ManagementMasterCommitteeImage from '@/components/images/ManagementMasterCommitteeImage';
import Svg, { SvgNames } from '@/components/images/Svg';
import { NavItem, NavItemParent } from '@/components/nav-item/NavItem';
import ThemeSwitch from '@/components/theme-switch/ThemeSwitch';
import { useIsDesktop, useIsDesktopL } from '@/hooks/useMediaQuery';

import type { AppLoaderData } from '@/types/loaderData';
export type Page = 'home' | 'checker' | 'managementLogin' | 'managementMasterCommittee';

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
        <div className='z-[100] dark:bg-bg-dark-900 bg-white sticky top-0 left-0 flex justify-between'>
          <button className='p-6' onClick={openNav}>
            <Svg svgName={SvgNames.Menu} />
          </button>
          <ThemeSwitch isMobile />
        </div>
      );
    }

    return (
      <nav className='z-[100] sticky top-0 left-0 dark:bg-bg-dark-1000 bg-white grow shadow-grey flex flex-col justify-between rounded-b-xl'>
        <div>
          <BaseNavItems name={loaderData.name}>
            <button className='absolute left-0 top-0 p-6 text-3xl' onClick={closeNav} >
              x
            </button>
          </BaseNavItems>
        </div>
      </nav>
    );
  }

  return (
    <nav id='nav' className={`sticky top-0 dark:bg-bg-dark-1000 w-[246px] ${isDesktopL ? 'h-[1024px]' : 'h-[600px]'} max-h-screen shrink-0 shadow-grey flex flex-col justify-between`}>
      <div>
        <BaseNavItems name={loaderData.name} />
      </div>
      <ThemeSwitch />
    </nav>
  );
}

interface BaseNavItemsProps extends PropsWithChildren {
  name: string;
}

function BaseNavItems({ name, children }: BaseNavItemsProps) {
  const [isManagementGroupOpen, setIsManagementGroupOpen] = useState(false);

  return (
    <>
      <div className='flex items-center flex-col border-text-white dark:border-border-light'>
        {children}
        <div className='pt-12 font-bold text-[26px]'>
          <Svg svgName={SvgNames.Logo} sizeClass='w-[80px]' />
        </div>
        <div className='py-6 dark:text-sky-300'>
          {name}
        </div>
      </div>
      <NavItem Image={HouseImage} text='Home' className='pt-2' page='home' />
      <NavItem Image={CheckerImage} text='Confirmation Checker' page='checker' />

      {/* Management group */}
      <NavItemParent
        Image={ManagementImage}
        text='Management'
        isParentGroupOpen={isManagementGroupOpen}
        setIsParentGroupOpen={setIsManagementGroupOpen}
      />
      <div className={`pl-7 overflow-hidden ${isManagementGroupOpen ? 'h-96 transition-height duration-300' : 'h-0'}`}>
        <div className='border-l-4 border-text-dark-400/50'>
          <NavItem Image={ManagementLoginImage} text='Login' page='managementLogin' />
          <NavItem Image={ManagementMasterCommitteeImage} text='Master Committee' page='managementMasterCommittee' />
        </div>
      </div>
    </>
  );
}
