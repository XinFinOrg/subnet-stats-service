export interface BlocksResponse {
  blocks: BlockResponse[];
  latestMinedBlock: BaseBlockResponse | {};
  latestSubnetCommittedBlock: BaseBlockResponse | {};
  latestParentChainCommittedBlock: BaseBlockResponse | {};
  chainHealth: 'UP' | 'DOWN';
}

export interface BlockResponse extends BaseBlockResponse {
  parentHash: string;
  committedInSubnet: boolean;
  committedInParentChain: boolean;
}

export interface BaseBlockResponse {
  hash: string;
  number: number;
}
