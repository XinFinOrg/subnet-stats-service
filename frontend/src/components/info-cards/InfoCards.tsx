import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import { BlocksInfoItem } from '@/components/blocks-info/blocks-info-item/BlocksInfoItem';
import BlocksInfo from '@/components/blocks-info/BlocksInfo';
import Card from '@/components/card/Card';
import InfoList, { InfoListHealth } from '@/components/info-list/InfoList';
import { formatHash } from '@/utils/formatter';

export default function InfoCards() {
  const loaderData: any = useLoaderData();
  const { network, relayer, masterNodes, blocks } = loaderData;

  const [recentBlocks, setRecentBlocks] = useState<BlocksInfoItem[]>(getInitRecentBlocks());

  function getNetworkStatus(): InfoListHealth {
    if (network.health.status === true) {
      return 'Normal';
    }

    return 'Abnormal';
  }

  function getRelayerStatus(): InfoListHealth {
    if (relayer.health.status === 'UP') {
      return 'Normal';
    }

    return 'Abnormal';
  }

  function getInitRecentBlocks() {
    return blocks.blocks.sort((a: any, b: any) => b.number - a.number).map((block: any) => ({
      type: 'recent-block',
      ...block
    }));
  }

  const mappedInfo = {
    // `recentBlocks` is handled by a state since it would get updated when load more page
    network: {
      health: getNetworkStatus(),
      data: [
        { name: 'Block Time', value: `${network.subnet.block.averageBlockTime}s` },
        { name: 'TX Throughput', value: `${Math.round(network.subnet.block.txThroughput * 100) / 100} txs/s` },
        { name: 'Checkpointed to', value: network.parentChain.name },
      ]
    },
    relayer: {
      health: getRelayerStatus(),
      data: [
        { name: 'Smart Contract', value: formatHash(relayer.account.walletAddress) },
        { name: 'Backlog', value: `${relayer.backlog} Subnet Headers` },
        // { name: 'Ave. tx fee', value: '0.001XDC/hour' },
        { name: 'Ave. tx fee', value: 'api TODO' },
        { name: 'Remaining Balance', value: relayer.account.balance },
      ]
    },
    masterNodes: {
      health: 'Normal' as InfoListHealth,
      data: [
        { name: 'Current committee size', value: masterNodes.summary.masterNode },
        // { name: 'Activity', value: '0xdFrsdf...Dsa31ld7' },
        { name: 'Activity', value: 'TODO: fisher/liam' },
        { name: 'Number of candidate nodes', value: masterNodes.summary.candidate },
      ],
      blocks: masterNodes.nodes.map((v: any, i: number) => ({
        ...v,
        type: 'master-node',
        account: formatHash(v.address),
        number: i + 1
      }))
    },
  };

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
      <div className="grid grid-cols-2 llg:grid-cols-3 gap-6">
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
            title='Master Nodes'
            status={mappedInfo.masterNodes.health}
            info={mappedInfo.masterNodes.data}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 llg:grid-cols-2 gap-6">
        <Card className='max-w-[565px]'>
          <BlocksInfo title='Recent Blocks' data={recentBlocks} fetchMoreData={fetchMoreRecentBlocks} enableInfinite />
        </Card>
        <Card className='max-w-[565px]'>
          <BlocksInfo title='Master Nodes' data={mappedInfo.masterNodes.blocks} />
        </Card>
      </div>
    </>
  );
}