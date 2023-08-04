export type Info = Partial<Record<InfoNames, InfoListInfo | undefined>>;

interface InfoListInfo {
  data?: InfoListInfo.Data[];
  health?: InfoListHealth;
}

export namespace InfoListInfo {
  export interface Data {
    name: string;
    value?: string | number;
  }
}

export type InfoListHealth = 'Normal' | 'Abnormal';

export type InfoNames = 'masterNodes' | 'relayer' | 'network' | 'parentChain' | 'transaction' | 'subnetBlock' | 'subnet';