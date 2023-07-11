import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import Blocks, { Block } from '@/components/Blocks';
import Card from '@/components/card/Card';
import InfoCards from '@/components/info-cards/InfoCards';
import { baseUrl } from '@/constants/urls';
import { TimeContext } from '@/contexts/TimeContext';
import { useIsDesktopL } from '@/hooks/useMediaQuery';

import type { HomeLoaderData } from '@/types/loaderData';
function getBlocks(lastBlock: number, lastConfirmedBlock: number, blockNumber: number) {
  const blocks = [];

  // confirmed blocks
  for (let blockHeight = lastBlock - blockNumber + 1; blockHeight <= lastConfirmedBlock; blockHeight++) {
    blocks.push({ number: blockHeight, confirmed: true });
  }

  // unconfirmed blocks
  for (let blockHeight = lastConfirmedBlock + 1; blockHeight <= lastBlock; blockHeight++) {
    blocks.push({ number: blockHeight, confirmed: false });
  }

  return blocks;
}
export default function HomePage() {
  const isDesktopL = useIsDesktopL();
  // use 13 blocks(desktop), otherwise use 20 blocks(XL desktop)
  const blockNumber = isDesktopL ? 20 : 13;
  const loaderData = useLoaderData() as HomeLoaderData;

  const [lastBlock, setLastBlock] = useState(loaderData.blocks.latestMinedBlock.number);
  const [lastConfirmedBlock, setLastConfirmedBlock] = useState(loaderData.blocks.latestSubnetCommittedBlock.number);
  const [lastParentConfirmedBlock, setLastParentConfirmedBlock] = useState(loaderData.blocks.latestParentChainCommittedBlock.number);
  const [blocks, setBlocks] = useState<Block[]>(getBlocks(loaderData.blocks.latestMinedBlock.number, loaderData.blocks.latestSubnetCommittedBlock.number, blockNumber));
  const [parentChainBlocks, setParentChainBlocks] = useState<Block[]>(getBlocks(loaderData.blocks.latestMinedBlock.number, loaderData.blocks.latestSubnetCommittedBlock.number, blockNumber));
  const [initialLastBlock] = useState<number>(loaderData.blocks.latestMinedBlock.number);
  const { currentUnixTime } = useContext(TimeContext);

  useEffect(() => {
    async function getData() {
      // const { data: { latestMinedBlock, latestSubnetCommittedBlock, latestParentChainCommittedBlock } } = await axios.get(`${baseUrl}/blocks`);
      const { data: { latestMinedBlock, latestSubnetCommittedBlock } } = await axios.get(`${baseUrl}/blocks`);
      setLastBlock(latestMinedBlock.number);
      setLastConfirmedBlock(latestSubnetCommittedBlock.number);
      setLastParentConfirmedBlock(latestSubnetCommittedBlock.number - 1);

      const newBlockNumber = latestMinedBlock.number - initialLastBlock + blockNumber;
      const blocks = getBlocks(latestMinedBlock.number, latestSubnetCommittedBlock.number, newBlockNumber);
      // Mock
      const parentChainBlocks = getBlocks(latestMinedBlock.number, latestSubnetCommittedBlock.number - 1, newBlockNumber);
      setBlocks(blocks);
      setParentChainBlocks(parentChainBlocks);
    }

    getData();
  }, [blockNumber, currentUnixTime, initialLastBlock]);

  return (
    <div className='grid gap-6 grid-col-1'>
      <Card>
        <h1 className='pb-4 text-xl font-medium'>subnet blockchain</h1>
        <Blocks
          initialLastBlock={initialLastBlock}
          lastBlock={lastBlock}
          lastConfirmedBlock={lastConfirmedBlock}
          blockNumber={blockNumber}
          blocks={blocks}
          name='subnet'
        />
      </Card>
      <Card>
        <h1 className='pb-4 text-xl font-medium'>checkpoints at the parent chain</h1>
        <Blocks
          initialLastBlock={initialLastBlock}
          lastBlock={lastBlock}
          lastConfirmedBlock={lastParentConfirmedBlock}
          blockNumber={blockNumber}
          blocks={parentChainBlocks}
          name='parent'
        />
      </Card>

      <InfoCards />
    </div>
  );
}
