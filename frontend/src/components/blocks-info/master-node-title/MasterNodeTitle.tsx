import Svg, { SvgNames } from '@/components/images/Svg';
import Title from '@/components/title/Title';

interface MasterNodeTitleProps {
  title: string;
}

export function MasterNodeTitle({ title }: MasterNodeTitleProps) {
  return (
    <div className='flex justify-between'>
      <Title title={title} />
      <div className='flex flex-col dark:text-text-dark-400'>
        <div className='flex'>
          <Svg svgName={SvgNames.Miner} />
          <span className='pl-2.5'>Master Node</span>
        </div>
        <div className='pt-2.5 flex'>
          <Svg svgName={SvgNames.Penalty} />
          <span className='pl-2.5'>Penalty</span>
        </div>
        <div className='pt-2.5 flex'>
          <Svg svgName={SvgNames.Standby} />
          <span className='pl-2.5'>Candidate</span>
        </div>
      </div>
    </div>
  );
}
