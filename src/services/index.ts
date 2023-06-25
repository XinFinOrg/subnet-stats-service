import { BlockService } from './block.service';
import { NodeService } from './node.service';

export class Services {
  nodeServide: NodeService;
  blockService: BlockService;
  constructor() {
    this.nodeServide = new NodeService();
    this.blockService = new BlockService();
  }
}

const service = new Services();

export const getService = (): Services => {
  return service;
};
