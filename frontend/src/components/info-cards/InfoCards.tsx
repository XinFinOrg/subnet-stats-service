import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import { BlocksInfoItem } from '@/components/blocks-info/blocks-info-item/BlocksInfoItem';
import BlocksInfo from '@/components/blocks-info/BlocksInfo';
import Card from '@/components/card/Card';
import InfoList from '@/components/info-list/InfoList';
import { Info, InfoListHealth } from '@/types/info';
import { HomeLoaderData } from '@/types/loaderData';
import { formatHash } from '@/utils/formatter';

export default function InfoCards() {
  const loaderData = useLoaderData() as HomeLoaderData;

  const [recentBlocks, setRecentBlocks] = useState<BlocksInfoItem[]>(getInitRecentBlocks());

  function getNetworkStatus(): InfoListHealth {
    if (loaderData.network.health.status === 'UP') {
      return 'Normal';
    }

    return 'Abnormal';
  }

  function getRelayerStatus(): InfoListHealth {
    if (loaderData.relayer.health.status === 'UP') {
      return 'Normal';
    }

    return 'Abnormal';
  }

  function getInitRecentBlocks(): BlocksInfoItem[] {
    return loaderData.blocks.blocks.sort((a, b) => b.number - a.number).map<BlocksInfoItem>(block => ({
      type: 'recent-block',
      ...block
    }));
  }

  function formatBalance(balance: number) {
    const abbreTable = [{
      name: 'Septillion', pow: 24,
    }, {
      name: 'Sextillion', pow: 21,
    }, {
      name: 'Quintillion', pow: 18,
    }, {
      name: 'Quadrillion', pow: 15,
    }, {
      name: 'Trillion', pow: 12,
    }, {
      name: 'B', pow: 9,
    }, {
      name: 'M', pow: 6,
    }, {
      name: 'K', pow: 3,
    }];

    for (let i = 0; i < abbreTable.length; i++) {
      const { name, pow } = abbreTable[i];
      const base = Math.pow(10, pow);

      if (balance / base > 0) {
        return `${Math.floor(((balance / base) * 100)) / 100} ${name}`;
      }
    }

    return balance;
  }

  const mappedInfo: Info = {
    network: loaderData.network ? {
      health: getNetworkStatus(),
      data: [
        { name: 'Block Time', value: `${loaderData.network.subnet.block.averageBlockTime}s` },
        { name: 'TX Throughput', value: `${Math.round(loaderData.network.subnet.block.txThroughput * 100) / 100} txs/s` },
        { name: 'Checkpointed to', value: loaderData.network.parentChain.name },
      ]
    } : null,
    relayer: loaderData.relayer ? {
      health: getRelayerStatus(),
      data: [
        { name: 'Smart Contract', value: formatHash(loaderData.relayer.account.walletAddress) },
        { name: 'Backlog', value: `${loaderData.relayer.backlog} Subnet Headers` },
        // TODO: explore cash format
        { name: 'Remaining Balance', value: formatBalance(parseInt(loaderData.relayer.account.balance)) },
      ]
    } : null,
    masterNodes: loaderData.masterNodes ? {
      data: [
        { name: 'Current committee size', value: loaderData.masterNodes?.summary?.committee },
        { name: 'Activity(active / inactive)', value: `${loaderData.masterNodes?.summary?.activeNodes} / ${loaderData.masterNodes.summary.committee - loaderData.masterNodes?.summary?.activeNodes}` },
        { name: 'Number of standby nodes', value: loaderData.masterNodes?.summary?.inActiveNodes },
      ],
    } : null,
  };

  const masterNodes = loaderData.masterNodes?.nodes?.map<MasterNode>((v, i: number) => ({
    ...v,
    type: 'master-node',
    account: formatHash(v.address),
    number: i + 1
  }));

  const fetchMoreRecentBlocks = () => {
    if (!recentBlocks) {
      return;
    }

    // TODO: From api
    const data: MasterNode[] = [];

    setRecentBlocks(recentBlocks => {
      return [...recentBlocks, ...data];
    });
  };

  return (
    <>
      <div className='grid lg:grid-cols-2 llg:grid-cols-3 gap-6'>
        <Card className='max-w-[400px]'>
          {mappedInfo.network ? (
            <InfoList
              title='Network Info'
              status={mappedInfo.network.health}
              info={mappedInfo.network.data}
            />) : (
            <div>Error state</div>
          )}
        </Card>
        <Card className='max-w-[400px]'>
          {mappedInfo.relayer ? (
            <InfoList
              title='Relayer Info'
              status={mappedInfo.relayer.health}
              info={mappedInfo.relayer.data}
            />
          ) : (<>Error state</>)}
        </Card>
        <Card className='max-w-[400px]'>
          {mappedInfo.masterNodes ? (
            <InfoList
              title='Master Nodes Info'
              status={mappedInfo.masterNodes.health}
              info={mappedInfo.masterNodes.data}
            />
          ) : (<>Error state</>)}
        </Card>
      </div>

      <div className='grid grid-cols-1 llg:grid-cols-2 gap-6'>
        <Card className='max-w-[565px]'>
          <BlocksInfo title='Recent Blocks' data={recentBlocks} fetchMoreData={fetchMoreRecentBlocks} enableInfinite />
        </Card>
        {masterNodes && <Card className='max-w-[565px]'>
          <BlocksInfo title='Master Nodes' data={masterNodes} />
        </Card>}
      </div>
    </>
  );
}
