import { PropsWithChildren, useEffect, useRef } from 'react';

import { BlocksInfoItem } from '@/components/blocks-info/blocks-info-item/BlocksInfoItem';

interface InfiniteListProps extends PropsWithChildren {
  data: BlocksInfoItem[];
  fetchData: () => void;
}

export default function InfiniteList({ fetchData, children }: InfiniteListProps) {
  const observerTarget = useRef(null);

  useEffect(() => {
    const currentTarget = observerTarget.current;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
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
  }, [observerTarget]);

  return (
    <>
      {children}
      <div ref={observerTarget}></div>
      {/* An extra div is essential for infinitely scrolling */}
      <div className='dark:text-bg-dark-800 text-white'>End of list</div>
    </ >
  );
}