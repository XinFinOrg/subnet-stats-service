import Web3 from 'web3';

const SUBNET_EXTENSION_NAME = 'xdcSubnet';

export type BlockStatus = 'latest' | 'pending' | 'earliest' | 'committed';

export interface CommittedBlockInfo {
  Hash: string;
  Number: number;
  Round: number;
}

export interface FetchedV2BlockInfo {
  Committed: boolean;
  Hash: string;
  ParentHash: string;
  Number: number;
  Round: number;
  EncodedRLP: string;
  Error: string;
}

interface MasternodesInfo {
  Number: number;
  Round: number;
  MasternodesLen: number;
  Masternodes: string[];
  PenaltyLen: number;
  Penalty: string[];
}

export interface Web3WithExtension extends Web3 {
  xdcSubnet: {
    getV2Block: (type: 'committed') => Promise<FetchedV2BlockInfo>;
    getV2BlockByNumber: (bluckNum: string) => Promise<FetchedV2BlockInfo>;
    getV2BlockByHash: (blockHash: string) => Promise<FetchedV2BlockInfo>;
    getMasternodesByNumber: (blockStatus: BlockStatus) => Promise<MasternodesInfo>;
  };
}

export const subnetExtensions = {
  property: SUBNET_EXTENSION_NAME,
  methods: [
    {
      name: 'getV2Block',
      params: 1,
      call: 'XDPoS_getV2BlockByNumber',
    },
    {
      name: 'getV2BlockByNumber',
      params: 1,
      call: 'XDPoS_getV2BlockByNumber',
    },
    {
      name: 'getV2BlockByHash',
      params: 1,
      call: 'XDPoS_getV2BlockByHash',
    },
    {
      name: 'getMasternodesByNumber',
      params: 1,
      call: 'XDPoS_getMasternodesByNumber',
    },
  ],
};
