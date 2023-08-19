import axios from 'axios';
import { baseUrl } from '@/constants/urls';

export type CandidateDetailsStatus = 'MASTERNODE' | 'PROPOSED' | 'SLASHED';

export interface CandidateDetails {
  address: string;
  delegation: number;
  status: CandidateDetailsStatus;
}

export interface ChainSettingInfo {
  rpcUrl: string;
  chainId: number;
  denom: string;
  grandmasterAddress: string;
  minimumDelegation: number;
}


export class StatsServiceClient {
  async getChainSettingInfo() {
    // TODO: To be replaced by proper API call result
    return {
      rpcUrl: "https://devnetstats.apothem.network/subnet",
      denom: "xdc",
      grandmasterAddress: "0xaF41973D6b9EA4ADbD497365a76E6443FFB49fC5",
      chainId: 59467,
      minimumDelegation: 10000
    }
    const { data } = await axios.get<ChainSettingInfo>(`${baseUrl}/information/chainsetting`);
    return data;
  }
  
  async getCandidates() {
    const { data } = await axios.get<CandidateDetails[]>(`${baseUrl}/information/candidates`);
    return data;
  }
}