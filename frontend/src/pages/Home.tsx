import axios from 'axios';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import Blocks, { Block } from '@/components/Blocks';
import Card from '@/components/card/Card';
import InfoCards from '@/components/info-cards/InfoCards';
import { baseUrl } from '@/constants/urls';
import { TimeContext } from '@/contexts/timeContext';
import { useIsDesktopL } from '@/hooks/useMediaQuery';

import type { LoaderData } from '@/types/loaderData';

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
export default function Home() {
  const isDesktopL = useIsDesktopL();
  // use 13 blocks(desktop), otherwise use 20 blocks(XL desktop)
  const blockNumber = isDesktopL ? 20 : 13;
  const loaderData = useLoaderData() as LoaderData;

  const [lastBlock, setLastBlock] = useState(loaderData.blocks.latestMinedBlock.number);
  const [lastConfirmedBlock, setLastConfirmedBlock] = useState(loaderData.blocks.latestSubnetCommittedBlock.number);
  const [lastParentConfirmedBlock, setLastParentConfirmedBlock] = useState(loaderData.blocks.latestParentChainCommittedBlock.number);
  const [blocks, setBlocks] = useState<Block[]>(getBlocks(loaderData.blocks.latestMinedBlock.number, loaderData.blocks.latestSubnetCommittedBlock.number, blockNumber));
  const [parentChainBlocks, setParentChainBlocks] = useState<Block[]>(getBlocks(loaderData.blocks.latestMinedBlock.number, loaderData.blocks.latestSubnetCommittedBlock.number, blockNumber));
  const initialLastBlock = useRef<number | null>(null);
  const { currentUnixTime } = useContext(TimeContext);

  useEffect(() => {
    if (initialLastBlock.current === null) {
      initialLastBlock.current = loaderData.blocks.latestMinedBlock.number;
    }
  }, []);

  // Move this up and send down to two blocks animations
  useEffect(() => {
    async function getData() {
      const { data: { latestMinedBlock, latestSubnetCommittedBlock, latestParentChainCommittedBlock } } = await axios.get(`${baseUrl}/blocks`);
      setLastBlock(latestMinedBlock.number);
      setLastConfirmedBlock(latestSubnetCommittedBlock.number);
      // Mocked
      // setLatestParentChainCommittedBlock(latestParentChainCommittedBlock.number)
      latestParentChainCommittedBlock;
      setLastParentConfirmedBlock(latestSubnetCommittedBlock.number - 5);

      const newBlockNumber = latestMinedBlock.number - (initialLastBlock.current ?? 0) + blockNumber;
      const blocks = getBlocks(latestMinedBlock.number, latestSubnetCommittedBlock.number, newBlockNumber);
      // mocked
      const parentChainBlocks = getBlocks(latestMinedBlock.number, latestSubnetCommittedBlock.number - 5, newBlockNumber);
      setBlocks(blocks);
      setParentChainBlocks(parentChainBlocks);
    }

    getData();
  }, [currentUnixTime]);

  if (!initialLastBlock.current) {
    return <></>;
  }

  return (
    <div className='grid gap-6 grid-col-1'>
      <Card>
        <h1 className='pb-6 text-3xl font-bold'>Subnet Blockchain</h1>
        <Blocks
          initialLastBlock={initialLastBlock.current}
          lastBlock={lastBlock}
          lastConfirmedBlock={lastConfirmedBlock}
          blockNumber={blockNumber}
          blocks={blocks}
        />
      </Card>
      <Card>
        <h1 className='pb-6 text-3xl font-bold'>Copy at the parent chain</h1>
        <Blocks
          initialLastBlock={initialLastBlock.current}
          lastBlock={lastBlock}
          lastConfirmedBlock={lastParentConfirmedBlock}
          blockNumber={blockNumber}
          blocks={parentChainBlocks}
        />
      </Card>

      <InfoCards />
    </div>
  );
}
