import { useState } from 'react';

import Svg, { SvgNames } from '@/components/images/Svg';

export default function SearchBar() {
  const [searchText, setSearchText] = useState('');

  function search() {
    console.log(`Searching with text: ${searchText}`);
  }

  return (
    <div className="flex justify-between border-2 border-text-white-400 dark:border-none rounded-full pl-4 pr-2.5 py-2.5 dark:bg-bg-dark-800">
      <input
        type='text'
        className={`pl-3 grow text-base leading-tight outline-none
          text-text-dark-800 placeholder:text-text-dark-600
          dark:text-text-white-400 dark:bg-bg-dark-800 dark:placeholder:text-text-dark-500`
        }
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        placeholder="Block Height, Block Hash, TX Hash"
      />
      <button className='-m-1.5' onClick={search}>
        <Svg svgName={SvgNames.Search} sizeClass='w-[48px] h-[48px]' />
      </button>
    </div>
  );
}
