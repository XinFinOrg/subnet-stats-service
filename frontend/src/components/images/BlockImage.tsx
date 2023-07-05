import { useContext } from 'react';

import BlueBlock from '@/assets/blocks/blue-block.svg';
import GreyBlock from '@/assets/blocks/grey-block.svg';
import { Block } from '@/components/Blocks';
import { ThemeContext } from '@/contexts/themeContext';

import styles from './block-image.module.scss';

interface BlockImageProps {
  block: Block;
  isLastConfirmed: boolean;
  isFirstConfirmed: boolean;
  isFirstUnConfirmed: boolean;
  isLast: boolean;
}

export default function BlockImage(props: BlockImageProps) {
  const { block } = props;
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  return (
    <div className='shrink-0 relative w-[35px] h-[37.82px] text-lg leading-none'>
      {isDarkMode ? (
        <>
          <div className={`z-30 absolute left-0 top-0 ${styles.darkBlock} ${styles.darkGreyBlock}`} />
          <div className={`z-40 absolute left-0 top-0 ${styles.darkBlock} ${styles.darkBlueBlock} ${styles.animate} ${block.confirmed ? styles.show : styles.hide}`} />
        </>
      ) : (
        <>
          <img src={GreyBlock} alt="" className={`z-30 absolute left-0 top-0`} />
          <img src={BlueBlock} alt="" className={`z-40 absolute left-0 top-0 ${styles.animate} ${block.confirmed ? styles.show : styles.hide}`} />
        </>
      )}
      <StatusBrace {...props} />
      <BlockNumber {...props} />
    </div>
  );
}

function StatusBrace({ isLastConfirmed, isFirstUnConfirmed, isLast }: BlockImageProps) {
  // Block status indicator
  if (isFirstUnConfirmed) {
    return <BraceStart />;
  } else if (isLastConfirmed || isLast) {
    return <BraceEnd />;
  }

  return (
    <div className="absolute -top-[54px] -right-[10px] -left-[10px] border-t-2 dark:border-text-white-800" />
  );
}

function BraceStart() {
  return (
    <div className='absolute -top-[54px] -right-[9px] left-[16px] pt-[20px] dark:text-primary flex border-t-2 border-l-2 rounded-tl-[20px] dark:border-text-white-800' />
  );
}

function BraceEnd() {
  return (
    <div className='absolute -top-[54px] right-[16px] -left-[9px] pt-[20px] dark:text-primary flex border-t-2 border-r-2 rounded-tr-[20px] dark:border-text-white-800' />
  );
}

function BlockNumber({ block, isLastConfirmed, isLast }: BlockImageProps) {
  if (isLastConfirmed) {
    return (
      <div className="absolute top-[64px] right-0 text-primary flex">
        <div>Block</div>
        <div className='pl-1'>{block.number}</div>
      </div>
    );
  } else if (isLast) {
    return (
      <div className="absolute top-[64px] right-0 text-primary flex">
        <div>Block</div>
        <div className='pl-1'>{block.number}</div>
      </div>
    );
  }
}