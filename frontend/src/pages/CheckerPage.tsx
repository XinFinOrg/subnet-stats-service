import { AxiosResponse } from 'axios';
import { useState } from 'react';
import { useMatch } from 'react-router-dom';

import Card from '@/components/card/Card';
import ConfirmationStatus from '@/components/confirmation-status/ConfirmationStatus';
import InfoList from '@/components/info-list/InfoList';
import Loader from '@/components/loader/Loader';
import SearchBar from '@/components/search-bar/SearchBar';
import SearchNotFound from '@/components/search-not-found/SearchNotFound';
import { formatHash, formatHashFromNonZero, formatMoney, formatTime } from '@/utils/formatter';

import type { Info, InfoItem } from '@/types/info';
import type { SearchResult } from '@/types/searchResult';

export default function CheckerPage() {
  const match = useMatch('/checker/:id');
  const [searchText, setSearchText] = useState(match?.params.id ?? '');
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
        value: formatHashFromNonZero(parentChain.proposer)
      }, {
        name: 'Timestamp',
        value: formatTime(parentChain.timestamp)
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
        value: formatHashFromNonZero(subnet.proposer)
      }, {
        name: 'Timestamp',
        value: formatTime(subnet.timestamp)
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
        subnetStatus={subnet?.isConfirmed}
        parentChainStatus={parentChain?.isConfirmed}
        inputType={inputType}
      />
      <div className='pt-8 grid grid-cols-2 llg:grid-cols-3 gap-6'>
        <InfoListCard
          title='Transaction Info'
          info={mappedInfo.transaction}
        />
        <InfoListCard
          title='Subnet Block Info'
          info={mappedInfo.subnetBlock}
        />
        <InfoListCard
          title='Checkpointing parent chain block'
          info={mappedInfo.parentChain}
        />
      </div>
    </>
  );
}

interface InfoListCardProps {
  title: string;
  info?: InfoItem;
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