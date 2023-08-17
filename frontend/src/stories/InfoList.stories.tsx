import Card from '@/components/card/Card';
import InfoList from '@/components/info-list/InfoList';
import { InfoListInfo } from '@/types/info';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  component: InfoList,
  title: 'Components/InfoList'
};

export default meta;

const data: InfoListInfo.Data[] = [
  { name: 'Block Time', value: `100s` },
  { name: 'TX Throughput', value: `100 txs/s` },
  { name: 'Checkpointed to', value: 'XDC' },
];

type Story = StoryObj<typeof InfoList>;

export const Default: Story = {
  args: {
    title: 'No status',
    info: {
      data
    }
  },
  render: (args) => (
    <Card className='max-w-[400px]'>
      <InfoList {...args} />
    </Card>
  )
};

export const Normal: Story = {
  ...Default,
  args: {
    title: 'Normal',
    info: {
      health: 'Normal',
      data
    }
  }
};

export const Abnormal: Story = {
  ...Default,
  args: {
    title: 'Abnormal',
    info: {
      health: 'Abnormal',
      data
    }
  }
};

export const NoIcon: Story = {
  ...Default,
  args: {
    noIcon: true,
    title: 'No Icon',
    info: {
      health: 'Normal',
      data
    }
  }
};