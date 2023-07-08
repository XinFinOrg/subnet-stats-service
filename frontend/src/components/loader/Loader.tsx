import Svg, { SvgNames } from '@/components/images/Svg';

export default function Loader(): JSX.Element {
  return (
    <div className='flex justify-center items-center h-full'>
      <Svg svgName={SvgNames.Loading} sizeClass='w-[100px]' />
    </div>
  );
}