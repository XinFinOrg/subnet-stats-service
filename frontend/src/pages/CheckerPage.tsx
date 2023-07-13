import { AxiosResponse } from 'axios';
import { useState } from 'react';

import Card from '@/components/card/Card';
import ConfirmationStatus from '@/components/confirmation-status/ConfirmationStatus';
import InfoList, { InfoItemBaseProps } from '@/components/info-list/InfoList';
import Loader from '@/components/loader/Loader';
import SearchBar from '@/components/search-bar/SearchBar';
import SearchNotFound from '@/components/search-not-found/SearchNotFound';
import { formatHash, formatMoney, formatTime } from '@/utils/formatter';

import type { Info } from '@/types/info';
import type { SearchResult } from '@/types/searchResult';

export default function CheckerPage() {
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState<AxiosResponse<SearchResult>>();

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
  searchResult?: AxiosResponse<SearchResult>;
}

function getMappedInfo(searchResult: SearchResult) {
  const { parentChain, subnet, transaction } = searchResult;

  const mappedInfo: Info = {};

  if (transaction) {
    mappedInfo.transaction = {
      data: [{
        name: 'From',
        value: formatHash(transaction.from)
      }, {
        name: 'To',
        value: formatHash(transaction.to)
      }, {
        name: 'Timestamp',
        value: formatTime(transaction.timestamp)
      }, {
        name: 'Gas',
        value: formatMoney(transaction.gas)
      }]
    };
  }

  if (parentChain) {
    mappedInfo.parentChain = {
      data: [{
        name: 'Height',
        value: parentChain.blockHeight
      }, {
        name: 'Hash',
        value: formatHash(parentChain.blockHash)
      }, {
        name: 'Proposer',
        value: ''
      }]
    };
  }

  if (subnet) {
    mappedInfo.subnetBlock = {
      data: [{
        name: 'Height',
        value: subnet.blockHeight
      }, {
        name: 'Hash',
        value: formatHash(subnet.blockHash)
      }, {
        name: 'Proposer',
        value: ''
      }]
    };
  }

  return mappedInfo;
}

function SearchResult({ searchText, searchResult }: SearchResultProps) {
  if (!searchText) {
    return <></>;
  }

  if (!searchResult) {
    return <Loader />;
  }

  if (searchResult.status !== 200) {
    return <SearchNotFound status={searchResult.status} />;
  }

  const { parentChain, subnet, inputType } = searchResult.data;
  const mappedInfo: Info = getMappedInfo(searchResult.data);

  return (
    <>
      <ConfirmationStatus
        className='pt-8'
        subnetStatus={subnet.isConfirmed}
        parentChainStatus={parentChain.isConfirmed}
        inputType={inputType}
      />
      <div className='pt-8 grid grid-cols-2 llg:grid-cols-3 gap-6'>
        <InfoListCard
          title='Transaction Info'
          info={mappedInfo.transaction?.data}
        />
        <InfoListCard
          title='Subnet Block Info'
          info={mappedInfo.subnetBlock?.data}
        />
        <InfoListCard
          title='Checkpointing parent chain block'
          info={mappedInfo.parentChain?.data}
        />
      </div>
    </>
  );
}

interface InfoListCardProps {
  title: string;
  info?: InfoItemBaseProps[];
}

function InfoListCard({ title, info }: InfoListCardProps) {
  if (!info) {
    return <></>;
  }

  return (
    <Card className={info ? '' : 'border-none px-0 py-0'}>
      <InfoList
        title={title}
        info={info}
      />
    </Card>
  );
}