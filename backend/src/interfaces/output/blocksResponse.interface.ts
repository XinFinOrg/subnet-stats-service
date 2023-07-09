export interface BlocksResponse {
  blocks: BlockResponse[];
  latestMinedBlock: BaseBlockResponse | {};
  latestSubnetCommittedBlock: BaseBlockResponse | {};
  latestParentChainCommittedBlock: BaseBlockResponse | {};
  health: healthResponse | {};
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

export interface healthResponse {
  status: string;
}
