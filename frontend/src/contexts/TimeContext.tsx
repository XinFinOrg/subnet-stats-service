import { createContext, PropsWithChildren, useEffect, useState } from 'react';

import { getUnixTime, pollingPeriod } from '@/utils/time';

interface TimeContextType {
  currentUnixTime: number;
}

const initialContext: TimeContextType = {
  currentUnixTime: 0
};

export const TimeContext = createContext<TimeContextType>(initialContext);

type TimeContextProviderProps = PropsWithChildren;

export default function TimeContextProvider({ children }: TimeContextProviderProps) {
  const [currentUnixTime, setCurrentUnixTime] = useState(getUnixTime());

  useEffect(() => {
    /**
     * The following code runs timer only when tab is active
     */
    // let intervalId: number;

    // window.addEventListener('focus', () => {
    //   intervalId = setInterval(() => {
    //     setCurrentUnixTime(getUnixTime());
    //   }, pollingPeriod);
    // });

    // window.addEventListener('blur', () => {
    //   clearInterval(intervalId);
    // });
    const intervalId = setInterval(() => {
      setCurrentUnixTime(getUnixTime());
    }, pollingPeriod);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <TimeContext.Provider value={{ currentUnixTime }}>
      {children}
    </TimeContext.Provider>
  );
}