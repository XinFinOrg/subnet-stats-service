import Svg, { SvgNames } from '@/components/images/Svg';

export default function Loader(): JSX.Element {
  return (
    <div className='flex justify-center items-center h-screen'>
      <Svg svgName={SvgNames.Loading} sizeClass='w-[100px]' />
    </div>
  );
}