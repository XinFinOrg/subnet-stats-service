import { useContext, useState } from 'react';

import { DialogButtons, DialogResultBase, DialogTitle } from '@/components/dialog/Dialog';
import { ServiceContext } from '@/contexts/ServiceContext';
import { setMasterNodeDialogResult } from '@/pages/management-master-committee-page/utils/helper';
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

    setIsSubmitting(true);

    const result = await service.removeMasterNode(address);

    setIsSubmitting(false);
    setMasterNodeDialogResult(result, setDialogResult);
  }

  return (
    <>
      <DialogTitle className='text-xl' title={`Are you about to completely remove address ${formatHash(address)} from the master list?`} />
      <div className='pt-6'>
        <p>A remove transaction will be generated for your approval. You can add this address back anytime using the add a new master node function.</p>
      </div>
      <DialogButtons isSubmitting={isSubmitting} onClose={closeDialog} onSubmit={handleSubmit} submitText='Proceed to wallet confirmation' />
    </>
  );
}