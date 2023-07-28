import { createContext, PropsWithChildren, useEffect, useState } from 'react';

interface AlertContextType {
  show: boolean;
  alertText: string;
  showAlert: (text: string) => void;
  hideAlert: () => void;
}

export const AlertContext = createContext<AlertContextType>({
  show: false,
  alertText: '',
  showAlert: () => {
    // empty function
  },
  hideAlert: () => {
    // empty function
  }
});

type AlertProviderProps = PropsWithChildren;

export default function AlertProvider({ children }: AlertProviderProps) {
  const [show, setShow] = useState(false);
  const [alertText, setAlertText] = useState('');

  function showAlert(text: string) {
    setAlertText(text);
    setShow(true);
  }

  function hideAlert() {
    setAlertText('');
    setShow(false);
  }

  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        setShow(false);
      }, 2 * 1000);

      return () => clearTimeout(timeout);
    }
  }, [show]);

  return (
    <AlertContext.Provider value={{ show, alertText, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  );
}
