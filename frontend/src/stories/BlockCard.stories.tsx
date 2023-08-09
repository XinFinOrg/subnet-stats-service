import BlockCard from '@/components/info-list/components/block-card/BlockCard';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  component: BlockCard,
  title: 'Components/Block card'
};

export default meta;

type Story = StoryObj<typeof BlockCard>;

export const Default: Story = {
  render: (args: any) => (
    <div className='bg-white'>
      <BlockCard {...args} />
    </div>
  ),
  args: {
    "lastBlock": 27157,
    "lastConfirmedBlock": 27154,
    "blockNumber": 19,
    "blocks": [
      {
        "number": 27129,
        "confirmed": true
      },
      {
        "number": 27130,
        "confirmed": true
      },
      {
        "number": 27131,
        "confirmed": true
      },
      {
        "number": 27132,
        "confirmed": true
      },
      {
        "number": 27133,
        "confirmed": true
      },
      {
        "number": 27134,
        "confirmed": true
      },
      {
        "number": 27135,
        "confirmed": true
      },
      {
        "number": 27136,
        "confirmed": true
      },
      {
        "number": 27137,
        "confirmed": true
      },
      {
        "number": 27138,
        "confirmed": true
      },
      {
        "number": 27139,
        "confirmed": true
      },
      {
        "number": 27140,
        "confirmed": true
      },
      {
        "number": 27141,
        "confirmed": true
      },
      {
        "number": 27142,
        "confirmed": true
      },
      {
        "number": 27143,
        "confirmed": true
      },
      {
        "number": 27144,
        "confirmed": true
      },
      {
        "number": 27145,
        "confirmed": true
      },
      {
        "number": 27146,
        "confirmed": true
      },
      {
        "number": 27147,
        "confirmed": true
      },
      {
        "number": 27148,
        "confirmed": true
      },
      {
        "number": 27149,
        "confirmed": true
      },
      {
        "number": 27150,
        "confirmed": true
      },
      {
        "number": 27151,
        "confirmed": true
      },
      {
        "number": 27152,
        "confirmed": true
      },
      {
        "number": 27153,
        "confirmed": true
      },
      {
        "number": 27154,
        "confirmed": true
      },
      {
        "number": 27155,
        "confirmed": false
      },
      {
        "number": 27156,
        "confirmed": false
      },
      {
        "number": 27157,
        "confirmed": false
      },
      {
        "number": 27158,
        "confirmed": false
      },
      {
        "number": 27159,
        "confirmed": false
      },
      {
        "number": 27160,
        "confirmed": false
      },
      {
        "number": 27161,
        "confirmed": false
      },
      {
        "number": 27162,
        "confirmed": false
      },
      {
        "number": 27163,
        "confirmed": false
      },
      {
        "number": 27164,
        "confirmed": false
      },
      {
        "number": 27165,
        "confirmed": false
      },
      {
        "number": 27166,
        "confirmed": false
      },
      {
        "number": 27167,
        "confirmed": false
      }
    ],
  }
};