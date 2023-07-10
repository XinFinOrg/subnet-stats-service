import { useContext } from 'react';
import { twMerge } from 'tailwind-merge';

import BlueBlock from '@/assets/blocks/blue-block.svg';
import DarkBlueBlock from '@/assets/blocks/dark-blue-block.png';
import DarkGreyBlock from '@/assets/blocks/dark-grey-block.png';
import GreyBlock from '@/assets/blocks/grey-block.svg';
import { Block } from '@/components/Blocks';
import { ThemeContext } from '@/contexts/ThemeContext2';

import styles from './block-image.module.scss';

interface BlockImageProps {
  block: Block;
  isLastConfirmed: boolean;
  isFirstConfirmed: boolean;
  isFirstUnConfirmed: boolean;
  isLast: boolean;
  index: number;
  blockNumber: number;
  confirmedBlocksMidIndex: number;
  notConfirmedBlocksMidIndex: number;
  blockSize: number;
}

export default function BlockImage(props: BlockImageProps) {
  const { block } = props;
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  // Save some render
  if (props.blockNumber > 40 && props.index <= 20) {
    return (
      <div className='shrink-0 w-[35px]' />
    );
  }

  return (
    <div className='shrink-0 relative w-[35px] h-[37.82px] text-lg leading-none'>
      {isDarkMode ? (
        <>
          {/* The provided dark block image size are different from the light block images, therefore we use background image to adjust width */}
          <div
            className={`z-30 absolute left-0 top-0 ${styles.darkBlock}`}
            style={{ backgroundImage: `url(${DarkGreyBlock})` }}
          />
          <div
            className={`z-40 absolute left-0 top-0 ${styles.darkBlock} ${styles.animate} ${block.confirmed ? styles.show : styles.hide}`}
            style={{ backgroundImage: `url(${DarkBlueBlock})` }}
          />
        </>
      ) : (
        <>
          <img src={GreyBlock} alt='' className={`z-30 absolute left-0 top-0`} />
          <img src={BlueBlock} alt='' className={`z-40 absolute left-0 top-0 ${styles.animate} ${block.confirmed ? styles.show : styles.hide}`} />
        </>
      )}
      <StatusBrace {...props} />
      <BlockNumber {...props} />
      {props.isFirstConfirmed && (
        <>
          <StatusText
            text='Confirmed'
            translateAmount={props.confirmedBlocksMidIndex * props.blockSize}
            className='-left-[18px]'
          />
          <StatusText
            text='Not Confirmed'
            translateAmount={props.notConfirmedBlocksMidIndex * props.blockSize}
            className='-left-[58.5px]'
          />
        </>
      )}
    </div>
  );
}
interface BaseTextProps {
  text: string;
  translateAmount: number;
  className: string;
}

function StatusText({ text, translateAmount, className }: BaseTextProps) {
  return (
    <div
      style={{ transform: `translateX(${translateAmount}px)` }}
      className={twMerge(`
        text-text-white-500 whitespace-nowrap
        absolute -top-[43px] -left-[50px] px-1 flex text-sm dark:bg-bg-dark-800 bg-white z-30 dark:text-text-white-800 ${styles.animate}
      `, className)}
    >
      {text}
    </div>
  );
}

/**
 * The line(border) that surrounded with 'Confirmed'/'Not Confirmed' text
 * --- Confirmed ---
 */
function StatusBrace({ isLastConfirmed, isFirstUnConfirmed, isLast }: BlockImageProps) {
  if (isFirstUnConfirmed) {
    return <BraceStart />;
  } else if (isLastConfirmed || isLast) {
    return <BraceEnd />;
  }

  return (
    <div className='absolute -top-[34px] -right-[10px] -left-[10px] border-t dark:border-text-white-800' />
  );
}

function BraceStart() {
  return (
    <div className='absolute -top-[34px] -right-[9px] left-[16px] pt-[20px] dark:text-primary flex border-t border-l rounded-tl-[20px] dark:border-text-white-800' />
  );
}

function BraceEnd() {
  return (
    <div className='absolute -top-[34px] right-[16px] -left-[9px] pt-[20px] dark:text-primary flex border-t border-r rounded-tr-[20px] dark:border-text-white-800' />
  );
}

function BlockNumber({ block, isLastConfirmed, isLast }: BlockImageProps) {
  if (isLastConfirmed) {
    return (
      <div className='absolute top-[60px] right-0 text-primary flex text-sm'>
        <div>Block</div>
        <div className='pl-1'>{block.number}</div>
      </div>
    );
  } else if (isLast) {
    return (
      <div className='absolute top-[60px] right-0 text-primary flex text-sm'>
        <div>Block</div>
        <div className='pl-1'>{block.number}</div>
      </div>
    );
  }
}