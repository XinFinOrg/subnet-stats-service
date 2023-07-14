import ErrorState from '@/components/error-state/ErrorState';
import Svg, { SvgNames } from '@/components/images/Svg';
import InfoListEmpty from '@/components/info-list/components/InfoListEmpty';
import Title from '@/components/title/Title';

import type { InfoItem } from '@/types/info';

interface InfoListProps {
  title: string;
  info?: InfoItem;
}

export default function InfoList({ title, info }: InfoListProps) {
  if (!info) {
    return <ErrorState title={title} />;
  }

  if (!info.data) {
    return <InfoListEmpty title={title} />;
  }

  const { health: status, data } = info;

  return (
    <>
      <div className='flex justify-between items-center pb-6'>
        <Title title={title} />
        {status && (
          <div className='inline-flex items-center'>
            <span>Status:</span>
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
      {data.map((item, index) => {
        return <InfoItem key={index} {...item} isFirst={index === 0} />;
      })}
    </>
  );
}

interface InfoItemProps extends InfoItem.Data {
  isFirst?: boolean;
}

function InfoItem({ name, value, isFirst }: InfoItemProps) {
  return (
    <div className={`flex justify-between pb-2 border-b-2 dark:border-text-dark-400 dark:border-opacity-40 border-text-white-400 ${isFirst ? '' : 'mt-6'}`}>
      <div className='flex items-center'>
        <Svg svgName={SvgNames.Rhombus} size='sm' />
        <div className='pl-1.5 dark:text-text-dark-100'>{name}</div>
      </div>
      <div className='font-bold text-sm leading-[120%]'>{value}</div>
    </div>
  );
}