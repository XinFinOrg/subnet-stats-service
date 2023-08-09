import type { Meta, StoryObj } from '@storybook/react';
import Button from '@/components/button/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    colour: 'primary',
    children: 'Button'
  }
};

export const Secondary: Story = {
  args: {
    ...Primary.args,
    colour: 'secondary'
  }
};

export const OutlineSuccess: Story = {
  args: {
    ...Primary.args,
    colour: 'success',
    children: 'Button',
    variant: 'outlined',
    className: 'font-extrabold px-4 py-2.5 flex-1 flex items-center justify-center'
  }
};

export const OutlineWarning: Story = {
  args: {
    ...OutlineSuccess.args,
    colour: 'warning',
  }
};

export const OutlineDanger: Story = {
  args: {
    ...OutlineSuccess.args,
    colour: 'danger',
  }
};

export const OutlinePrimary: Story = {
  args: {
    ...OutlineSuccess.args,
    colour: 'primary',
  }
};