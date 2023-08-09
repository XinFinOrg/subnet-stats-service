import { PropsWithChildren, useEffect, useRef } from 'react';

import { BlocksInfoItem } from '@/components/blocks-info/blocks-info-item/BlocksInfoItem';

interface InfiniteListProps extends PropsWithChildren {
  data: BlocksInfoItem[];
  fetchData: () => void;
  isLoading?: boolean;
  isFetchingMore?: boolean;
  isReachApiEnd?: boolean;
}

export default function InfiniteList({ fetchData, children, isFetchingMore, isReachApiEnd, isLoading }: InfiniteListProps) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const currentTarget = observerTarget.current;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isFetchingMore) {
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
  }, [fetchData, observerTarget, isFetchingMore]);

  if (isLoading) {
    return (
      <tr className='pt-20 text-center'><td>Loading...</td></tr>
    );
  }

  return (
    <>
      {children}
      {(isReachApiEnd || isFetchingMore) && (
        <tr className='text-bg-dark-800 dark:text-white p-5 pl-0'>
          <td className='pt-1'>
            {isFetchingMore && !isReachApiEnd && <>Loading more data...</>}
            {isReachApiEnd && <>The end of list</>}
          </td>
        </tr>
      )}
      {/* TODO: */}
      <tr ref={observerTarget}></tr>
      {/* The following extra tr is essential for infinitely scrolling */}
      <tr className='dark:text-bg-dark-800 text-white'>
        <td>
          Detection helper
        </td>
      </tr>
    </>
  );
}