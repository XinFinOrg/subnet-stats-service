import { NavLink } from 'react-router-dom';

import { Pages } from '@/components/nav/Nav';

export interface NavImageProps {
  isActive: boolean;
}

interface NavItemProps {
  Image: ({ isActive }: NavImageProps) => JSX.Element;
  text: string;
  page: Pages;
  className?: string;
}

export default function NavItem({ text, Image, className, page }: NavItemProps) {
  return (
    <div className={className ? className : ''}>
      <NavLink to={`/${page}`} className={({ isActive }) => {
        return `group flex align-bottom py-[20px] px-6 font-semibold cursor-pointer
          ${isActive
            ? `bg-blue-200 bg-opacity-20 dark:bg-sky-300 dark:bg-opacity-20 dark:border-sky-300 dark:text-sky-300 
              border-r-4 border-solid border-primary text-primary`
            : 'dark:hover:bg-sky-300 dark:hover:bg-opacity-10 hover:bg-sky-300 hover:bg-opacity-20'
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