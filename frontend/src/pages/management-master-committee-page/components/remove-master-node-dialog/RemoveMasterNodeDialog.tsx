import { useContext, useState } from "react";
import WriteButtion from "@/components/WriteButton";
import Button from "@/components/button/Button";
import {
  DialogButtons,
  DialogResultBase,
  DialogTitle,
} from "@/components/dialog/Dialog";
import { ServiceContext } from "@/contexts/ServiceContext";
import {
  setMasterNodeDialogFailResult,
  setMasterNodeDialogSuccessResult,
} from "@/pages/management-master-committee-page/utils/helper";
import { formatHash } from "@/utils/formatter";
import { CONTRACT_ADDRESS } from "@/constants/config";
import ABI from "../../../../abi/ABI.json";
import { parseEther } from "viem";

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
  const [rdata, setRdata] = useState({});

  console.log(address);

  (rdata as any)["removeAddress"] = address;

  const removeMaster = {
    buttonName: "Proceed to wallet confirmation",
    disabled: !(rdata as any)["removeAddress"],
    data: {
      address: CONTRACT_ADDRESS,
      abi: ABI as any,
      functionName: "resign",
      args: [(rdata as any)["removeAddress"]?.replace(/^xdc/, "0x")],
    },
  };

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
      <div className="flex gap-2 mt-2">
        <WriteButtion {...removeMaster} />
        <Button
          onClick={closeDialog}
          className="font-extrabold px-4 py-2.5 flex-1"
          variant="contained"
          colour="primary"
        >
          {"Cancel"}
        </Button>
      </div>
      {/* <DialogButtons
        isSubmitting={isSubmitting}
        onClose={closeDialog}
        onSubmit={handleSubmit}
        submitText="Proceed to wallet confirmation"
      /> */}
    </>
  );
}
