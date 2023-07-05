import axios from 'axios';
import { Fragment, useContext, useEffect, useRef, useState } from 'react';

import BlockConnectLine from '@/components/BlockConnectLine';
import BlockImage from '@/components/images/BlockImage';
import { baseUrl } from '@/constants/urls';
import { TimeContext } from '@/contexts/timeContext';
import { useIsDesktopL } from '@/hooks/useMediaQuery';

import styles from './blocks.module.scss';
import { useLoaderData } from 'react-router';

export interface Block {
  number: number;
  confirmed: boolean;
}

const addBlockPerClick = 3;

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

export default function Blocks() {
  const isDesktopL = useIsDesktopL();
  // use 13 blocks(desktop), otherwise use 20 blocks(XL desktop)
  const blockNumber = isDesktopL ? 20 : 13;
  const loaderData: any = useLoaderData();

  const [lastBlock, setLastBlock] = useState(loaderData.blocks.latestMinedBlock.number);
  const [lastConfirmedBlock, setLastConfirmedBlock] = useState(loaderData.blocks.latestSubnetCommittedBlock.number);
  const [blocks, setBlocks] = useState<Block[]>(getBlocks(loaderData.blocks.latestMinedBlock.number, loaderData.blocks.latestSubnetCommittedBlock.number, blockNumber));
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
      const { data: { latestMinedBlock, latestSubnetCommittedBlock } } = await axios.get(`${baseUrl}/blocks`);
      setLastBlock(latestMinedBlock.number);
      setLastConfirmedBlock(latestSubnetCommittedBlock.number);

      const newBlockNumber = latestMinedBlock.number - (initialLastBlock.current ?? 0) + blockNumber;
      const blocks = getBlocks(latestMinedBlock.number, latestSubnetCommittedBlock.number, newBlockNumber);
      setBlocks(blocks);
    }

    getData();
  }, [currentUnixTime]);

  function confirmBlocksExceptLastTwo() {
    const newBlocks = blocks.map((block, index) => {
      if (index === blocks.length - 1 || index === blocks.length - 2) {
        return { ...block, confirmed: false };
      }

      return { ...block, confirmed: true };
    });

    setBlocks(newBlocks);
    setLastConfirmedBlock(lastBlock - 2);
  }

  // TODO: replace addBlockPerClick to api data
  /**
   * 1. get increase block number by api(block number)
   * 2. push new blocks by loop & block id from api
   * 3. set new lastBlock state, set new translateX length state
   */
  function addBlock() {
    const newBlocks = [];
    for (let i = 1; i <= addBlockPerClick; i++) {
      newBlocks.push({ number: (lastBlock + i), confirmed: false });
    }

    setBlocks([
      ...blocks,
      ...newBlocks
    ]);
    setLastBlock(lastBlock => lastBlock + 3);
  }

  {/* n * block-width + (n - 1) * spacing */ }
  const blockSize = 35 + 17.99;
  const translateAmount = initialLastBlock.current ? -((lastBlock - initialLastBlock.current) * blockSize) : 0;
  const unConfirmedNumber = lastBlock - lastConfirmedBlock;
  const confirmedNumber = blockNumber - unConfirmedNumber;
  // Definition: From left to right, the first visible index is 0
  const confirmedBlocksMidIndex = (confirmedNumber - 1) / 2;
  const unConfirmedBlocksMidIndex = confirmedNumber + (unConfirmedNumber / 2);

  return (
    <>
      {/* Ex: 20 blocks + spacing = (35 + 18) * 20 - 18 = 1042px */}
      <div className='pt-[60px] llg:w-[1060px] w-[672px] h-[150px] overflow-hidden relative'>
        <div className='flex items-center transition duration-1000' style={{ transform: `translateX(${translateAmount}px)` }}>
          {
            blocks.map((block, index) => {
              const isFirstVisibleConfirmed = block.number === (lastBlock - blockNumber + 1);
              const isLastConfirmed = block.number === lastConfirmedBlock;
              const isFirstUnConfirmed = block.number === (lastConfirmedBlock + 1);
              const isLast = index === blocks.length - 1;

              return (
                <Fragment key={block.number}>
                  <BlockImage block={block}
                    isFirstConfirmed={isFirstVisibleConfirmed}
                    isLastConfirmed={isLastConfirmed}
                    isFirstUnConfirmed={isFirstUnConfirmed}
                    isLast={isLast}
                  />
                  {
                    !isLast && (
                      <BlockConnectLine showConfirmedColour={block.confirmed} />
                    )
                  }

                </Fragment>
              );
            })
          }
        </div>

        {/* 'Confirmed' text */}
        <div
          style={{ transform: `translateX(${confirmedBlocksMidIndex * blockSize}px)` }}
          className={`
            text-text-white-500
            absolute -top-[5px] -left-[28px] px-1 flex text-lg dark:bg-bg-dark-800 bg-white z-30 dark:text-text-white-800 ${styles.animate}
          `}
        >
          Confirmed
        </div>

        {/* 'Not Confirmed' text */}
        <div
          style={{ transform: `translateX(${unConfirmedBlocksMidIndex * blockSize}px)` }}
          className={`
            text-text-white-500
            absolute -top-[5px] -left-[72px] px-1 flex text-lg dark:bg-bg-dark-800 bg-white z-20 dark:text-text-white-800 ${styles.animate}
          `}
        >
          Not Confirmed
        </div>

        {/* 'Block 1' text */}
        <div className="absolute top-[120px] left-0 text-primary flex text-lg">
          <div>Block</div>
          <div className='pl-1'>1</div>
        </div>

        {/* First confirmed left brace */}
        <div className='absolute top-[6px] w-[50px] left-[16px] z-20 pt-[20px] dark:bg-bg-dark-800 bg-white border-t-2 border-l-2 rounded-tl-[20px] dark:border-text-white-800' />

        {/* Left brace layer mask */}
        <div className='absolute top-[0px] w-[40px] left-[-3px] h-[40px] dark:bg-bg-dark-800 bg-white ' />
      </div>

      <div>
        <button className="bg-blue-500 text-white py-2 px-4 mt-5 rounded text-base" onClick={addBlock}>Add block</button>
        <button className="bg-blue-500 text-white py-2 px-4 mt-5 rounded text-base ml-2" onClick={confirmBlocksExceptLastTwo}>Confirm blocks</button>
      </div>
    </>
  );
}