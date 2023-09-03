import { Form, Formik, FormikContextType } from "formik";
import { useEffect, useRef } from "react";
import * as Yup from "yup";
import { useContractWrite } from "wagmi";
import {
  DialogButtons,
  DialogResultBase,
  DialogTitle,
} from "@/components/dialog/Dialog";
import { DialogFormField } from "@/components/form-field/FormField";
import InfoList from "@/components/info-list/InfoList";
import {
  setMasterNodeDialogFailResult,
  setMasterNodeDialogSuccessResult,
} from "@/pages/management-master-committee-page/utils/helper";

import type { InfoListInfo } from "@/types/info";
import { useBalance, useContractReads } from "wagmi";
import ABI from "../../../../abi/ABI.json";
import { CONTRACT_ADDRESS } from "@/constants/config";
import { parseEther } from "viem";
interface AddMasterNodeDialogProps {
  closeDialog: () => void;
  setDialogResult?: React.Dispatch<
    React.SetStateAction<DialogResultBase | undefined>
  >;
}

export default function AddMasterNodeDialog(props: AddMasterNodeDialogProps) {
  const { closeDialog, setDialogResult } = props;
  const formikRef = useRef<FormikContextType<FormValues>>(null);

  const validationSchema = Yup.object().shape({
    newAddress: Yup.string()
      .required("Address is required")
      .matches(
        /^(xdc|0x)[a-fA-F0-9]{40}$/,
        "Address should start with 'xdc' or '0x' followed by 40 characters"
      ),
    delegation: Yup.number()
      .required("Delegation is required and must be a number")
      .positive("The value must be greater than 0"),
  });
  
  const addNewMasternodeCall = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: ABI as any,
    functionName: "propose",
  })
  
  useEffect(() => {
    if (setDialogResult) {
      if (addNewMasternodeCall.isError) {
        setMasterNodeDialogFailResult(setDialogResult, addNewMasternodeCall.error);
      } else if (addNewMasternodeCall.isSuccess) {
        setMasterNodeDialogSuccessResult(setDialogResult);
      }
    }
  })

  async function handleSubmit() {
    if (!formikRef.current) {
      return;
    }
    
    addNewMasternodeCall.write({
      args: [formikRef.current.values.newAddress.toLocaleLowerCase().replace(/^xdc/, "0x")],
      value: parseEther(formikRef.current.values.delegation.toString()),
    })
    formikRef.current?.resetForm();
  }

  interface FormValues {
    newAddress: string;
    delegation: string;
  }

  const initialValues: FormValues = {
    newAddress: "",
    delegation: "",
  };

  const { data: readData0 } = useContractReads({
    contracts: [
      {
        address: CONTRACT_ADDRESS,
        abi: ABI as any,
        functionName: "getGrandMasters",
      },
    ],
  });
  const grandmMasters = readData0?.[0]?.["result"] as any;

  const { data: balance } = useBalance({ address: grandmMasters?.[0] });

  const masternodeInfo: InfoListInfo = {
    data: [
      {
        name: "Grandmaster's remaining balance:",
        value: (balance?.formatted as any) / 1+" xdc",
      },
    ],
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        innerRef={formikRef}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <DialogTitle title='Add a new master node candidate' />
            <div className='pt-6'>
              <InfoList info={masternodeInfo} noIcon valueClassName='text-lg' />
            </div>
            <DialogFormField labelText='New master node address:' name='newAddress' className='pt-6' isError={!!(errors.newAddress && touched.newAddress)} />
            <DialogFormField labelText='How much to delegate:' valueSuffix='xdc' name='delegation' type='number' className='pt-6' isError={!!(errors.delegation && touched.delegation)} />
            <DialogButtons
              omitSeparator
              isSubmitting={isSubmitting}
              onClose={closeDialog}
              submitText='Proceed to wallet confirmation'
            />
          </Form>
        )}
      </Formik>
    </>
  );
}
