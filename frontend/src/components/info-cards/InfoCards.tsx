import { useEffect, useState } from 'react';

import BlocksInfo, { BlocksInfoItem } from '@/components/blocks-info/BlocksInfo';
import Card from '@/components/card/Card';
import InfoList from '@/components/info-list/InfoList';

const mockDataItem: BlocksInfoItem = {
  type: 'recent-block',
  height: 10000001,
  hash: '0xdFrsdf...Dsa31ld7',
  proposedBy: '0xdFrsdf...Dsa31ld7',
  subnetConfirmed: true,
  parentConfirmed: false,
  time: 2
};

const mockMasterNodeItem: BlocksInfoItem = {
  type: 'master-node',
  number: 1,
  account: '0xdFrsdf...Dsa31ld7',
  role: 'miner',
  activity: true,
  latestParticipateBlock: 10000001
};

const mockData = Array(20).fill('').map((_v, i) => {
  return { ...mockDataItem, height: mockDataItem.height + i };
});

const mockMasterNodes = Array(7).fill('').map<BlocksInfoItem>((_v, i) => {
  if (i === 3) {
    return { ...mockMasterNodeItem, role: 'penalty', number: (mockMasterNodeItem).number + i };
  }
  else if (i === 5) {
    return { ...mockMasterNodeItem, role: 'standby', number: (mockMasterNodeItem).number + i };
  }
  return { ...mockMasterNodeItem, role: 'miner', number: (mockMasterNodeItem).number + i };
});

export default function InfoCards() {
  const [blocksInfo, setBlocksInfo] = useState<BlocksInfoItem[]>([]);

  const mockInfo = {
    info1: [
      { name: 'Block Time', value: '2s' },
      { name: 'TX Throughput', value: '10 txs/s' },
      { name: 'Checkpointed to', value: 'XDC Devnet' },
    ],
    info2: [
      { name: 'Smart Contract', value: 'Shorten Hash' },
      { name: 'Backlog', value: '10 Subnet Headers' },
      { name: 'Ave. tx fee', value: '0.001XDC/hour' },
      { name: 'Remaining Balance', value: '10XDC\two weeks' },
    ],
    info3: [
      { name: 'Current committee size', value: '30' },
      { name: 'Activity', value: '0xdFrsdf...Dsa31ld7' },
      { name: 'Number of stanby nodes', value: '10' },
    ],
  };

  // mock function
  const fetchBlocksData = () => {
    if (!blocksInfo) {
      console.log('no info');
      return;
    }

    setBlocksInfo(blocksInfo => {
      const data = Array(20).fill('').map((_v, i) => {
        return { ...mockDataItem, height: (blocksInfo[blocksInfo.length - 1] as any).height + 1 + i };
      });

      return [...blocksInfo, ...data];
    });
  };

  useEffect(() => {
    setBlocksInfo(mockData);
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 llg:grid-cols-3 gap-6">
        <Card>
          <InfoList
            title='Network Info'
            status='Normal'
            info={mockInfo.info1}
          />
        </Card>
        <Card>
          <InfoList
            title='Relayer Info'
            status='Abnormal'
            info={mockInfo.info2}
          />
        </Card>
        <Card>
          <InfoList
            title='Master Nodes'
            status='Normal'
            info={mockInfo.info3}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 llg:grid-cols-2 gap-6">
        <Card className='max-w-[565px]'>
          <BlocksInfo title='Recent Blocks' data={blocksInfo} fetchMoreData={fetchBlocksData} enableInfinite />
        </Card>
        <Card className='max-w-[565px]'>
          <BlocksInfo title='Master Nodes' data={mockMasterNodes} />
        </Card>
      </div>
    </>
  );
}