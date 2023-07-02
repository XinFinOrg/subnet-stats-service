import { NodeInfo } from '../interfaces/input/node.interface';
import { Db } from './base';

const TYPE = 'NODE';
// This class is created so that we can easily swap with real DB without making changes to any other files
export class NodeStorage {
  private db: Db;
  constructor() {
    this.db = new Db(TYPE);
  }

  async getNode(id: string): Promise<NodeInfo> {
    return this.db.get(id);
  }

  // Update if node already exist, otherwise create a new one
  async setNode(nodeInfo: NodeInfo): Promise<boolean> {
    return this.db.set(nodeInfo.id, nodeInfo);
  }

  // Get node values. Default to return all nodes if ids not provided
  async getNodes(ids?: string[]): Promise<{ [key: string]: NodeInfo }> {
    return await this.db.bulkGet<NodeInfo>(ids);
  }
}
