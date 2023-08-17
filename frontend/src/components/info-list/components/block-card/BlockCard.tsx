import Blocks, { Block } from '@/components/Blocks';
import Card from '@/components/card/Card';
import InfoList from '@/components/info-list/InfoList';
import { useIsTablet } from '@/hooks/useMediaQuery';

import type { InfoListInfo } from '@/types/info';

interface BlockCardProps {
  name: string;
  blockNumber: number;
  blocks: Block[];
  lastBlock?: number;
  lastConfirmedBlock?: number;
  mobileTitle?: string;
  mobileInfo?: InfoListInfo;
}

export default function BlockCard(props: BlockCardProps) {
  const { lastBlock, lastConfirmedBlock, blockNumber, blocks, name, mobileTitle, mobileInfo } = props;
  const isTablet = useIsTablet();

  return isTablet ? (
    <Card>
      <Blocks
        lastBlock={lastBlock}
        lastConfirmedBlock={lastConfirmedBlock}
        blockNumber={blockNumber}
        blocks={blocks}
        name={name}
      />
    </Card >) : (
    <Card className='max-w-[400px]'>
      <InfoList
        title={mobileTitle}
        info={mobileInfo}
      />
    </Card>
  );
}