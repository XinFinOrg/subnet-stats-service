import Svg, { SvgNames } from '@/components/images/Svg';

interface LoaderProps {
  minHeightClassName?: string;
}

export default function Loader({ minHeightClassName }: LoaderProps): JSX.Element {
  return (
    <div className={`flex justify-center items-center ${minHeightClassName ? minHeightClassName : 'min-h-[500px] h-full'}`}>
      <Svg svgName={SvgNames.Loading} sizeClass='w-[100px]' />
    </div>
  );
}