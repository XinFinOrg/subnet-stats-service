import { Form, Formik, FormikContextType, useFormikContext } from "formik";
import { useContext, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import * as Yup from "yup";
import WriteButtion from "@/components/WriteButton";
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
import { CandidateDetails } from "@/services/grandmaster-manager/statsServiceClient";
import { formatHash } from "@/utils/formatter";
import Button from "@/components/button/Button";
import type { ManagementLoaderData } from "@/types/loaderData";
import { CONTRACT_ADDRESS } from "@/constants/config";
import ABI from "../../../../abi/ABI.json";
import { useAccount, useBalance } from "wagmi";
import { parseEther } from "viem";

interface PromoteDialogProps {
  type: PromoteDialogType;
  data: CandidateDetails;
  closeDialog: () => void;
  setDialogResult?: React.Dispatch<
    React.SetStateAction<DialogResultBase | undefined>
  >;
}

interface FormValues {
  increaseDelegation: "" | number;
}

type PromoteDialogType = "promote" | "demote";

export default function PromoteDialog(props: PromoteDialogProps) {
  const { setDialogResult, data, type } = props;

  const { minimumDelegation } = useLoaderData() as ManagementLoaderData;

  const formikRef = useRef<FormikContextType<FormValues>>(null);
  const service = useContext(ServiceContext);

  const initialValues: FormValues = {
    increaseDelegation: "",
  };

  const validationSchema = Yup.object().shape({
    increaseDelegation: Yup.number()
      .required("Increase delegation is required")
      .positive("The value must be greater than 0")
      .min(
        type === "promote" ? minimumDelegation : 0,
        `The value must be greater than minimum delegation ${minimumDelegation}`
      ),
  });

  async function handleSubmit({ increaseDelegation }: FormValues) {
    if (
      !increaseDelegation ||
      Number.isNaN(increaseDelegation) ||
      !setDialogResult ||
      !service ||
      !formikRef.current
    ) {
      return;
    }

    try {
      const delegation = getDelegation(increaseDelegation, type);
      await service.changeVote(data.address, delegation);

      setMasterNodeDialogSuccessResult(setDialogResult);

      formikRef.current.resetForm();
    } catch (error) {
      setMasterNodeDialogFailResult(setDialogResult, error);
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      innerRef={formikRef}
    >
      <Form>
        <FormContent {...props} />
      </Form>
    </Formik>
  );
}

interface UpdatedMasterNodeInfoProps {
  delegation: number;
  formattedAddress: string;
  type: PromoteDialogType;
}

function FormContent(props: PromoteDialogProps) {
  const { type, data, closeDialog } = props;

  const { minimumDelegation, grandmasterRemainingBalance } =
    useLoaderData() as ManagementLoaderData;

  const formik = useFormikContext<FormValues>();

  function getTitle(type: PromoteDialogType) {
    switch (type) {
      case "promote":
        return "Promote via increasing delegation";
      case "demote":
        return "Demote via decreasing delegation";

      default:
        return "";
    }
  }

  function getActionLabel(type: PromoteDialogType) {
    switch (type) {
      case "promote":
        return "Increase delegation by:";
      case "demote":
        return "Decrease delegation by:";

      default:
        return "";
    }
  }

  const title = getTitle(type);
  const actionLabel = getActionLabel(type);

  const { address, delegation } = data;
  const formattedAddress = formatHash(address);

  const { address: masterAddress } = useAccount();
  const { data: balance } = useBalance({ address: masterAddress });

  const initInfo = {
    data: [
      {
        name: "Grandmaster's remaining balance:",
        value: `${(balance?.formatted as any) / 1} xdc`,
      },
      {
        name: `${formattedAddress}'s current delegation:`,
        value: `${delegation} hxdc`,
      },
      {
        name: `${formattedAddress}'s minimum delegation:`,
        value: `${minimumDelegation} hxdc`,
      },
    ],
  };
  ABI;
  const [rdata, setRdata] = useState({});
  (rdata as any)["voteAddress"] = address;

  console.log((rdata as any)["voteAddress"], (rdata as any)["voteValue"]);

  const promote = {
    buttonName: "Proceed to wallet confirmation",
    disabled: !((rdata as any)["voteAddress"] && (rdata as any)["voteValue"]),
    data: {
      address: CONTRACT_ADDRESS,
      abi: ABI as any,
      functionName: "vote",
      args: [(rdata as any)["voteAddress"]?.replace(/^xdc/, "0x")],
      value: parseEther((rdata as any)["voteValue"] || "0"),
    },
  };

  return (
    <>
      <DialogTitle title={title} />

      {/* Dialog content */}
      <div className="pt-6">
        <InfoList info={initInfo} noIcon valueClassName="text-lg" />
      </div>
      <input
        type="number"
        placeholder="increaseDelegation"
        className="input w-full max-w-xs my-2"
        onChange={(e: any) => {
          (rdata as any)["voteValue"] = e.target.value;

          setRdata({ ...rdata });
        }}
      />
      {/* <DialogFormField
        labelText={actionLabel}
        name="increaseDelegation"
        type="number"
        valueSuffix="xdc"
        className="pt-6"
        isError={
          !!(
            formik.errors.increaseDelegation &&
            formik.touched.increaseDelegation
          )
        }
      /> */}
      <PreviewUpdatedMasterNodeInfo
        delegation={delegation}
        formattedAddress={formattedAddress}
        type={type}
      />

      <div className="flex gap-2 mt-2">
        <WriteButtion {...promote} />
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
        isSubmitting={formik.isSubmitting}
        omitSeparator
        submitText="Proceed to wallet confirmation"
        onClose={closeDialog}
      /> */}
    </>
  );
}

function getUpdatedDelegation(
  delegation: number,
  increaseDelegation: number | "",
  type: PromoteDialogType
) {
  if (!increaseDelegation || Number.isNaN(increaseDelegation)) {
    return delegation;
  }

  if (type === "demote") {
    return delegation - increaseDelegation;
  }

  return delegation + increaseDelegation;
}

function getDelegation(increaseDelegation: number, type: PromoteDialogType) {
  if (type === "demote") {
    return -increaseDelegation;
  }

  return increaseDelegation;
}

function PreviewUpdatedMasterNodeInfo({
  delegation,
  formattedAddress,
  type,
}: UpdatedMasterNodeInfoProps) {
  const formikContext = useFormikContext<FormValues>();
  const updatedDelegation = getUpdatedDelegation(
    delegation,
    formikContext.values.increaseDelegation,
    type
  );

  const changedInfo = {
    data: [
      {
        name: `${formattedAddress}'s new delegation:`,
        value: `${updatedDelegation} hxdc`,
      },
    ],
  };

  return (
    <div className="pt-6">
      <InfoList info={changedInfo} noIcon valueClassName="text-lg" />
    </div>
  );
}
