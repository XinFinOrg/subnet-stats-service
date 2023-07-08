export interface Info {
  [x: string]: {
    data?: Info.Data[];
    health?: InfoListHealth;
  };
}

namespace Info {
  interface Data {
    name: string;
    value: string | number;
  }
}

export type InfoListHealth = 'Normal' | 'Abnormal';
