import { Form, Formik, FormikContextType } from "formik";
import { useContext, useRef, useState } from "react";
import * as Yup from "yup";
import WriteButtion from "@/components/WriteButton";
import Button from "@/components/button/Button";
import {
  DialogButtons,
  DialogResultBase,
  DialogTitle,
} from "@/components/dialog/Dialog";
import { DialogFormField } from "@/components/form-field/FormField";
import InfoList from "@/components/info-list/InfoList";
import { ServiceContext } from "@/contexts/ServiceContext";
import {
  setMasterNodeDialogFailResult,
  setMasterNodeDialogSuccessResult,
} from "@/pages/management-master-committee-page/utils/helper";

import type { InfoListInfo } from "@/types/info";
import { useAccount, useBalance, useContractReads } from "wagmi";
import ABI from "../../../../abi/ABI.json";
import { CONTRACT_ADDRESS } from "@/constants/config";
import { parseEther, parseUnits } from "viem";
interface AddMasterNodeDialogProps {
  closeDialog: () => void;
  setDialogResult?: React.Dispatch<
    React.SetStateAction<DialogResultBase | undefined>
  >;
}

export default function AddMasterNodeDialog(props: AddMasterNodeDialogProps) {
  const { closeDialog, setDialogResult } = props;
  const service = useContext(ServiceContext);

  const formikRef = useRef<FormikContextType<FormValues>>(null);

  const validationSchema = Yup.object().shape({
    newAddress: Yup.string()
      .required("Address is required")
      .matches(
        /^xdc[a-f0-9]{40}$/,
        "Address should start with 'xdc' followed by 40 characters(lower case letter/number)"
      ),
    delegation: Yup.number()
      .required("Delegation is required and must be a number")
      .positive("The value must be greater than 0"),
  });

  async function handleSubmit() {
    if (!setDialogResult || !service || !formikRef.current) {
      return;
    }

    try {
      await service.addNewMasterNode(formikRef.current.values.newAddress);

      setMasterNodeDialogSuccessResult(setDialogResult);

      formikRef.current?.resetForm();
    } catch (error) {
      setMasterNodeDialogFailResult(setDialogResult, error);
    }
  }

  interface FormValues {
    newAddress: string;
    delegation: string;
  }

  const initialValues: FormValues = {
    newAddress: "",
    delegation: "",
  };

  const { address } = useAccount();
  const { data: balance } = useBalance({ address: address });

  const masternodeInfo: InfoListInfo = {
    data: [
      {
        name: "Grandmaster's remaining balance:",
        value: (balance?.formatted as any) / 1,
      },
    ],
  };

  const [rdata, setRdata] = useState({});

  const addMaster = {
    buttonName: "Proceed to wallet confirmation",
    disabled: !(
      (rdata as any)["proposeAddress"] && (rdata as any)["proposeValue"]
    ),
    data: {
      address: CONTRACT_ADDRESS,
      abi: ABI as any,
      functionName: "propose",
      args: [(rdata as any)["proposeAddress"]],
      value: parseEther((rdata as any)["proposeValue"] || "0"),
    },
  };

  return (
    <>
      <DialogTitle title="Add a new master node candidate" />
      <div className="pt-6">
        <InfoList info={masternodeInfo} noIcon valueClassName="text-lg" />
      </div>
      <input
        type="text"
        placeholder="New master node address:"
        className="input w-full max-w-xs my-2"
        onChange={(e: any) => {
          (rdata as any)["proposeAddress"] = e.target.value;
          setRdata({ ...rdata });
        }}
      />
      <input
        type="number"
        placeholder="How much to delegate:"
        className="input w-full max-w-xs my-2"
        onChange={(e: any) => {
          (rdata as any)["proposeValue"] = e.target.value;
          setRdata({ ...rdata });
        }}
      />
      {/* <DialogFormField
              labelText="New master node address:"
              name="newAddress"
              className="pt-6"
              isError={!!(errors.newAddress && touched.newAddress)}
            />

            <DialogFormField
              labelText="How much to delegate:"
              valueSuffix="xdc"
              name="delegation"
              type="number"
              className="pt-6"
              isError={!!(errors.delegation && touched.delegation)}
            /> */}

      <div className="flex gap-2 mt-2">
        <WriteButtion {...addMaster} />
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
              omitSeparator
              isSubmitting={isSubmitting}
              onClose={closeDialog}
              submitText="Proceed to wallet confirmation"
            /> */}
    </>
  );
}
