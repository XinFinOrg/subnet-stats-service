import { SubnetClient } from './../client/subnet/index';
import { Service } from 'typedi';
import { ParentChainClient } from '../client/parentchain';
import { PARENTNET_WALLET } from '../config';

@Service()
export class AccountService {
  private subnetClient: SubnetClient;
  private parentChainClient: ParentChainClient;
  constructor(subnetClient: SubnetClient, parentChainClient: ParentChainClient) {
    this.subnetClient = subnetClient;
    this.parentChainClient = parentChainClient;
  }
  public async getBalance(): Promise<string> {
    const wei = await this.parentChainClient.getBalance(PARENTNET_WALLET);
    return wei.slice(0, wei.length - 18); // 10**18 wei equal 1 coin
  }

  public async getNetworkInfo() {
    return this.subnetClient.getNetworkInfo();
  }
}
