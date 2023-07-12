import { useState } from 'react';

import Card from '@/components/card/Card';
import ConfirmationStatus from '@/components/confirmation-status/ConfirmationStatus';
import InfoList from '@/components/info-list/InfoList';
import SearchBar from '@/components/search-bar/SearchBar';
import SearchNotFound from '@/components/search-not-found/SearchNotFound';
import { Info } from '@/types/info';
import { SearchResult } from '@/types/searchResult';

export default function CheckerPage() {
  const [searchResult] = useState<SearchResult>({});

  const mappedInfo: Info = {
    transaction: {
      // data: [{
      //   name: 'Block time',
      //   value: '2'
      // }, {
      //   name: 'TX Throughput',
      //   value: '10 texts/s'
      // }, {
      //   name: 'Checkpointed to',
      //   value: 'XDC'
      // }, {
      //   name: 'Gas',
      //   value: 'Date Time'
      // }]
    },
    subnetBlock: {
      data: [{
        name: 'Block time',
        value: '2'
      }, {
        name: 'TX Throughput',
        value: '10 texts/s'
      }, {
        name: 'Checkpointed to',
        value: 'XDC'
      }, {
        name: 'TX idx',
        value: 'Integer'
      }]
    },
    parentChain: {
      data: [{
        name: 'Block time',
        value: '2'
      }, {
        name: 'TX Throughput',
        value: '10 texts/s'
      }, {
        name: 'Checkpointed to',
        value: 'XDC'
      }, {
        name: 'TX idx',
        value: 'Integer'
      }]
    },
  };

  return (
    <>
      <SearchBar />
      {searchResult ? (
        <>
          <ConfirmationStatus className='pt-8' />
          <div className='pt-8 grid grid-cols-2 llg:grid-cols-3 gap-6'>
            <Card className='border-none px-0 py-0'>
              <InfoList
                title='Transaction Info'
                info={mappedInfo.transaction?.data}
              />
            </Card>
            <Card>
              <InfoList
                title='Subnet Block Info '
                info={mappedInfo.subnetBlock?.data}
              />
            </Card>
            <Card>
              <InfoList
                title='Checkpointing parent chain block'
                info={mappedInfo.parentChain?.data}
              />
            </Card>
          </div></>
      ) : (
        <SearchNotFound />
      )}
    </>
  );
}