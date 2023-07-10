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

  const mappedInfo: Info = {
    network: {
      health: getNetworkStatus(),
      data: [
        { name: 'Block Time', value: `${loaderData.network.subnet.block.averageBlockTime}s` },
        { name: 'TX Throughput', value: `${Math.round(loaderData.network.subnet.block.txThroughput * 100) / 100} txs/s` },
        { name: 'Checkpointed to', value: loaderData.network.parentChain.name },
      ]
    },
    relayer: {
      health: getRelayerStatus(),
      data: [
        { name: 'Smart Contract', value: formatHash(loaderData.relayer.account.walletAddress) },
        { name: 'Backlog', value: `${loaderData.relayer.backlog} Subnet Headers` },
        { name: 'Ave. tx fee', value: loaderData.relayer.averageTXfee },
        { name: 'Remaining Balance', value: loaderData.relayer.account.balance },
      ]
    },
    masterNodes: {
      data: [
        { name: 'Current committee size', value: loaderData.masterNodes.summary.committee },
        { name: 'Activity(active / inactive)', value: `${loaderData.masterNodes.summary.activeNodes} / ${loaderData.masterNodes.summary.committee - loaderData.masterNodes.summary.activeNodes}` },
        { name: 'Number of standby nodes', value: loaderData.masterNodes.summary.inActiveNodes },
      ],
    },
  };

  const masterNodes = loaderData.masterNodes.nodes.map((v: any, i: number) => ({
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
    const data: any = [];

    setRecentBlocks(recentBlocks => {
      return [...recentBlocks, ...data];
    });
  };

  return (
    <>
      <div className='grid grid-cols-2 llg:grid-cols-3 gap-6'>
        <Card>
          <InfoList
            title='Network Info'
            status={mappedInfo.network.health}
            info={mappedInfo.network.data}
          />
        </Card>
        <Card>
          <InfoList
            title='Relayer Info'
            status={mappedInfo.relayer.health}
            info={mappedInfo.relayer.data}
          />
        </Card>
        <Card>
          <InfoList
            title='Master Nodes Info'
            status={mappedInfo.masterNodes.health}
            info={mappedInfo.masterNodes.data}
          />
        </Card>
      </div>

      <div className='grid grid-cols-1 llg:grid-cols-2 gap-6'>
        <Card className='max-w-[565px]'>
          <BlocksInfo title='Recent Blocks' data={recentBlocks} fetchMoreData={fetchMoreRecentBlocks} enableInfinite />
        </Card>
        <Card className='max-w-[565px]'>
          <BlocksInfo title='Master Nodes' data={masterNodes} />
        </Card>
      </div>
    </>
  );
}
