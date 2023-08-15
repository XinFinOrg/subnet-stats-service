import axios from 'axios';
import { baseUrl } from '@/constants/urls';


export class StatsServiceClient {
  async getRpcUrl() {
    try {
      const { data } = await axios.get<{subnet: { rpcUrl: string}}>(`${baseUrl}/information/chainsetting`);
      return data.subnet.rpcUrl
    } catch (error) {
      // TODO: Throw error instead after we updated the backend to have this chainsetting endpoint
      return "https://devnetstats.apothem.network/subnet"
    }
  }
}