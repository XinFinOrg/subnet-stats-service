import { DialogButtons } from '@/components/dialog/Dialog';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  component: DialogButtons,
  title: 'Components/Dialog/Buttons'
};

export default meta;

type Story = StoryObj<typeof DialogButtons>;

const Template: Story = {
  render: ({ ...args }) => {
    return (
      <div style={{ width: '640px' }}>
        <DialogButtons {...args} />
      </div>
    );
  },
};

export const Standard: Story = {
  ...Template,
  args: {
    omitSeparator: true,
    isSubmitting: false,
    submitText: 'Proceed to wallet confirmation',
  }
};

export const Loading: Story = {
  ...Template,
  args: {
    omitSeparator: true,
    isSubmitting: true,
    submitText: 'Proceed to wallet confirmation'
  }
};
