import { Form, Formik, FormikContextType } from 'formik';
import { useContext, useRef } from 'react';
import * as Yup from 'yup';

import { DialogButtons, DialogResultBase, DialogTitle } from '@/components/dialog/Dialog';
import { DialogFormField } from '@/components/form-field/FormField';
import InfoList from '@/components/info-list/InfoList';
import { ServiceContext } from '@/contexts/ServiceContext';
import {
  setMasterNodeDialogFailResult, setMasterNodeDialogSuccessResult
} from '@/pages/management-master-committee-page/utils/helper';

import type { InfoListInfo } from '@/types/info';
interface AddMasterNodeDialogProps {
  closeDialog: () => void;
  setDialogResult?: React.Dispatch<React.SetStateAction<DialogResultBase | undefined>>;
}

export default function AddMasterNodeDialog(props: AddMasterNodeDialogProps) {
  const { closeDialog, setDialogResult } = props;
  const service = useContext(ServiceContext);

  const formikRef = useRef<FormikContextType<FormValues>>(null);

  const validationSchema = Yup.object().shape({
    newAddress: Yup.string()
      .required('Address is required')
      .matches(/^xdc[a-f0-9]{40}$/, 'Address should start with \'xdc\' followed by 40 characters(lower case letter/number)'),
    delegation: Yup.number()
      .required('Delegation is required and must be a number')
      .positive('The value must be greater than 0'),
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
    newAddress: string,
    delegation: string;
  }

  const initialValues: FormValues = {
    newAddress: '',
    delegation: ''
  };

  const masternodeInfo: InfoListInfo = {
    data: [{
      name: 'Grandmaster\'s remaining balance:',
      value: 'unknown'
    }]
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