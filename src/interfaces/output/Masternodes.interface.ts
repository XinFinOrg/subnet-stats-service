export enum MasternodeRole {
  STANDBY = 'STANDBY',
  MINER = 'MINER',
  PENALTY = 'PENALTY',
}

export interface Masternode {
  address: string;
  role: MasternodeRole;
}

export interface MasternodeInfoResponse {
  summary: {
    committee: number;
    activeNodes: number;
    inActiveNodes: number;
  };
  nodes: Masternode[];
}
