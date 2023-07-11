import { useContext } from 'react';

import { AlertContext } from '@/contexts/AlertContext';

export default function Alert() {
  const { show, alertText } = useContext(AlertContext);

  return show ?
    (
      <div className='px-5 p-3 fixed right-0 left-0 w-[100px] m-auto top-5 dark:bg-primary bg-slate-200 rounded-xl'>
        {alertText}
      </div>
    )
    : null;
}