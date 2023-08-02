import React, { forwardRef, useImperativeHandle, useRef } from 'react';

import Button from '@/components/button/Button';

export interface DialogRef {
  open: () => void;
  close: () => void;
}

interface DialogProps {
  content: React.ReactNode;
  result?: DialogResultBase;
  setDialogResult?: React.Dispatch<React.SetStateAction<DialogResultBase | undefined>>;
}

const Dialog = forwardRef<DialogRef, DialogProps>((props, ref) => {
  const { content, result, setDialogResult } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);
  let closeDialogTimer: number;

  // Expose the 'open' and 'close' methods of the dialog to the parent component
  useImperativeHandle(ref, () => ({
    open: handleOpenDialog,
    close: handleCloseDialog
  }));

  if (result && setDialogResult) {
    // Close dialog in 3s when it has result
    closeDialogTimer = window.setTimeout(() => {
      handleCloseDialog();
      setDialogResult(undefined);
    }, 3000);
  }

  const borderClass = getBorderColourClass(result?.type);

  function getBorderColourClass(type?: DialogResultType) {
    if (!type) {
      return '';
    }

    let colourClass = '';

    switch (type) {
      case 'success':
        colourClass = 'border-attention';
        break;

      case 'fail':
        colourClass = 'border-error';
        break;

      default:
        return '';
    }

    return `border ${colourClass}`;
  }

  function handleOpenDialog() {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
  }

  function handleCloseDialog() {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  }

  function handleClick(e: React.MouseEvent<HTMLDialogElement, MouseEvent>) {
    const dialog = e.currentTarget;
    const dialogDimensions = dialog.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      dialog.close();

      if (result && setDialogResult) {
        setDialogResult(undefined);
        if (closeDialogTimer) {
          window.clearTimeout(closeDialogTimer);
        }
      }
    }
  }

  return (
    <dialog
      // TODO: RWD width
      className={`
      ${borderClass}
      text-text-dark bg-white
      dark:text-text-white dark:bg-black
        z-10 rounded-3xl py-6 px-5 backdrop:bg-black/15
        w-[640px]
      `}
      ref={dialogRef}
      onClick={handleClick}
    >
      {result ? <DialogResultContent text={result.text} /> : content}
      {/* TODO: actions */}
    </dialog>
  );
});

interface DialogTitleProps {
  title: string;
}

export function DialogTitle({ title }: DialogTitleProps) {
  return (
    <div className='h-[62px] flex items-center'>
      <h1 className='text-2xl font-medium leading-tight'>{title}</h1>
    </div>
  );
}

interface DialogButtonsProps {
  onClose: () => void;
  onSubmit: () => void;
  submitText?: string;
  cancelText?: string;
}

export function DialogButtons({ submitText, cancelText, onClose, onSubmit }: DialogButtonsProps) {
  return (
    <div className='flex gap-2.5 pt-6'>
      <Button onClick={onSubmit} className='font-extrabold px-4 flex-1' variant='outlined' colour='primary'>
        {submitText ?? 'Submit'}
      </Button>
      <Button onClick={onClose} className='font-extrabold px-4 flex-1' variant='contained' colour='primary'>
        {cancelText ?? 'Cancel'}
      </Button>
    </div>
  );
}

interface DialogResultContentProps {
  text: string;
}

export interface DialogResultBase {
  type: DialogResultType;
  text: string;
}

export type DialogResultType = 'success' | 'fail';

export function DialogResultContent({ text }: DialogResultContentProps) {
  return (
    <p className='px-5 py-6 text-justify'>{text}</p>
  );
}

export default Dialog;