import { BlocksInfoItem } from '@/components/blocks-info/blocks-info-item/BlocksInfoItem';
import BlocksInfo from '@/components/blocks-info/BlocksInfo';
import Card from '@/components/card/Card';
import { getUnixTime } from '@/utils/time';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  component: BlocksInfo,
  title: 'Components/Blocks Information'
};

export default meta;

type Story = StoryObj<typeof BlocksInfo>;

const masterNodes: BlocksInfoItem[] = [{
  type: 'master-node',
  account: 'Test account',
  number: 1,
  role: 'CANDIDATE'
}];

const recentBlocks: BlocksInfoItem[] = [{
  type: 'recent-block',
  number: 187280,
  hash: '0x98c0fda639ebe5fccbbbc266113cca9e826ab7ec3addad2e5127bbd4b5df1683',
  miner: 'xdc80f489a673042c2e5f17e5b2a5e49d71bf0611a4',
  committedInSubnet: false,
  committedInParentChain: false,
  timestamp: getUnixTime()
}, {
  type: 'recent-block',
  number: 187282,
  hash: '0x98c0fda639ebe5fccbbbc266113cca9e826ab7ec3addad2e5127bbd4b5df1684',
  miner: 'xdc80f489a673042c2e5f17e5b2a5e49d71bf0611a4',
  committedInSubnet: true,
  committedInParentChain: false,
  timestamp: getUnixTime()
}, {
  type: 'recent-block',
  number: 187283,
  hash: '0x98c0fda639ebe5fccbbbc266113cca9e826ab7ec3addad2e5127bbd4b5df1686',
  miner: 'xdc80f489a673042c2e5f17e5b2a5e49d71bf0611a4',
  committedInSubnet: true,
  committedInParentChain: true,
  timestamp: getUnixTime()
}];

const Template: Story = {
  render: (args) => (
    <Card className='max-w-[565px]'>
      <BlocksInfo {...args} />
    </Card>
  ),
};

export const MasterNode: Story = {
  ...Template,
  args: {
    title: 'Master Nodes',
    data: masterNodes
  }
};

export const RecentBlocks: Story = {
  ...Template,
  args: {
    title: 'Recent Blocks',
    data: recentBlocks
  }
};