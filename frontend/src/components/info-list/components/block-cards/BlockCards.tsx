import Blocks, { Block } from '@/components/Blocks';
import Card from '@/components/card/Card';
import InfoList from '@/components/info-list/InfoList';
import { useIsTablet } from '@/hooks/useMediaQuery';

import type { Info } from '@/types/info';

interface BlockCardsProps {
  blocks: Block[];
  parentBlocks: Block[];
  blockNumber: number;
  lastSubnetConfirmedBlock?: number;
  lastSubnetBlock?: number;
  lastParentConfirmedBlock?: number;
  lastParentBlock?: number;
}

export default function BlockCards(props: BlockCardsProps) {
  const {
    lastSubnetConfirmedBlock,
    lastSubnetBlock,
    lastParentConfirmedBlock,
    lastParentBlock,
    blockNumber,
    blocks,
    parentBlocks
  } = props;
  const isTablet = useIsTablet();

  const mappedInfo: Info = {
    subnet: {
      data: [{
        name: 'Last committed block number', value: lastSubnetConfirmedBlock
      }, {
        name: 'Last mined block number', value: lastSubnetBlock
      }]
    },
    parentChain: {
      data: [{
        name: 'Last committed block number', value: lastParentConfirmedBlock
      }, {
        name: 'Last mined block number', value: lastParentBlock
      }]
    }
  };

  return (
    <>
      {
        isTablet ? (
          <Card>
            <Blocks
              lastBlock={lastSubnetBlock}
              lastConfirmedBlock={lastSubnetConfirmedBlock}
              blockNumber={blockNumber}
              blocks={blocks}
              name='subnet blockchain'
            />
          </Card >) : (
          <Card className='max-w-[400px]'>
            <InfoList
              title='subnet blockchain'
              info={mappedInfo.parentChain}
            />
          </Card>
        )
      }
      {
        isTablet ? (
          <Card>
            <Blocks
              lastBlock={lastParentBlock}
              lastConfirmedBlock={lastParentConfirmedBlock}
              blockNumber={blockNumber}
              blocks={parentBlocks}
              name='checkpoints at the parent chain'
            />
          </Card>) : (
          <Card className='max-w-[400px]'>
            <InfoList
              title='copy at the parent chain'
              info={mappedInfo.parentChain}
            />
          </Card>
        )
      }
    </>
  );
}