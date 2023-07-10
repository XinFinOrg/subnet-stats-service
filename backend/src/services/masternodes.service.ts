import { Service } from 'typedi';
import { MasternodesStorage } from './../storage/masternodes';
import { SubnetClient } from '../client/subnet';
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
      penalties: penalisedMasternodesAddress? [] : penalisedMasternodesAddress.sort(),
    };
    this.masternodesStorage.addNodesToCache(data);
    return data;
  }
}
