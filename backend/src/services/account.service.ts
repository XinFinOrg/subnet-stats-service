import { Service } from 'typedi';
import { ParentChainClient } from '../client/parentchain';
import { WALLET_ADDRESS } from '../config';

@Service()
export class AccountService {
  private parentChainClient: ParentChainClient;
  constructor(parentChainClient: ParentChainClient) {
    this.parentChainClient = parentChainClient;
  }
  public async getBalance(): Promise<string> {
    return await this.parentChainClient.getBalance(WALLET_ADDRESS);
  }
}
