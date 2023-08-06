import { useContext } from 'react';

import { Dot } from '@/components/dot/Dot';
import Svg, { SvgNames } from '@/components/images/Svg';
import { ThemeContext } from '@/contexts/ThemeContext';

import styles from './info-list-empty.module.scss';

interface InfoListEmptyProps {
  title?: string;
}

export default function InfoListEmpty({ title }: InfoListEmptyProps) {
  const { theme } = useContext(ThemeContext);
  const svgName = theme === 'dark' ? SvgNames.InfoDark : SvgNames.Info;

  return (
    <>
      <div className='flex items-center pl-6 h-[80px] rounded-t-3xl rounded-b bg-text-dark-100 dark:bg-bg-dark-700'>
        <Dot className='bg-text-dark-300 dark:bg-text-dark-600' />
        <Dot className='bg-text-dark-300 dark:bg-text-dark-600 ml-3' />
        <Dot className='bg-text-dark-300 dark:bg-text-dark-600 ml-3' />
      </div>
      <div className='h-[319px] bg-white dark:bg-bg-dark-800 rounded-b-3xl flex flex-col items-center justify-center'>

        <Svg svgName={svgName} className={`rounded-full ${styles.svgFilter}`} sizeClass='w-[75px] h-[75px]' />
        <p className='dark:text-text-white text-text-dark text-xl pt-9'>No {title?.toLowerCase() ?? 'Data'}</p>
      </div>
    </>
  );
}

