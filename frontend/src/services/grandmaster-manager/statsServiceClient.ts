import axios from 'axios';
import { baseUrl } from '@/constants/urls';

export type CandidateDetailsStatus = 'MASTERNODE' | 'PROPOSED' | 'SLASHED';

export interface CandidateDetails {
  address: string;
  delegation: number;
  status: CandidateDetailsStatus;
}

export class StatsServiceClient {
  async getChainSettingInfo() {
    const { data } = await axios.get<{ rpcUrl: string, denom: string, networkName: string}>(`${baseUrl}/information/chainsetting`);
    return {
      ...data,
      chainId: 8230
    };
  }
  
  async getCandidates() {
    const { data } = await axios.get<CandidateDetails[]>(`${baseUrl}/information/candidates`);
    return data;
  }
}