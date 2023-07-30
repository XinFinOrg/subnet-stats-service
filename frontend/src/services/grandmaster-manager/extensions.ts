import Web3 from 'web3';

export interface Web3WithExtension extends Web3 {
  xdcSubnet: {
    getCandidates: (epochNum: "latest") => Promise<{
      candidates: {
        [key: string]: {
          capacity: number;
          status: 'MASTERNODE' | 'PROPOSED' | 'SLASHED'
        }
      };
      epoch: number;
      success: boolean;
    }>
  };
}

export const networkExtensions = (extensionName = 'xdcSubnet') => {
  return {
    property: extensionName,
    methods: [
      {
        name: 'getCandidates',
        params: 1,
        call: 'eth_getCandidates',
      }
    ],
  };
};
