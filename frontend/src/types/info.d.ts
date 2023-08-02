export type Info = Partial<Record<InfoNames, InfoItem | undefined>>;

interface InfoItem {
  data?: InfoItem.Data[];
  health?: InfoListHealth;
}

namespace InfoItem {
  export interface Data {
    name: string;
    value?: string | number;
  }
}

export type InfoListHealth = 'Normal' | 'Abnormal';

export type InfoNames = 'masterNodes' | 'relayer' | 'network' | 'parentChain' | 'transaction' | 'subnetBlock' | 'subnet';