import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import { Block } from '@/components/Blocks';
import { BlocksInfoItem } from '@/components/blocks-info/blocks-info-item/BlocksInfoItem';
import InfoCards from '@/components/info-cards/InfoCards';
import BlockCards from '@/components/info-list/components/block-cards/BlockCards';
import {
  BlockSizeWithGap, FakedConfirmedBlockNumber, FakedNotConfirmedBlockNumber,
  StandardScreenBlockNumber, WideScreenBlockNumber
} from '@/constants/config';
import { baseUrl } from '@/constants/urls';
import { TimeContext } from '@/contexts/TimeContext';
import { useWindowWidth } from '@/hooks/useMediaQuery';
import { getSortedRecentBlocks } from '@/utils/blockHelper';

import type { HomeLoaderData } from '@/types/loaderData';
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

function getBlocks(lastBlock: number | undefined, lastConfirmedBlock: number | undefined, blockNumber: number) {
  if (!lastBlock || !lastConfirmedBlock) {
    return [];
  }

  const blocks = [];
  // To allow animation when the furtherest left block move out
  const allBlockNumber = blockNumber + FakedConfirmedBlockNumber;
  const unconfirmedCount = lastBlock - lastConfirmedBlock;
  const confirmedCount = allBlockNumber - unconfirmedCount > 0 ? allBlockNumber - unconfirmedCount : 0;
  const firstBlockHeight = lastBlock - allBlockNumber + 1;

  /**
   * abnormal cases 
   **/
  if (lastConfirmedBlock - lastBlock > 0) {
    // This can't happen
    return [];
  }

  // handle huge gap between last mined and last confirmed block
  if (lastBlock - lastConfirmedBlock > blockNumber + FakedConfirmedBlockNumber) {
    // unconfirmed blocks
    for (let i = 0; i < blockNumber + FakedConfirmedBlockNumber + FakedNotConfirmedBlockNumber; i++) {
      blocks.push({ number: firstBlockHeight + confirmedCount + i, confirmed: false });
    }

    return blocks;
  }

  /**
   * normal cases 
   **/
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
  const loaderData = useLoaderData() as HomeLoaderData;
  const windowWidth = useWindowWidth();
  const blockNumber = getBlockNumber(windowWidth);

  const [lastSubnetBlock, setLastSubnetBlock] = useState(loaderData.blocks?.subnet.latestMinedBlock.number);
  const [lastParentBlock, setLastParentBlock] = useState(loaderData.blocks?.checkpoint.latestSubmittedSubnetBlock.number);
  const [lastSubnetConfirmedBlock, setLastSubnetConfirmedBlock] = useState(loaderData.blocks?.subnet.latestCommittedBlock.number);
  const [lastParentConfirmedBlock, setLastParentConfirmedBlock] = useState(loaderData.blocks?.checkpoint.latestCommittedSubnetBlock.number);
  const [subnetBlocks, setSubnetBlocks] = useState<Block[]>(getBlocks(loaderData.blocks?.subnet.latestMinedBlock.number, loaderData.blocks?.subnet.latestCommittedBlock.number, blockNumber));
  const [parentBlocks, setParentBlocks] = useState<Block[]>(getBlocks(loaderData.blocks?.checkpoint.latestSubmittedSubnetBlock.number, loaderData.blocks?.checkpoint.latestCommittedSubnetBlock.number, blockNumber));
  const [recentBlocks, setRecentBlocks] = useState<BlocksInfoItem[]>(getSortedRecentBlocks(loaderData.blocks?.blocks));
  const [isLoadingRecentBlocks, setIsLoadingRecentBlocks] = useState(false);
  const [nextFetchRecentBlocksIndex, setNextFetchRecentBlocksIndex] = useState(loaderData.blocks ? loaderData.blocks.subnet.latestMinedBlock.number - 50 : 0);
  const { currentUnixTime } = useContext(TimeContext);

  useEffect(() => {
    async function getData() {
      const { data: { subnet, checkpoint } } = await axios.get<HomeLoaderData.Blocks>(`${baseUrl}/information/blocks`);
      setLastSubnetBlock(subnet.latestMinedBlock.number);
      setLastParentBlock(checkpoint.latestSubmittedSubnetBlock.number);
      setLastSubnetConfirmedBlock(subnet.latestCommittedBlock.number);
      setLastParentConfirmedBlock(checkpoint.latestCommittedSubnetBlock.number);

      const subnetBlocks = getBlocks(subnet.latestMinedBlock.number, subnet.latestCommittedBlock.number, blockNumber);
      const parentBlocks = getBlocks(checkpoint.latestSubmittedSubnetBlock.number, checkpoint.latestCommittedSubnetBlock.number, blockNumber);
      setSubnetBlocks(subnetBlocks);
      setParentBlocks(parentBlocks);
    }

    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blockNumber, currentUnixTime]);

  return (
    <div className='grid gap-6 grid-col-1'>
  
      <BlockCards
        lastSubnetBlock={lastSubnetBlock}
        lastParentBlock={lastParentBlock}
        lastSubnetConfirmedBlock={lastSubnetConfirmedBlock}
        lastParentConfirmedBlock={lastParentConfirmedBlock}
        blockNumber={blockNumber}
        subnetBlocks={subnetBlocks}
        parentBlocks={parentBlocks}
      />
      <InfoCards
        nextFetchRecentBlocksIndex={nextFetchRecentBlocksIndex}
        setNextFetchRecentBlocksIndex={setNextFetchRecentBlocksIndex}
        recentBlocks={recentBlocks}
        setRecentBlocks={setRecentBlocks}
        isLoadingRecentBlocks={isLoadingRecentBlocks}
        setIsLoadingRecentBlocks={setIsLoadingRecentBlocks}
      />
    </div>
  );
}
