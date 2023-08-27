import { Service } from 'typedi';
import { NodeInfo } from '../interfaces/input/node.interface';
import { NodeStorage } from '../storage/node';
import { ValidationException } from '../exceptions/validationException';

@Service()
export class NodeService {
  private nodeStorage: NodeStorage;

  constructor() {
    this.nodeStorage = new NodeStorage();
  }

  public async addNode(nodeInfo: NodeInfo): Promise<boolean> {
    if (!nodeInfo.id) {
      throw new ValidationException(400, 'NodeInfo does not contain Id property');
    }
    return await this.nodeStorage.setNode(nodeInfo);
  }

  public async getNode(id: string): Promise<NodeInfo> {
    return await this.nodeStorage.getNode(id);
  }

  // Get all available nodes in sorted order
  public async getAllNodes(): Promise<NodeInfo[]> {
    const nodes = await this.nodeStorage.getNodes();
    return Object.values(nodes).sort();
  }
}
