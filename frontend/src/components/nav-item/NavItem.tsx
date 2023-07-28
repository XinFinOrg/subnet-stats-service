import { NavLink } from 'react-router-dom';

import { InlineSvg, InlineSvgColours, InlineSvgNames } from '@/components/images/Svg';
import { Page } from '@/components/nav/Nav';

export interface NavImageProps {
  isActive: boolean;
}

interface NavItemProps {
  Image: ({ isActive }: NavImageProps) => JSX.Element;
  text: string;
  page: Page;
  isParent?: boolean;
  className?: string;
}

interface NavItemParentProps {
  Image: ({ isActive }: NavImageProps) => JSX.Element;
  text: string;
  isParentGroupOpen: boolean;
  setIsParentGroupOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function NavItemParent({ text, Image, isParentGroupOpen, setIsParentGroupOpen }: NavItemParentProps) {
  return (
    <button className='w-full' onClick={() => setIsParentGroupOpen(!isParentGroupOpen)}>
      <div className='flex justify-between items-center py-[20px] px-5 font-semibold cursor-pointer dark:hover:bg-sky-300 dark:hover:bg-opacity-10 hover:bg-sky-300 hover:bg-opacity-20'>
        <div className='flex'>
          <div className='mt-[-2px]'><Image isActive={false} /></div>
          <span className='pl-2.5'>{text}</span>
        </div>
        <InlineSvg
          svgName={InlineSvgNames.Arrow}
          className={`${isParentGroupOpen ? '' : 'rotate-180'} transition-transform ease`}
          colour={InlineSvgColours.Default}
        />
      </div>
    </button>
  );
}

export function NavItem({ text, Image, className, page }: NavItemProps) {
  return (
    <div className={className ? className : ''}>
      <NavLink to={`/${page}`} className={({ isActive }) => {
        return `group flex align-center py-[20px] px-5 font-semibold cursor-pointer
          ${isActive
            ? `bg-blue-200 bg-opacity-20 dark:bg-sky-300 dark:bg-opacity-20 dark:border-sky-300 dark:text-sky-300 
              border-r-4 border-solid border-primary text-primary`
            : 'dark:hover:bg-sky-300 dark:hover:bg-opacity-10 hover:bg-sky-300/20 hover:bg-opacity-20'
          }
        `;
      }}>
        {({ isActive }) => (
          <>
            <div className='mt-[-2px]'><Image isActive={isActive} /></div>
            <span className='pl-2.5'>{text}</span>
          </>
        )}
      </NavLink>
    </div>
  );
}