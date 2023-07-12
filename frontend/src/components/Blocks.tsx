import BlockConnectLine from '@/components/BlockConnectLine';
import BlockImage from '@/components/images/block-image/BlockImage';
import { FakedConfirmedBlockNumber, FakedNotConfirmedBlockNumber } from '@/constants/config';

export interface Block {
  number: number;
  confirmed: boolean;
}

interface BlocksProps {
  lastBlock: number;
  lastConfirmedBlock: number;
  blockNumber: number;
  blocks: Block[];
}

export default function Blocks({ lastBlock, lastConfirmedBlock, blockNumber, blocks }: BlocksProps) {
  {/* n * block-width + (n - 1) * spacing */ }
  const blockSize = 35 + 18;
  const allBlocksNotConfirmed = lastBlock - lastConfirmedBlock > blockNumber + FakedConfirmedBlockNumber;
  const unConfirmedNumber = allBlocksNotConfirmed ? blockNumber : lastBlock - lastConfirmedBlock;
  const confirmedNumber = blockNumber - unConfirmedNumber;
  // Definition: From left to right, the first visible index is 0
  const confirmedBlocksMidIndex = getConfirmedBlocksMidIndex();
  const notConfirmedBlocksMidIndex = confirmedNumber + (unConfirmedNumber / 2);

  function getConfirmedBlocksMidIndex() {
    if (allBlocksNotConfirmed) {
      // a number that will certainly hide 'confirmed' text
      return -100;
    }

    return (confirmedNumber - 1) / 2;
  }

  return (
    <>
      {/* Ex: 20 blocks + spacing = (35 + 18) * 20 - 18 = 1042px */}
      <div className='pt-[60px] llg:w-[1050px] w-[678px] h-[150px] overflow-hidden relative'>
        <div className='flex relative'>
          {
            blocks.map((block, index) => {
              const isFirstVisibleConfirmed = block.number === (lastBlock - blockNumber + 1);
              const isLastConfirmed = allBlocksNotConfirmed ? false : block.number === lastConfirmedBlock;
              const isFirstUnConfirmed = block.number === (lastConfirmedBlock + 1);
              const isLast = index === blocks.length - FakedNotConfirmedBlockNumber - 1;

              return (
                <div
                  key={block.number}
                  className='flex items-center transition-left duration-[2s] absolute top-0'
                  style={{ left: `${blockSize * (index - FakedConfirmedBlockNumber)}px` }}
                >
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

                </div>
              );
            })
          }
        </div>

        {/* 'Block 1' text */}
        <div className='absolute top-[120px] left-0 text-primary flex text-md'>
          <div>Block</div>
          <div className='pl-1'>1</div>
        </div>

        {/* First confirmed left brace */}
        <div className='absolute top-[26px] w-[30px] left-[16px] z-20 pt-[20px] dark:bg-bg-dark-800 bg-white border-t border-l rounded-tl-[20px] dark:border-text-white-800' />

        {/* Left brace layer mask */}
        <div className='absolute top-[0px] w-[40px] left-[-3px] h-[40px] dark:bg-bg-dark-800 bg-white ' />
      </div>
    </>
  );
}
