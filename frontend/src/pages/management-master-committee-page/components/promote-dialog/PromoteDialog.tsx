import { Form, Formik, FormikContextType, useFormikContext } from 'formik';
import { useRef } from 'react';
import { useLoaderData } from 'react-router-dom';
import * as Yup from 'yup';

import { DialogButtons, DialogResultBase, DialogTitle } from '@/components/dialog/Dialog';
import { DialogFormField } from '@/components/form-field/FormField';
import InfoList from '@/components/info-list/InfoList';
import {
  setMasterNodeDialogFailResult, setMasterNodeDialogSuccessResult
} from '@/pages/management-master-committee-page/utils/helper';
import { CandidateDetails, GrandMasterManager } from '@/services/grandmaster-manager';
import { formatHash } from '@/utils/formatter';

import type { ManagementLoaderData } from '@/types/loaderData';

interface PromoteDialogProps {
  type: PromoteDialogType;
  data: CandidateDetails;
  closeDialog: () => void;
  setDialogResult?: React.Dispatch<React.SetStateAction<DialogResultBase | undefined>>;
}

interface FormValues {
  increaseDelegation: '' | number;
}

type PromoteDialogType = 'promote' | 'demote';

export default function PromoteDialog(props: PromoteDialogProps) {
  const { setDialogResult, data, type } = props;

  const { minimumDelegation } = useLoaderData() as ManagementLoaderData;

  const formikRef = useRef<FormikContextType<FormValues>>(null);

  const initialValues: FormValues = {
    increaseDelegation: ''
  };

  const validationSchema = Yup.object().shape({
    increaseDelegation: Yup.number()
      .required('Increase delegation is required')
      .positive('The value must be greater than 0')
      .min(type === 'promote' ? minimumDelegation : 0, `The value must be greater than minimum delegation ${minimumDelegation}`),
  });

  async function handleSubmit({ increaseDelegation }: FormValues) {
    if (!increaseDelegation || Number.isNaN(increaseDelegation) || !setDialogResult || !formikRef.current) {
      return;
    }

    try {
      const service = new GrandMasterManager();
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

  const { minimumDelegation, grandmasterRemainingBalance } = useLoaderData() as ManagementLoaderData;

  const formik = useFormikContext<FormValues>();

  function getTitle(type: PromoteDialogType) {
    switch (type) {
      case 'promote':
        return 'Promote via increasing delegation';
      case 'demote':
        return 'Demote via decreasing delegation';

      default:
        return '';
    }
  }

  function getActionLabel(type: PromoteDialogType) {
    switch (type) {
      case 'promote':
        return 'Increase delegation by:';
      case 'demote':
        return 'Decrease delegation by:';

      default:
        return '';
    }
  }

  const title = getTitle(type);
  const actionLabel = getActionLabel(type);

  const { address, delegation } = data;
  const formattedAddress = formatHash(address);

  const initInfo = {
    data: [
      { name: 'Grandmaster\'s remaining balance:', value: `${grandmasterRemainingBalance} xdc` },
      { name: `${formattedAddress}'s current delegation:`, value: `${delegation} hxdc` },
      { name: `${formattedAddress}'s minimum delegation:`, value: `${minimumDelegation} hxdc` },
    ]
  };

  return (
    <>
      <DialogTitle title={title} />

      {/* Dialog content */}
      <div className='pt-6'>
        <InfoList info={initInfo} noIcon valueClassName='text-lg' />
      </div>
      <DialogFormField
        labelText={actionLabel}
        name='increaseDelegation'
        type='number'
        valueSuffix='xdc'
        className='pt-6'
        isError={!!(formik.errors.increaseDelegation && formik.touched.increaseDelegation)}
      />
      <PreviewUpdatedMasterNodeInfo delegation={delegation} formattedAddress={formattedAddress} type={type} />

      <DialogButtons isSubmitting={formik.isSubmitting} omitSeparator submitText='Proceed to wallet confirmation' onClose={closeDialog} />
    </>
  );
}

function getUpdatedDelegation(delegation: number, increaseDelegation: number | '', type: PromoteDialogType) {
  if (!increaseDelegation || Number.isNaN(increaseDelegation)) {
    return delegation;
  }

  if (type === 'demote') {
    return delegation - increaseDelegation;
  }

  return delegation + increaseDelegation;
}

function getDelegation(increaseDelegation: number, type: PromoteDialogType) {
  if (type === 'demote') {
    return -increaseDelegation;
  }

  return increaseDelegation;
}

function PreviewUpdatedMasterNodeInfo({ delegation, formattedAddress, type }: UpdatedMasterNodeInfoProps) {
  const formikContext = useFormikContext<FormValues>();
  const updatedDelegation = getUpdatedDelegation(delegation, formikContext.values.increaseDelegation, type);

  const changedInfo = {
    data: [
      { name: `${formattedAddress}'s new delegation:`, value: `${updatedDelegation} hxdc` },
    ]
  };

  return (
    <div className='pt-6'>
      <InfoList info={changedInfo} noIcon valueClassName='text-lg' />
    </div>
  );
}