export interface BlocksResponse {
  blocks: BlockResponse[];
  latestMinedBlock: BaseBlockResponse | {};
  latestSubnetCommittedBlock: BaseBlockResponse | {};
  latestParentChainCommittedBlock: BaseBlockResponse | {};
  health: {
    status: 'UP' | 'DOWN';
  };
}

export interface BlockResponse extends BaseBlockResponse {
  miner: string;
  parentHash: string;
  committedInSubnet: boolean;
  committedInParentChain: boolean;
}

export interface BaseBlockResponse {
  hash: string;
  number: number;
}
