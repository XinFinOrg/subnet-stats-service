import { useContext } from 'react';

import { Dot } from '@/components/dot/Dot';
import Svg, { SvgNames } from '@/components/images/Svg';
import Title from '@/components/title/Title';
import { ThemeContext } from '@/contexts/ThemeContext2';

import styles from './info-list.module.scss';

import type { InfoListHealth } from '@/types/info';

interface InfoListProps {
  title: string;
  info?: InfoItemBaseProps[];
  status?: InfoListHealth;
}

export default function InfoList({ title, status, info }: InfoListProps) {
  if (!info) {
    return <InfoListEmpty title={title} />;
  }

  return (
    <>
      <div className='flex justify-between items-center pb-6'>
        <Title title={title} />
        {status && (
          <div className='inline-flex items-center'>
            <span>Status</span>
            <span
              className={`ml-1 px-3 py-2.5 bg-opacity-20 rounded-3xl font-bold leading-none
               ${status === 'Normal' ? 'bg-sky-500 text-sky-500' : 'bg-warning text-warning'}`
              }
            >
              {status}
            </span>
          </div>
        )}
      </div>
      {info.map((item, index) => {
        return <InfoItem key={index} {...item} isFirst={index === 0} />;
      })}
    </>
  );
}

interface InfoItemBaseProps {
  name: string;
  value: number | string;
}

interface InfoItemProps extends InfoItemBaseProps {
  isFirst?: boolean;
}

function InfoItem({ name, value, isFirst }: InfoItemProps) {
  return (
    <div className={`flex justify-between pb-2 border-b-2 dark:border-text-dark-400 dark:border-opacity-40 border-text-white-400 ${isFirst ? '' : 'mt-6'}`}>
      <div className='flex items-center'>
        <Svg svgName={SvgNames.Rhombus} size='sm' />
        <div className='pl-1.5 dark:text-text-dark-100'>{name}</div>
      </div>
      <div className='font-bold text-lg leading-[120%]'>{value}</div>
    </div>
  );
}

interface InfoListEmptyProps {
  title: string;
}

function InfoListEmpty({ title }: InfoListEmptyProps) {
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
        <p className='dark:text-text-white text-text-dark text-xl pt-9'>No {title.toLowerCase()}</p>
      </div>
    </>
  );
}

