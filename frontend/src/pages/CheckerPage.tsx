import { useState } from 'react';

import Card from '@/components/card/Card';
import ConfirmationStatus from '@/components/confirmation-status/ConfirmationStatus';
import InfoList from '@/components/info-list/InfoList';
import Loader from '@/components/loader/Loader';
import SearchBar from '@/components/search-bar/SearchBar';
import SearchNotFound from '@/components/search-not-found/SearchNotFound';
import { formatHash } from '@/utils/formatter';

import type { Info } from '@/types/info';
import type { SearchResult } from '@/types/searchResult';
export default function CheckerPage() {
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult>();

  return (
    <div className='min-h-[500px]'>
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        setSearchResult={setSearchResult}
      />
      <SearchResult
        searchText={searchText}
        searchResult={searchResult}
      />
    </div>
  );
}

interface SearchResultProps {
  searchText: string;
  searchResult?: SearchResult;
}

function SearchResult({ searchText, searchResult }: SearchResultProps) {
  if (!searchText) {
    return <></>;
  }

  if (!searchResult) {
    return <Loader />;
  }

  if (!searchResult.status) {
    return <SearchNotFound />;
  }

  if (searchResult.status !== 200) {
    console.error(searchResult.statusText);
    return <SearchNotFound />;
  }

  if (!searchResult.data) {
    return <></>;
  }

  const { parentChain, subnet } = searchResult.data;

  const mappedInfo: Info = {
    subnetBlock: {
      data: [{
        name: 'Block height',
        value: subnet.blockHeight
      }, {
        name: 'Block hash',
        value: formatHash(subnet.blockHash)
      }]
    },
    parentChain: {
      data: [{
        name: 'Block height',
        value: parentChain.blockHeight
      }, {
        name: 'Block hash',
        value: formatHash(parentChain.blockHash)
      }]
    }
  };

  return (
    <>
      <ConfirmationStatus
        className='pt-8'
        subnetStatus={subnet.isConfirmed}
        parentChainStatus={parentChain.isConfirmed}
      />
      <div className='pt-8 grid grid-cols-2 llg:grid-cols-3 gap-6'>
        <Card className={mappedInfo.subnetBlock?.data ? '' : 'border-none px-0 py-0'}>
          <InfoList
            title='Subnet Block Info'
            info={mappedInfo.subnetBlock?.data}
          />
        </Card>
        <Card className={mappedInfo.parentChain?.data ? '' : 'border-none px-0 py-0'}>
          <InfoList
            title='Checkpointing parent chain block'
            info={mappedInfo.parentChain?.data}
          />
        </Card>
      </div>
    </>
  );
}