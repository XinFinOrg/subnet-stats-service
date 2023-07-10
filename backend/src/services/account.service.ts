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
    const wei = await this.parentChainClient.getBalance(WALLET_ADDRESS);
    const balance = wei.slice(0,wei.length-18) // 10**18 wei equal 1 coin
    return balance
  }
}
