import axios from 'axios';
import { baseUrl } from '@/constants/urls';

export type CandidateDetailsStatus = 'MASTERNODE' | 'PROPOSED' | 'SLASHED';

export interface CandidateDetails {
  address: string;
  delegation: number;
  status: CandidateDetailsStatus;
}

export class StatsServiceClient {
  async getCandidates() {
    const { data } = await axios.get<CandidateDetails[]>(`${baseUrl}/information/candidates`);
    return data;
  }
}