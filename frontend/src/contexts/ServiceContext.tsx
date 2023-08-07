import { createContext, PropsWithChildren } from 'react';

import { GrandMasterManager } from '@/services/grandmaster-manager';

export const ServiceContext = createContext<GrandMasterManager | null>(null);

const grandMasterManager = new GrandMasterManager();

export default function ServiceContextProvider({ children }: PropsWithChildren) {
  return (
    <ServiceContext.Provider value={grandMasterManager}>
      {children}
    </ServiceContext.Provider>
  );
}