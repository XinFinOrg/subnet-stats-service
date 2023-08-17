import { Block } from '@/components/Blocks';
import BlockCard from '@/components/info-list/components/block-card/BlockCard';

import type { Info } from '@/types/info';

interface BlockCardsProps {
  blockNumber: number;
  subnetBlocks: Block[];
  parentBlocks: Block[];
  lastSubnetConfirmedBlock?: number;
  lastSubnetBlock?: number;
  lastParentConfirmedBlock?: number;
  lastParentBlock?: number;
}

export default function BlockCards(props: BlockCardsProps) {
  const {
    blockNumber,
    lastSubnetBlock,
    lastParentBlock,
    lastSubnetConfirmedBlock,
    lastParentConfirmedBlock,
    subnetBlocks,
    parentBlocks
  } = props;

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
      <BlockCard
        lastBlock={lastSubnetBlock}
        lastConfirmedBlock={lastSubnetConfirmedBlock}
        blockNumber={blockNumber}
        blocks={subnetBlocks}
        name='subnet blockchain'
        mobileTitle='Subnet blockchain'
        mobileInfo={mappedInfo.subnet}
      />
      <BlockCard
        lastBlock={lastParentBlock}
        lastConfirmedBlock={lastParentConfirmedBlock}
        blockNumber={blockNumber}
        blocks={parentBlocks}
        name='checkpoints at the parent chain'
        mobileTitle='Checkpoints at the parent chain'
        mobileInfo={mappedInfo.parentChain}
      />
    </>
  );
}