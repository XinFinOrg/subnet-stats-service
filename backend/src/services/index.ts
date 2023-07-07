import { BlockService } from './block.service';
import { MasternodesService } from './masternodes.service';
import { NodeService } from './node.service';

export class Services {
  nodeServide: NodeService;
  blockService: BlockService;
  masternodeService: MasternodesService;
  constructor() {
    this.nodeServide = new NodeService();
    this.blockService = new BlockService();
    this.masternodeService = new MasternodesService();
  }
}

const service = new Services();

export const getService = (): Services => {
  return service;
};
