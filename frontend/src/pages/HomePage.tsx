import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import Blocks, { Block } from '@/components/Blocks';
import Card from '@/components/card/Card';
import InfoCards from '@/components/info-cards/InfoCards';
import InfoList from '@/components/info-list/InfoList';
import {
  FakedConfirmedBlockNumber, FakedNotConfirmedBlockNumber, StandardScreenBlockNumber,
  WideScreenBlockNumber
} from '@/constants/config';
import { baseUrl } from '@/constants/urls';
import { TimeContext } from '@/contexts/TimeContext';
import { useIsDesktopL, useIsTablet } from '@/hooks/useMediaQuery';

import type { HomeLoaderData } from '@/types/loaderData';
function getBlocks(lastBlock: number, lastConfirmedBlock: number, blockNumber: number) {
  const blocks = [];
  // To allow animation when the furtherest left block move out
  const allBlockNumber = blockNumber + FakedConfirmedBlockNumber;
  const unconfirmedCount = lastBlock - lastConfirmedBlock;
  const confirmedCount = allBlockNumber - unconfirmedCount > 0 ? allBlockNumber - unconfirmedCount : 0;
  const firstBlockHeight = lastBlock - allBlockNumber + 1;

  if (lastBlock - lastConfirmedBlock > blockNumber + FakedConfirmedBlockNumber) {
    // unconfirmed blocks
    for (let i = 0; i < blockNumber + FakedConfirmedBlockNumber + FakedNotConfirmedBlockNumber; i++) {
      blocks.push({ number: firstBlockHeight + confirmedCount + i, confirmed: false });
    }

    return blocks;
  }

  // confirmed blocks
  for (let i = 0; i < confirmedCount; i++) {
    blocks.push({ number: firstBlockHeight + i, confirmed: true });
  }

  // unconfirmed blocks
  for (let i = 0; i < unconfirmedCount + FakedNotConfirmedBlockNumber; i++) {
    blocks.push({ number: firstBlockHeight + confirmedCount + i, confirmed: false });
  }

  return blocks;
}

export default function HomePage() {
  const isDesktopL = useIsDesktopL();
  const isTablet = useIsTablet();
  // use 13 blocks for tablet and desktop, otherwise use 20 blocks(XL desktop)
  const blockNumber = isDesktopL ? WideScreenBlockNumber : StandardScreenBlockNumber;
  const loaderData = useLoaderData() as HomeLoaderData;

  const [lastBlock, setLastBlock] = useState(loaderData.blocks.latestMinedBlock.number);
  const [lastConfirmedBlock, setLastConfirmedBlock] = useState(loaderData.blocks.latestSubnetCommittedBlock.number);
  const [lastParentConfirmedBlock, setLastParentConfirmedBlock] = useState(loaderData.blocks.latestParentChainCommittedBlock.number);
  const [blocks, setBlocks] = useState<Block[]>(getBlocks(loaderData.blocks.latestMinedBlock.number, loaderData.blocks.latestSubnetCommittedBlock.number, blockNumber));
  const [parentChainBlocks, setParentChainBlocks] = useState<Block[]>(getBlocks(loaderData.blocks.latestMinedBlock.number, loaderData.blocks.latestParentChainCommittedBlock.number, blockNumber));
  const [initialLastBlock] = useState<number>(loaderData.blocks.latestMinedBlock.number);
  const { currentUnixTime } = useContext(TimeContext);

  useEffect(() => {
    async function getData() {
      const { data: { latestMinedBlock, latestSubnetCommittedBlock, latestParentChainCommittedBlock } } = await axios.get<HomeLoaderData.Blocks>(`${baseUrl}/blocks`);
      setLastBlock(latestMinedBlock.number);
      setLastConfirmedBlock(latestSubnetCommittedBlock.number);
      setLastParentConfirmedBlock(latestParentChainCommittedBlock.number);

      const blocks = getBlocks(latestMinedBlock.number, latestSubnetCommittedBlock.number, blockNumber);
      const parentChainBlocks = getBlocks(latestMinedBlock.number, latestParentChainCommittedBlock.number, blockNumber);
      setBlocks(blocks);
      setParentChainBlocks(parentChainBlocks);
    }

    getData();
  }, [blockNumber, currentUnixTime, initialLastBlock]);

  const mappedInfo = {
    subnet: {
      data: [{
        name: 'Last committed block number', value: lastConfirmedBlock
      }, {
        name: 'Last mined block number', value: lastBlock
      }]
    },
    parentChain: {
      data: [{
        name: 'Last committed block number', value: lastParentConfirmedBlock
      }, {
        name: 'Last mined block number', value: lastBlock
      }]
    }
  };

  return (
    <div className='grid gap-6 grid-col-1'>
      {isTablet ? (
        <Card>
          <h1 className='pb-4 text-xl font-medium'>subnet blockchain</h1>
          <Blocks
            lastBlock={lastBlock}
            lastConfirmedBlock={lastConfirmedBlock}
            blockNumber={blockNumber}
            blocks={blocks}
          />
        </Card>) : (
        <Card className='max-w-[400px]'>
          <InfoList
            title='subnet blockchain'
            info={mappedInfo.parentChain.data}
          />
        </Card>
      )}
      {isTablet ? (
        <Card>
          <h1 className='pb-4 text-xl font-medium'>checkpoints at the parent chain</h1>
          <Blocks
            lastBlock={lastBlock}
            lastConfirmedBlock={lastParentConfirmedBlock}
            blockNumber={blockNumber}
            blocks={parentChainBlocks}
          />
        </Card>) : (
        <Card className='max-w-[400px]'>
          <InfoList
            title='copy at the parent chain'
            info={mappedInfo.parentChain.data}
          />
        </Card>
      )}

      <InfoCards />
    </div>
  );
}
