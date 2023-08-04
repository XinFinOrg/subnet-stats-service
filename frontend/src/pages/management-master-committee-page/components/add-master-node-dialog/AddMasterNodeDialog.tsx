import { Form, Formik, FormikContextType } from 'formik';
import { useContext, useRef } from 'react';
import * as Yup from 'yup';

import { DialogButtons, DialogResultBase, DialogTitle } from '@/components/dialog/Dialog';
import { DialogFormField } from '@/components/form-field/FormField';
import { ServiceContext } from '@/contexts/ServiceContext';
import { setMasterNodeDialogResult } from '@/pages/management-master-committee-page/utils/helper';

interface AddMasterNodeDialogProps {
  closeDialog: () => void;
  setDialogResult?: React.Dispatch<React.SetStateAction<DialogResultBase | undefined>>;
}

export default function AddMasterNodeDialog(props: AddMasterNodeDialogProps) {
  const { closeDialog, setDialogResult } = props;
  const service = useContext(ServiceContext);

  const formikRef = useRef<FormikContextType<FormValues>>(null);

  const validationSchema = Yup.object().shape({
    newAddress: Yup.string().required('Please make sure there is an online full node with this address'),
    delegation: Yup.number().required('Delegation is required and must be a number').positive('The value must be greater than 0'),
  });

  async function handleSubmit() {
    if (!setDialogResult || !service || !formikRef.current) {
      return;
    }

    const result = await service.addNewMasterNode(formikRef.current.values.newAddress);

    setMasterNodeDialogResult(result, setDialogResult);

    formikRef.current?.resetForm();
  }

  interface FormValues {
    newAddress: string,
    delegation: string;
  }

  const initialValues: FormValues = {
    newAddress: '',
    delegation: ''
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
            <DialogTitle className='text-xl' title='Add a new master node candidate' />
            <DialogFormField labelText='New master node address' name='newAddress' className='pt-6' isError={!!(errors.newAddress && touched.newAddress)} />
            <DialogFormField labelText='How much to delegate' valueSuffix='xdc' name='delegation' type='number' className='pt-6' isError={!!(errors.delegation && touched.delegation)} />
            <DialogButtons
              omitSeparator
              isSubmitting={isSubmitting}
              onClose={closeDialog}
              submitText='Yes, proceed to wallet confirmation'
            />
          </Form>
        )}
      </Formik>
    </>
  );
}