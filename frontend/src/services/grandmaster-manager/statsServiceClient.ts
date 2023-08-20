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
    // Replaced by API calls
    return {
      rpcUrl: "https://devnetstats.apothem.network/subnet",
      denom: "xdc",
      chainId: 59467
    }
  }
  
  async getCandidates() {
    const { data } = await axios.get<CandidateDetails[]>(`${baseUrl}/information/candidates`);
    return data;
  }
}