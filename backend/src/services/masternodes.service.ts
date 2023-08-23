import { Service } from 'typedi';
import { MasternodesStorage } from './../storage/masternodes';
import { SubnetClient } from '../client/subnet';
import { Candidates } from '../client/extensions';
@Service()
export class MasternodesService {
  private masternodesStorage: MasternodesStorage;
  private subnetClient: SubnetClient;

  constructor() {
    this.masternodesStorage = new MasternodesStorage();
    this.subnetClient = new SubnetClient();
  }

  public async getMasternodesInfo(): Promise<{ masternodes: string[]; penalties: string[] }> {
    const nodes = await this.masternodesStorage.getCachedNodes();
    if (nodes) return nodes;
    // Else, there is no historical data in cache, we need to populate it again
    const { masternodesAddress, penalisedMasternodesAddress } = await this.subnetClient.getLastMasternodesInformation();
    const data = {
      masternodes: masternodesAddress.sort(),
      penalties: penalisedMasternodesAddress.sort(),
    };
    this.masternodesStorage.addNodesToCache(data);
    return data;
  }

  public async getLatestCandidates(): Promise<CandidateDetails[]> {
    const rawCandiates = await this.subnetClient.getCandidates();
    return Object.entries(rawCandiates)
      .map(entry => {
        const [address, { capacity, status }] = entry;
        return {
          address,
          delegation: weiToEther(capacity),
          status,
        };
      })
      .sort((a, b) => b.delegation - a.delegation);
  }
}

export type CandidateDetailsStatus = 'MASTERNODE' | 'PROPOSED' | 'SLASHED';

export interface CandidateDetails {
  address: string;
  delegation: number;
  status: CandidateDetailsStatus;
}

export function formatTime(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000);

  const formattedDate = date.toLocaleString();

  return formattedDate;
}

const weiToEther = (wei: number) => {
  return Number(BigInt(wei) / BigInt(1e18));
};
