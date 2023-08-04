import { DialogResultBase } from '@/components/dialog/Dialog';
import { TransactionFail, TransactionSuccess } from '@/constants/transactionResult';
import { ManagerError } from '@/services/grandmaster-manager/errors';

export function setMasterNodeDialogResult(result: true | ManagerError, setDialogResult: React.Dispatch<React.SetStateAction<DialogResultBase | undefined>>
) {
  if (result === true) {
    setDialogResult({
      text: TransactionSuccess,
      type: 'success'
    });

    return;
  }

  setDialogResult({
    text: TransactionFail(result.errorType),
    type: 'fail'
  });
}