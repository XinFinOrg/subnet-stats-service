import { SubnetClient } from '../client/subnet';
import { BlockService } from './block.service';
import { MasternodesService } from './masternodes.service';
import { NodeService } from './node.service';
import { ParentChainClient } from '../client/parentchain';
import { AccountService } from './account.service';

export class Services {
  nodeServide: NodeService;
  blockService: BlockService;
  masternodeService: MasternodesService;
  accountService: AccountService;
  constructor() {
    // Inject the clients
    const subnetClient = new SubnetClient();
    const parentChainClient = new ParentChainClient();

    this.nodeServide = new NodeService();
    this.blockService = new BlockService(subnetClient, parentChainClient);
    this.masternodeService = new MasternodesService();
    this.accountService = new AccountService(parentChainClient);
  }
}

const service = new Services();

export const getService = (): Services => {
  return service;
};
