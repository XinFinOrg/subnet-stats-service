import { Link } from 'react-router-dom';

import Button from '@/components/button/Button';
import { DialogTitle } from '@/components/dialog/Dialog';

interface NoLoginDialogProps {
  closeDialog: () => void;
}

export function NoLoginDialog({ closeDialog }: NoLoginDialogProps) {
  return (
    <>
      <DialogTitle title='Login required' />
      <div className='text-center'>
        <p>
          Requires login before amending candidate
        </p>
        <p className='pt-1.5'>
          Please find instructions in
          <Link className='dark:bg-primary bg-primary rounded-3xl px-2 py-[2px] mx-1 whitespace-nowrap text-white' to='/managementLogin'>
            Login page
          </Link>
        </p>
        <div className='pt-6 border-b border-text-dark-400/50' />
        <div className='flex justify-end gap-2.5 pt-6'>
          <Button onClick={closeDialog} className='font-extrabold px-4 py-2.5' variant='contained' colour='primary'>
            Cancel
          </Button>
        </div>
      </div>
    </>
  );
}