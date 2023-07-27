import axios from 'axios';
import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

import {
  BlocksInfoItem, MasterNode
} from '@/components/blocks-info/blocks-info-item/BlocksInfoItem';
import BlocksInfo from '@/components/blocks-info/BlocksInfo';
import Card from '@/components/card/Card';
import InfoList from '@/components/info-list/InfoList';
import { baseUrl } from '@/constants/urls';
import { getSortedRecentBlocks, uniqReplaceByName } from '@/pages/utils/BlockHelper';
import { Info, InfoListHealth } from '@/types/info';
import { HomeLoaderData } from '@/types/loaderData';
import { formatHash, formatMoney } from '@/utils/formatter';

interface InfoCardsProps {
  nextFetchRecentBlocksIndex: number;
  setNextFetchRecentBlocksIndex: React.Dispatch<React.SetStateAction<number>>;
  recentBlocks: BlocksInfoItem[];
  setRecentBlocks: React.Dispatch<React.SetStateAction<BlocksInfoItem[]>>;
}

export default function InfoCards(props: InfoCardsProps) {
  const { nextFetchRecentBlocksIndex, setNextFetchRecentBlocksIndex, recentBlocks, setRecentBlocks } = props;
  const loaderData = useLoaderData() as HomeLoaderData;

  const [isFetchingMoreRecentBlocks, setIsLoadingMoreRecentBlocks] = useState(false);

  function getNetworkStatus(): InfoListHealth {
    if (loaderData.network?.health.status === 'UP') {
      return 'Normal';
    }

    return 'Abnormal';
  }

  function getRelayerStatus(): InfoListHealth {
    if (loaderData.relayer?.health.status === 'UP') {
      return 'Normal';
    }

    return 'Abnormal';
  }

  const mappedInfo: Info = getMappedInfo(loaderData, getNetworkStatus, getRelayerStatus);

  const masterNodes = loaderData.masterNodes?.nodes?.map<MasterNode>((v, i: number) => ({
    ...v,
    type: 'master-node',
    account: formatHash(v.address),
    number: i + 1
  }));

  const fetchMoreRecentBlocks = async () => {
    if (!recentBlocks) {
      return;
    }

    setIsLoadingMoreRecentBlocks(true);
    const { data } = await axios.get<HomeLoaderData.Blocks>(`${baseUrl}/information/blocks?blockNumIndex=${nextFetchRecentBlocksIndex}`);

    if (!data.blocks[0].number) {
      return;
    }

    setNextFetchRecentBlocksIndex(data.blocks[0].number);

    // concat data from api in the end of list since it would be the 'previous' data
    setRecentBlocks((recentBlocks: BlocksInfoItem[]) => {
      const newRecentBlocks = uniqReplaceByName(recentBlocks, getSortedRecentBlocks(data.blocks));
      setIsLoadingMoreRecentBlocks(false);
      return newRecentBlocks;
    });
  };

  return (
    <>
      <div className='grid lg:grid-cols-2 llg:grid-cols-3 gap-6'>
        <Card className='max-w-[400px]'>
          <InfoList
            title='Network Info'
            info={mappedInfo.network}
          />
        </Card>
        <Card className='max-w-[400px]'>
          <InfoList
            title='Relayer Info'
            info={mappedInfo.relayer}
          />
        </Card>
        <Card className='max-w-[400px]'>
          <InfoList
            title='Master Nodes Info'
            info={mappedInfo.masterNodes}
          />
        </Card>
      </div>

      <div className='grid grid-cols-1 llg:grid-cols-2 gap-6'>
        <Card className='max-w-[565px]'>
          <BlocksInfo
            title='Recent Blocks'
            data={recentBlocks}
            fetchMoreData={fetchMoreRecentBlocks}
            isFetchingMoreRecentBlocks={isFetchingMoreRecentBlocks}
            enableInfinite
          />
        </Card>
        {<Card className='max-w-[565px]'>
          <BlocksInfo title='Master Nodes' data={masterNodes} />
        </Card>}
      </div>
    </>
  );
}
function getMappedInfo(loaderData: HomeLoaderData, getNetworkStatus: () => InfoListHealth, getRelayerStatus: () => InfoListHealth): Info {
  const info: Info = {};

  if (loaderData.network) {
    info.network = {
      health: getNetworkStatus(),
      data: [
        { name: 'Block Time', value: `${Math.floor(loaderData.network.subnet.block.averageBlockTime * 100) / 100}s` },
        { name: 'TX Throughput', value: `${Math.round(loaderData.network.subnet.block.txThroughput * 100) / 100} txs/s` },
        { name: 'Checkpointed to', value: loaderData.network.parentChain.name },
      ]
    };
  }
  if (loaderData.relayer) {
    info.relayer = {
      health: getRelayerStatus(),
      data: [
        { name: 'Smart Contract', value: formatHash(loaderData.relayer.account.walletAddress) },
        { name: 'Backlog', value: `${loaderData.relayer.backlog} Subnet Headers` },
        { name: 'Remaining Balance', value: formatMoney(parseInt(loaderData.relayer.account.balance)) },
      ]
    };
  }
  if (loaderData.masterNodes) {
    info.masterNodes = {
      data: [
        { name: 'Current committee size', value: loaderData.masterNodes?.summary?.committee },
        { name: 'Activity(active / inactive)', value: `${loaderData.masterNodes?.summary?.activeNodes} / ${loaderData.masterNodes.summary.committee - loaderData.masterNodes?.summary?.activeNodes}` },
        { name: 'Number of standby nodes', value: loaderData.masterNodes?.summary?.inActiveNodes },
      ],
    };
  }

  return info;
}

