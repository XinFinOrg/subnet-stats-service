import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import Svg, { SvgNames } from '@/components/images/Svg';
import { ThemeContext } from '@/contexts/themeContext';

export default function SearchNotFound() {
  const { theme } = useContext(ThemeContext);
  const svgName = theme === 'dark' ? SvgNames.NoResultDark : SvgNames.NoResult;

  return (
    <div className='rounded-3xl mt-6 bg-text-dark-100 dark:bg-bg-dark-700'>
      <div className='p-6'>
        <div className='flex items-center h-10 p-6 rounded-full bg-text-dark-200 dark:bg-bg-dark-900'>
          <Dot />
          <Dot className='ml-3' />
          <Dot className='ml-3' />
        </div>
        <div className='mt-6 h-[250px] bg-white dark:bg-bg-dark-900 flex flex-col items-center justify-center'>
          <Svg svgName={svgName} sizeClass='w-[72px] h-[100px]' />
          <p className='dark:text-text-white text-text-dark text-xl pt-6'>No result for the query, please try again</p>
        </div>
      </div>
    </div>
  );
}

interface DotProps {
  className?: string;
}

function Dot(props: DotProps) {

  return (
    <div className={`${twMerge(
      props.className,
      'rounded-full w-5 h-5 bg-white dark:bg-bg-dark-700'
    )}`} />
  );
}