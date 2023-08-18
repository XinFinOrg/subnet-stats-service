import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import Svg, { SvgNames } from '@/components/images/Svg';
import { ThemeContext } from '@/contexts/ThemeContext';

import styles from './error-state.module.scss';

interface InfoListErrorProps {
  isPage?: boolean;
  title?: string;
}

export default function ErrorState({ title, isPage }: InfoListErrorProps) {
  const { theme } = useContext(ThemeContext);
  const svgName = theme === 'dark' ? SvgNames.InfoDark : SvgNames.Info;
  const pageClassName = isPage ? 'rounded-3xl' : '';

  return (
    <div className={`${twMerge('h-[319px] bg-white dark:bg-bg-dark-800 rounded-b-3xl flex flex-col items-center justify-center', pageClassName)}`}>
      <Svg svgName={svgName} className={`rounded-full ${styles.svgFilter}`} sizeClass='w-[75px] h-[75px]' />
      <p className='dark:text-text-white text-text-dark text-xl pt-9 p-3'>Failed to load {title?.toLowerCase() ?? 'data'}</p>
    </div>
  );
}

