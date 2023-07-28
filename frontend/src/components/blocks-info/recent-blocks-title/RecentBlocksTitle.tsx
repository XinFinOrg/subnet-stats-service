import axios from 'axios';

import { BlocksInfoItem } from '@/components/blocks-info/blocks-info-item/BlocksInfoItem';
import Svg, { SvgNames } from '@/components/images/Svg';
import Title from '@/components/title/Title';
import { baseUrl } from '@/constants/urls';
import { HomeLoaderData } from '@/types/loaderData';
import { getSortedRecentBlocks } from '@/utils/blockHelper';

interface RecentBlocksTitleProps {
  title: string;
  setData?: React.Dispatch<React.SetStateAction<BlocksInfoItem[]>>;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RecentBlocksTitle({ title, setData, setIsLoading }: RecentBlocksTitleProps) {
  async function refreshData() {
    if (setData && setIsLoading) {
      setIsLoading(true);
      const { data } = await axios.get<HomeLoaderData.Blocks>(`${baseUrl}/information/blocks`);

      setData(getSortedRecentBlocks(data.blocks));
      setIsLoading(false);
    }
  }

  return (
    <div className='flex justify-between'>
      <Title title={title} />
      <div>
        <button className='flex' onClick={refreshData}>
          <Svg svgName={SvgNames.Refresh} />
          <div className='pl-2'>Refresh</div>
        </button>
      </div>
    </div>
  );
}