import { createContext, PropsWithChildren } from 'react';

export const ServiceContext = createContext<null>(null);


export default function ServiceContextProvider({ children }: PropsWithChildren) {
  return (
    <ServiceContext.Provider value={null}>
      {children}
    </ServiceContext.Provider>
  );
}