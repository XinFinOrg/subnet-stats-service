export enum MasternodeRole {
  CANDIDATE = 'CANDIDATE',
  MASTERNODE = 'MASTERNODE',
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
