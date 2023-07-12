import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import Blocks, { Block } from '@/components/Blocks';
import Card from '@/components/card/Card';
import InfoCards from '@/components/info-cards/InfoCards';
import InfoList from '@/components/info-list/InfoList';
import {
  BlockSizeWithGap, FakedConfirmedBlockNumber, FakedNotConfirmedBlockNumber,
  StandardScreenBlockNumber, WideScreenBlockNumber
} from '@/constants/config';
import { baseUrl } from '@/constants/urls';
import { TimeContext } from '@/contexts/TimeContext';
import { useIsTablet, useWindowWidth } from '@/hooks/useMediaQuery';

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

function getBlockNumber(windowWidth: number) {
  if (windowWidth >= 1440) {
    return WideScreenBlockNumber;
  }

  if (windowWidth < 1024) {
    const diff = 1024 - windowWidth;
    return StandardScreenBlockNumber - Math.floor(diff / BlockSizeWithGap);
  }

  const diff = 1440 - windowWidth;
  return WideScreenBlockNumber - Math.floor(diff / BlockSizeWithGap);
}

export default function HomePage() {
  const isTablet = useIsTablet();
  const windowWidth = useWindowWidth();

  const blockNumber = getBlockNumber(windowWidth);
  const loaderData = useLoaderData() as HomeLoaderData;

  const [lastSubnetBlock, setLastSubnetBlock] = useState(loaderData.blocks.subnet.latestMinedBlock.number);
  const [lastParentBlock, setLastParentBlock] = useState(loaderData.blocks.checkpoint.latestSubmittedSubnetBlock.number);
  const [lastSubnetConfirmedBlock, setLastSubnetConfirmedBlock] = useState(loaderData.blocks.subnet.latestCommittedBlock.number);
  const [lastParentConfirmedBlock, setLastParentConfirmedBlock] = useState(loaderData.blocks.checkpoint.latestCommittedSubnetBlock.number);
  const [blocks, setBlocks] = useState<Block[]>(getBlocks(loaderData.blocks.subnet.latestMinedBlock.number, loaderData.blocks.subnet.latestCommittedBlock.number, blockNumber));
  const [parentBlocks, setParentBlocks] = useState<Block[]>(getBlocks(loaderData.blocks.checkpoint.latestSubmittedSubnetBlock.number, loaderData.blocks.checkpoint.latestCommittedSubnetBlock.number, blockNumber));
  const { currentUnixTime } = useContext(TimeContext);

  useEffect(() => {
    async function getData() {
      const { data: { subnet, checkpoint } } = await axios.get<HomeLoaderData.Blocks>(`${baseUrl}/information/blocks`);
      setLastSubnetBlock(subnet.latestMinedBlock.number);
      setLastSubnetConfirmedBlock(subnet.latestCommittedBlock.number);
      setLastParentBlock(checkpoint.latestSubmittedSubnetBlock.number);
      setLastParentConfirmedBlock(checkpoint.latestCommittedSubnetBlock.number);

      const blocks = getBlocks(subnet.latestMinedBlock.number, subnet.latestCommittedBlock.number, blockNumber);
      const parentBlocks = getBlocks(checkpoint.latestSubmittedSubnetBlock.number, checkpoint.latestCommittedSubnetBlock.number, blockNumber);
      setBlocks(blocks);
      setParentBlocks(parentBlocks);
    }

    getData();
  }, [blockNumber, currentUnixTime]);

  const mappedInfo = {
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
        name: 'Last mined block number', value: lastSubnetBlock
      }]
    }
  };

  return (
    <div className='grid gap-6 grid-col-1'>
      {isTablet ? (
        <Card>
          <h1 className='pb-4 text-xl font-medium'>subnet blockchain</h1>
          <Blocks
            lastBlock={lastSubnetBlock}
            lastConfirmedBlock={lastSubnetConfirmedBlock}
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
            lastBlock={lastParentBlock}
            lastConfirmedBlock={lastParentConfirmedBlock}
            blockNumber={blockNumber}
            blocks={parentBlocks}
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
