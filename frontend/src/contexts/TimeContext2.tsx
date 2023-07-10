import { createContext } from 'react';

interface TimeContextType {
  currentUnixTime: number;
}

const initialContext: TimeContextType = {
  currentUnixTime: 0
};

export const TimeContext = createContext<TimeContextType>(initialContext);