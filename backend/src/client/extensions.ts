import Web3 from 'web3';
import { formatMasternodesInfo, formatNetworkInfo, formatV2BlockInfo, web3Formatter } from './xdpos';

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

export interface MasternodesInfo {
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
  xdcApi: {
    getV2Block: (type: 'committed') => Promise<FetchedV2BlockInfo>;
    getV2BlockByNumber: (blockNum: string) => Promise<FetchedV2BlockInfo>;
    getV2BlockByHash: (blockHash: string) => Promise<FetchedV2BlockInfo>;
    getMasternodesByNumber: (blockStatus: BlockStatus) => Promise<MasternodesInfo>;
    getCandidates: (param: 'latest') => Promise<Candidates>;
    getNetworkInfo: () => Promise<NetworkInfo>;
  };
}

export const xdcExtensions = (extensionName = 'xdcApi') => {
  return {
    property: extensionName,
    methods: [
      {
        name: 'getV2Block',
        params: 1,
        call: 'XDPoS_getV2BlockByNumber',
        outputFormatter: web3Formatter(formatV2BlockInfo),
      },
      {
        name: 'getV2BlockByNumber',
        params: 1,
        call: 'XDPoS_getV2BlockByNumber',
        outputFormatter: web3Formatter(formatV2BlockInfo),
      },
      {
        name: 'getV2BlockByHash',
        params: 1,
        call: 'XDPoS_getV2BlockByHash',
        outputFormatter: web3Formatter(formatV2BlockInfo),
      },
      {
        name: 'getMasternodesByNumber',
        params: 1,
        call: 'XDPoS_getMasternodesByNumber',
        outputFormatter: web3Formatter(formatMasternodesInfo),
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
        outputFormatter: web3Formatter(formatNetworkInfo),
      },
    ],
  };
};
