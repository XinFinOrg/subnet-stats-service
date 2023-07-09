import { Fragment } from 'react';

import BlockConnectLine from '@/components/BlockConnectLine';
import BlockImage from '@/components/images/block-image/BlockImage';

export interface Block {
  number: number;
  confirmed: boolean;
}

interface BlocksProps {
  initialLastBlock: number;
  lastBlock: number;
  lastConfirmedBlock: number;
  blockNumber: number;
  blocks: Block[];
}

export default function Blocks({ initialLastBlock, lastBlock, lastConfirmedBlock, blockNumber, blocks }: BlocksProps) {
  {/* n * block-width + (n - 1) * spacing */ }
  const blockSize = 35 + 17.99;
  const translateAmount = initialLastBlock ? -((lastBlock - initialLastBlock) * blockSize) : 0;
  const unConfirmedNumber = lastBlock - lastConfirmedBlock;
  const confirmedNumber = blockNumber - unConfirmedNumber;
  // Definition: From left to right, the first visible index is 0
  const confirmedBlocksMidIndex = (confirmedNumber - 1) / 2;
  const notConfirmedBlocksMidIndex = confirmedNumber + (unConfirmedNumber / 2);

  return (
    <>
      {/* Ex: 20 blocks + spacing = (35 + 18) * 20 - 18 = 1042px */}
      <div className='pt-[60px] llg:w-[1060px] w-[685px] h-[150px] overflow-hidden relative'>
        <div className='flex items-center transition duration-1000' style={{ transform: `translateX(${translateAmount}px)` }}>
          {
            blocks.map((block, index) => {
              const isFirstVisibleConfirmed = block.number === (lastBlock - blockNumber + 1);
              const isLastConfirmed = block.number === lastConfirmedBlock;
              const isFirstUnConfirmed = block.number === (lastConfirmedBlock + 1);
              const isLast = index === blocks.length - 1;

              return (
                <Fragment key={block.number}>
                  <BlockImage
                    block={block}
                    isFirstConfirmed={isFirstVisibleConfirmed}
                    isLastConfirmed={isLastConfirmed}
                    isFirstUnConfirmed={isFirstUnConfirmed}
                    isLast={isLast}
                    index={index}
                    blockNumber={blocks.length + 1}
                    confirmedBlocksMidIndex={confirmedBlocksMidIndex}
                    notConfirmedBlocksMidIndex={notConfirmedBlocksMidIndex}
                    blockSize={blockSize}
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

        {/* 'Block 1' text */}
        <div className='absolute top-[120px] left-0 text-primary flex text-lg'>
          <div>Block</div>
          <div className='pl-1'>1</div>
        </div>

        {/* First confirmed left brace */}
        <div className='absolute top-[6px] w-[30px] left-[16px] z-20 pt-[20px] dark:bg-bg-dark-800 bg-white border-t-2 border-l-2 rounded-tl-[20px] dark:border-text-white-800' />

        {/* Left brace layer mask */}
        <div className='absolute top-[0px] w-[40px] left-[-3px] h-[40px] dark:bg-bg-dark-800 bg-white ' />
      </div>
    </>
  );
}
