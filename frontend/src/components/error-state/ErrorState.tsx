import { useContext } from 'react';

import Svg, { SvgNames } from '@/components/images/Svg';
import { ThemeContext } from '@/contexts/ThemeContext';

import styles from './error-state.module.scss';

interface InfoListErrorProps {
  title: string;
}

export default function ErrorState({ title }: InfoListErrorProps) {
  const { theme } = useContext(ThemeContext);
  const svgName = theme === 'dark' ? SvgNames.InfoDark : SvgNames.Info;

  return (
    <div className='h-[319px] bg-white dark:bg-bg-dark-800 rounded-b-3xl flex flex-col items-center justify-center'>
      <Svg svgName={svgName} className={`rounded-full ${styles.svgFilter}`} sizeClass='w-[75px] h-[75px]' />
      <p className='dark:text-text-white text-text-dark text-xl pt-9'>Failed to load {title.toLowerCase()}</p>
    </div>
  );
}

