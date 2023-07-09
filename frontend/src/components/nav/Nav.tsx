import CheckerImage from '@/components/images/CheckerImage';
import HouseImage from '@/components/images/HouseImage';
import ManagementImage from '@/components/images/ManagementImage';
import NavItem from '@/components/nav-item/NavItem';
import ThemeSwitch from '@/components/theme-switch/ThemeSwitch';

export type Pages = 'home' | 'checker' | 'management';

export default function Nav(): JSX.Element {
  return (
    <nav id='nav' className='sticky top-0 dark:bg-bg-dark-1000 w-[246px] h-[1024px] shrink-0 shadow-grey flex flex-col justify-between'>
      <div>
        <div className="flex items-center flex-col border-b-[1px] border-text-white dark:border-border-light">
          <div className='pt-12 font-bold text-[26px]'>
            Logo
          </div>
          <div className="py-6 dark:text-sky-300">
            {'{Subnet ID}'}
          </div>
        </div>
        <NavItem Image={HouseImage} text='Home' className='pt-[72px]' page='home' />
        <NavItem Image={CheckerImage} text='Confirmation Checker' page='checker' />
        <NavItem Image={ManagementImage} text='Management' page='management' />
      </div>
      <ThemeSwitch />
    </nav>
  );
}