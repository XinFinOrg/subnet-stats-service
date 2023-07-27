import { PropsWithChildren, useEffect, useRef } from 'react';

import { BlocksInfoItem } from '@/components/blocks-info/blocks-info-item/BlocksInfoItem';

interface InfiniteListProps extends PropsWithChildren {
  data: BlocksInfoItem[];
  fetchData: () => void;
  isFetchingMoreRecentBlocks?: boolean;
  isReachApiEndOfRecentBlocks?: boolean;
}

export default function InfiniteList({ fetchData, children, isFetchingMoreRecentBlocks, isReachApiEndOfRecentBlocks }: InfiniteListProps) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const currentTarget = observerTarget.current;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFetchingMoreRecentBlocks) {
          fetchData();
        }
      },
      { threshold: 1 }
    );

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchData, observerTarget, isFetchingMoreRecentBlocks]);

  return (
    <>
      {children}
      {(isReachApiEndOfRecentBlocks || isFetchingMoreRecentBlocks) && (
        <div className='text-bg-dark-800 dark:text-white p-5 pl-0'>
          {isFetchingMoreRecentBlocks && <>Loading more data...</>}
          {isReachApiEndOfRecentBlocks && <>The end of list...</>}
        </div>
      )}
      <div ref={observerTarget}></div>
      {/* The following extra div is essential for infinitely scrolling */}
      <div className='dark:text-bg-dark-800 text-white'>Detection helper</div>
    </ >
  );
}