import axios from 'axios';
import debounce from 'lodash.debounce';
import { useEffect, useMemo } from 'react';

import Svg, { SvgNames } from '@/components/images/Svg';
import { baseUrl } from '@/constants/urls';
import { SearchResult } from '@/types/searchResult';

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  setSearchResult: (result?: SearchResult) => void;
}

const url = `${baseUrl}/confirmation`;

export default function SearchBar({ searchText, setSearchText, setSearchResult }: SearchBarProps) {
  const debounceLoadData = useMemo(
    () => debounce(async (searchText) => {
      setSearchResult(undefined);
      try {
        const response = await axios.get(`${url}?input=${searchText}`, {
          validateStatus: function (_status) {
            // TODO: explore why status aren't exist
            return true;
          },
        });
        setSearchResult(response);
      } catch (error) {
        // TODO: explore the response for 404
        setSearchResult({ status: 400 });
      }
    }, 1000),
    [setSearchResult]
  );

  useEffect(() => {
    if (!searchText) {
      return;
    }

    debounceLoadData(searchText);
  }, [searchText, setSearchResult, debounceLoadData]);

  return (
    <div className='flex justify-between border-2 border-text-white-400 dark:border-none rounded-full pl-4 pr-2.5 py-2.5 dark:bg-bg-dark-800'>
      <input
        type='text'
        className={`pl-3 grow text-base leading-tight outline-none
          text-text-dark-800 placeholder:text-text-dark-600
          dark:text-text-white-400 dark:bg-bg-dark-800 dark:placeholder:text-text-dark-500`
        }
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        placeholder='Block Height, Block Hash, TX Hash'
      />
      <button className='-m-1.5'>
        <Svg svgName={SvgNames.Search} sizeClass='w-[48px] h-[48px]' />
      </button>
    </div>
  );
}
