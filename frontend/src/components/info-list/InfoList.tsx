import Svg, { SvgNames } from "@/components/images/Svg";
import Title from "@/components/title/Title";

export type InfoListHealth = 'Normal' | 'Abnormal';

interface InfoListProps {
  title: string;
  status: InfoListHealth;
  info: InfoItemBaseProps[];
}

export default function InfoList({ title, status, info }: InfoListProps) {
  return (
    <>
      <div className="flex justify-between items-center pb-6">
        <div>
          <Title title={title} />
        </div>
        <div className='inline-flex items-center'>
          <span>Status</span>
          <span
            className={`ml-1 px-3 py-2.5 bg-opacity-20 rounded-3xl font-bold leading-none
            ${status === 'Normal' ? 'bg-sky-500 text-sky-500' : 'bg-warning text-warning'}
          `}>
            {status}
          </span>
        </div>
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
