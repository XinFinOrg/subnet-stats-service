import { twMerge } from 'tailwind-merge';

import { SearchResult } from '@/types/searchResult';

interface ConfirmationStatusProps {
  subnetStatus: boolean;
  parentChainStatus: boolean;
  inputType: SearchResult.InputType;
  className?: string;
}

export default function ConfirmationStatus({ className, inputType, subnetStatus, parentChainStatus }: ConfirmationStatusProps) {
  function getInputTypeText(inputType: SearchResult.InputType) {
    switch (inputType) {
      case 'BLOCK_HASH':
      case 'BLOCK_HEIGHT':
        return 'Subnet box';
      case 'TRANSACTION_HASH':
        return 'Subnet tx';
      default:
        return 'Unknown';
    }
  }

  return (
    <div className={twMerge(className, '')}>
      <ConfirmationItem name='Result Type' text={getInputTypeText(inputType)} />
      <h2 className='text-2xl py-4 font-extrabold leading-tight dark:text-white'>Confirmation Status</h2>
      <ConfirmationStatusItem name='@SubNet' status={subnetStatus} />
      <ConfirmationStatusItem className='pt-2.5' name='@Parent Chain' status={parentChainStatus} />
    </div>
  );
}

interface ConfirmationStatusItemProps extends ConfirmationBaseItem {
  status: boolean;
}

function ConfirmationStatusItem(props: ConfirmationStatusItemProps) {
  function getStatusText(status: boolean) {
    return status ? 'Yes' : 'No';
  }

  const { status, ...remainingProps } = props;


  const text = getStatusText(status);

  return (
    <ConfirmationItem text={text} {...remainingProps} isWarningStatus={!status} />
  );
}

interface ConfirmationBaseItem {
  name: string;
  className?: string;
}

interface ConfirmationItemProps extends ConfirmationBaseItem {
  text: string;
  isWarningStatus?: boolean;
}

function ConfirmationItem({ className, name, text, isWarningStatus }: ConfirmationItemProps) {
  function getStatusClassName(isWarningStatus?: boolean) {
    if (isWarningStatus) {
      return 'bg-warning text-warning';
    }

    return 'bg-sky-500 text-sky-500';
  }

  return (
    <div className={twMerge(className, '')}>
      <span className='inline-block w-[120px]'>{name}</span>
      <span className={`
        ${getStatusClassName(isWarningStatus)}
        font-semibold leading-tight bg-opacity-20 rounded-lg px-[5px] py-[3px]`
      }>
        {text}
      </span>
    </div>
  );
}
