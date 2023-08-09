import { DialogResultBase } from '@/components/dialog/Dialog';
import { TransactionFail, TransactionSuccess } from '@/constants/transactionResult';
import { ManagerError } from '@/services/grandmaster-manager/errors';

export function setMasterNodeDialogSuccessResult(setDialogResult: React.Dispatch<React.SetStateAction<DialogResultBase | undefined>>
) {
  setDialogResult({
    text: TransactionSuccess,
    type: 'success'
  });
}
export function setMasterNodeDialogFailResult(setDialogResult: React.Dispatch<React.SetStateAction<DialogResultBase | undefined>>, error: unknown) {
  setDialogResult({
    text: TransactionFail((error as ManagerError).errorType),
    type: 'fail'
  });
}