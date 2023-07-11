import { twMerge } from 'tailwind-merge';

interface ConfirmationStatusProps {
  subnetStatus: boolean;
  parentChainStatus: boolean;
  className?: string;
}

export default function ConfirmationStatus({ className, subnetStatus, parentChainStatus }: ConfirmationStatusProps) {
  function getStatusText(status: boolean) {
    return status ? 'Yes' : 'No';
  }

  return (
    <div className={twMerge(className, '')}>
      <ConfirmationStatusItem name='Result Type' value='Subnet Box' />
      <h2 className='text-2xl py-4 font-extrabold leading-tight dark:text-white'>Confirmation Status</h2>
      <ConfirmationStatusItem name='@SubNet' value={getStatusText(subnetStatus)} />
      <ConfirmationStatusItem className='pt-2.5' name='@Parent Chain' value={getStatusText(parentChainStatus)} />
    </div>
  );
}

interface ConfirmationStatusItemProps {
  name: string;
  value: string;
  className?: string;
}

function ConfirmationStatusItem(props: ConfirmationStatusItemProps) {
  return (
    <div className={twMerge(props.className, '')}>
      <span className='inline-block w-[120px]'>{props.name}</span>
      <span className='text-primary dark:text-sky-300 font-semibold leading-tight bg-sky-300 bg-opacity-20 rounded-lg px-[5px] py-[3px]'>{props.value}</span>
    </div>
  );
}
