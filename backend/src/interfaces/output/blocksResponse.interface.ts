export interface BlocksResponse {
  blocks: BlockResponse[];
  subnet: {
    latestMinedBlock?: BaseBlockResponse | {};
    latestCommittedBlock?: BaseBlockResponse | {};
  };
  checkpoint: {
    latestCommittedSubnetBlock: BaseBlockResponse;
    latestSubmittedSubnetBlock: BaseBlockResponse;
  };
  health: {
    status: 'UP' | 'DOWN';
  };
}

export interface BlockResponse extends BaseBlockResponse {
  miner: string;
  parentHash: string;
  committedInSubnet: boolean;
  committedInParentChain: boolean;
  submittedInParentChain: boolean;
}

export interface BaseBlockResponse {
  hash: string;
  number: number;
}
