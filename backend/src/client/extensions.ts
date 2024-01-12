import Web3 from 'web3';

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
  Miner: string;
  Timestamp: number;
}

interface MasternodesInfo {
  Number: number;
  Round: number;
  MasternodesLen: number;
  Masternodes: string[];
  PenaltyLen: number;
  Penalty: string[];
}

export interface Candidates {
  candidates: {
    [key in string]: {
      capacity: number;
      status: 'MASTERNODE' | 'PROPOSED' | 'SLASHED';
    };
  };
  success: boolean;
  epoch: number;
}

export interface NetworkInfo {
  NetworkId: number;
  XDCValidatorAddress: string;
  Denom: string;
  NetworkName: string;
}

export interface Web3WithExtension extends Web3 {
  xdcSubnet: {
    getV2Block: (type: 'committed') => Promise<FetchedV2BlockInfo>;
    getV2BlockByNumber: (blockNum: string) => Promise<FetchedV2BlockInfo>;
    getV2BlockByHash: (blockHash: string) => Promise<FetchedV2BlockInfo>;
    getMasternodesByNumber: (blockStatus: BlockStatus) => Promise<MasternodesInfo>;
    getCandidates: (param: 'latest') => Promise<Candidates>;
    getNetworkInfo: () => Promise<NetworkInfo>;
  };
  xdcParentnet: {
    getV2Block: (type: 'committed') => Promise<FetchedV2BlockInfo>;
    getV2BlockByNumber: (blockNum: string) => Promise<FetchedV2BlockInfo>;
    getV2BlockByHash: (blockHash: string) => Promise<FetchedV2BlockInfo>;
    getNetworkInfo: () => Promise<NetworkInfo>;
  }
}

export const subnetExtensions = (extensionName = 'xdcSubnet') => {
  return {
    property: extensionName,
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
      {
        name: 'getCandidates',
        params: 1,
        call: 'eth_getCandidates',
      },
      {
        name: 'getNetworkInfo',
        params: 0,
        call: 'XDPoS_networkInformation',
      },
    ],
  };
};

export const parentnetExtensions = (extensionName = 'xdcParentnet') => {
  return {
    property: extensionName,
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
        name: 'getNetworkInfo',
        params: 0,
        call: 'XDPoS_networkInformation',
      },
    ],
  };
};