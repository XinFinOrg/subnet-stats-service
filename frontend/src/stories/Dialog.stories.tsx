import { useRef, useState } from 'react';

import Button from '@/components/button/Button';
import Dialog, { DialogButtons, DialogRef, DialogTitle } from '@/components/dialog/Dialog';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  component: Dialog,
  title: 'Components/Dialog',
  argTypes: {
    isSubmitting: {
      type: 'boolean',
      defaultValue: false
    }
  }
};

export default meta;

type Story = StoryObj<typeof Dialog>;

function DialogContent({ closeDialog, isSubmitting }: any) {
  return (
    <>
      <DialogTitle title='Dialog title' />
      <>Any contents</>
      <DialogButtons onClose={closeDialog} isSubmitting={isSubmitting} />
    </>
  );
}

function BaseDialog({ ...args }) {
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(null);

  const dialogRef = useRef<DialogRef>(null);

  function openDialog(content: React.ReactNode) {
    setDialogContent(content);
    dialogRef.current?.open();
  }

  function handleCloseDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <Dialog {...args} content={dialogContent} ref={dialogRef} />
      <Button
        colour='primary'
        onClick={() => openDialog(
          <DialogContent
            closeDialog={handleCloseDialog}
            isSubmitting={false}
          />
        )}
      >
        Open dialog
      </Button>
    </>
  );
}

function LoadingDialog({ ...args }) {
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(null);

  const dialogRef = useRef<DialogRef>(null);

  function openDialog(content: React.ReactNode) {
    setDialogContent(content);
    dialogRef.current?.open();
  }

  function handleCloseDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <Dialog {...args} content={dialogContent} ref={dialogRef} />
      <Button
        colour='primary'
        onClick={() => openDialog(
          <DialogContent
            closeDialog={handleCloseDialog}
            isSubmitting
          />
        )}
      >
        Open dialog
      </Button>
    </>
  );
}

export const Basic: Story = {
  render: BaseDialog
};

export const Loading: Story = {
  render: LoadingDialog
};