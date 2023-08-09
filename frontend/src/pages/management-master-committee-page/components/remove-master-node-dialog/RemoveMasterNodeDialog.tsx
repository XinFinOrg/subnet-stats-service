import { useContext, useState } from 'react';

import { DialogButtons, DialogResultBase, DialogTitle } from '@/components/dialog/Dialog';
import { ServiceContext } from '@/contexts/ServiceContext';
import {
  setMasterNodeDialogFailResult, setMasterNodeDialogSuccessResult
} from '@/pages/management-master-committee-page/utils/helper';
import { formatHash } from '@/utils/formatter';

interface RemoveMasterNodeDialogProps {
  address: string;
  closeDialog: () => void;
  setDialogResult?: React.Dispatch<React.SetStateAction<DialogResultBase | undefined>>;
}

export default function RemoveMasterNodeDialog(props: RemoveMasterNodeDialogProps) {
  const { address, closeDialog, setDialogResult } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const service = useContext(ServiceContext);

  async function handleSubmit() {
    if (!setDialogResult || !service) {
      return;
    }

    try {
      setIsSubmitting(true);

      await service.removeMasterNode(address);

      setMasterNodeDialogSuccessResult(setDialogResult);
    } catch (error) {
      setMasterNodeDialogFailResult(setDialogResult, error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <DialogTitle className='text-xl' title={`Are you sure you want to completely remove address ${formatHash(address)} from the master list?`} />
      <div className='pt-6'>
        <p>A remove transaction will be generated for your approval. You can add this address back anytime using the
          <span className='font-bold'> add a new master node</span> function.
        </p>
      </div>
      <DialogButtons isSubmitting={isSubmitting} onClose={closeDialog} onSubmit={handleSubmit} submitText='Proceed to wallet confirmation' />
    </>
  );
}