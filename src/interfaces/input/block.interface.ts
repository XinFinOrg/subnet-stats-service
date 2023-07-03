export interface BlockEventData {
  id: number;
  latestCommittedBlockInfo?: LatestCommittedBlockInfoData;
  block: BlockInfo;
}

export interface LatestCommittedBlockInfoData {
  number: number;
  hash: string;
  round: number;
}

export interface BlockInfo {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  miner: string;
  gasUsed: number;
  gasLimit: number;
  transactions: string[];
  // There are many other fields, but we don't use them. hence ignored for now
}
