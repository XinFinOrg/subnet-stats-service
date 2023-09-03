import { useEffect, useState } from "react";
import { useContractWrite } from "wagmi";
import {
  DialogButtons,
  DialogResultBase,
  DialogTitle,
} from "@/components/dialog/Dialog";
import {
  setMasterNodeDialogFailResult,
  setMasterNodeDialogSuccessResult,
} from "@/pages/management-master-committee-page/utils/helper";
import { formatHash } from "@/utils/formatter";
import { CONTRACT_ADDRESS } from "@/constants/config";
import ABI from "../../../../abi/ABI.json";

interface RemoveMasterNodeDialogProps {
  address: string;
  closeDialog: () => void;
  setDialogResult?: React.Dispatch<
    React.SetStateAction<DialogResultBase | undefined>
  >;
}

export default function RemoveMasterNodeDialog(
  props: RemoveMasterNodeDialogProps
) {
  const { address, closeDialog, setDialogResult } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const resignCall = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI as any,
    functionName: "resign",
  })
  
  useEffect(() => {
    if (setDialogResult) {
      if (resignCall.error) {
        setMasterNodeDialogFailResult(setDialogResult, resignCall.error);
      } else if (resignCall.isSuccess) {
        setMasterNodeDialogSuccessResult(setDialogResult);
      }
    }  
  })
  
  async function handleSubmit() {
    setIsSubmitting(true);
    resignCall.write({
      args: [address.replace(/^xdc/, "0x")]
    });
    setIsSubmitting(false);
  }
  
  return (
    <>
      <DialogTitle
        className="text-xl"
        title={`Are you sure you want to completely remove address ${formatHash(
          address
        )} from the master list?`}
      />
      <div className="pt-6">
        <p>
          A remove transaction will be generated for your approval. You can add
          this address back anytime using the
          <span className="font-bold"> add a new master node</span> function.
        </p>
      </div>
      <DialogButtons
        isSubmitting={isSubmitting}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        submitText="Proceed to wallet confirmation"
      />
    </>
  );
}
