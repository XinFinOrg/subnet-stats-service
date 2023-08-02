import { useState } from 'react';

import { DialogButtons, DialogResultBase, DialogTitle } from '@/components/dialog/Dialog';
import InfoList from '@/components/info-list/InfoList';
import { formatHash } from '@/utils/formatter';

interface PromoteDialogProps {
  title: string;
  // TODO: any type
  data: any;
  closeDialog: () => void;
  // TODO: any type
  setDialogResult?: React.Dispatch<React.SetStateAction<DialogResultBase | undefined>>;
}

// TODO: use form and form validator
export default function PromoteDialog({ title, data, closeDialog, setDialogResult }: PromoteDialogProps) {
  const [increaseDelegation, setIncreaseDelegation] = useState<'' | number>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { address, delegation } = data;
  const formattedAddress = formatHash(address);

  const initInfo = {
    data: [
      { name: 'Grandmaster\'s remaining balance:', value: `${'123456'} xdc` },
      { name: `${formattedAddress}'s current delegation:`, value: `${delegation} hxdc` },
      { name: `${formattedAddress}'s minimum delegation:`, value: `${'234'} hxdc` },
    ]
  };

  const changedInfo = {
    data: [
      { name: `${formattedAddress}'s new delegation:`, value: `${delegation + (Number.isNaN(increaseDelegation) ? 0 : increaseDelegation)} hxdc` },
    ]
  };

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'e') {
      e.preventDefault();
    }
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const number = parseInt(e.target.value, 10);
    setIsSubmitting(false);

    if (Number.isNaN(number)) {
      setIncreaseDelegation('');
      return;
    }

    setIncreaseDelegation(number);
  }

  function getResultText(result: DialogResultBase) {
    if (result.type === 'success') {
      return 'Transaction submitted. The change will be applied in the next epoch. Please check later.';
    }

    return 'Transaction failed. Error: xxxxxx . Please try again.';
  }

  function handleSubmit() {
    setIsSubmitting(true);

    if (!increaseDelegation) {
      return;
    }

    // TODO: call submit method
    setIncreaseDelegation('');
    setIsSubmitting(false);

    // TODO: on submit method callback, set content to success/fail, and close the dialog after 2s
    const result: DialogResultBase = {
      type: 'success',
      text: '' // TODO
    };

    const resultText = getResultText(result);

    setDialogResult && setDialogResult({
      type: result.type,
      text: resultText
    });
  }

  return (
    <>
      <DialogTitle title={title} />
      <div className='pt-6'>
        <InfoList info={initInfo} noIcon />
      </div>
      <div className='pt-6'>
        <div className={`flex justify-between border-b-2 dark:border-text-dark-400 border-text-white-400`}>
          <div className='flex-1 py-2'>Increase delegation by:</div>
          <div className={`
            flex-1 py-2 text-right bg-bg-white dark:bg-bg-dark-700 border-2 border-b-0
            ${isSubmitting && !increaseDelegation ? 'border-red-500' : 'border-transparent'
            }`}>
            <div className='pr-2 flex'>
              <input
                type='number'
                value={increaseDelegation}
                onKeyDown={onKeyDown}
                onChange={handleNumberChange}
                className={`
                  [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                  flex-1 text-right font-bold text-sm leading-[120%] bg-transparent border-none outline-none
                `}
              />
              <span className='pl-1'>xdc</span>
            </div>
          </div>
        </div>
      </div>
      <div className='pt-6'>
        <InfoList info={changedInfo} noIcon />
      </div>
      <DialogButtons submitText='Proceed to wallet confirmation' onSubmit={handleSubmit} onClose={closeDialog} />
    </>
  );
}