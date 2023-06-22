import NodeCache from 'node-cache';
import { NodeInfo } from '../interfaces/node.interface';

// This class is created so that we can easily swap with real DB without making changes to any other files
export class NodeStorage {
  private cache: NodeCache;
  constructor() {
    this.cache = new NodeCache();
  }

  async getNode(id: string): Promise<NodeInfo> {
    return this.cache.get(id);
  }

  // Update if node already exist, otherwise create a new one
  async setNode(nodeInfo: NodeInfo): Promise<boolean> {
    return this.cache.set(nodeInfo.id, nodeInfo);
  }

  // Get node values. Default to return all nodes if ids not provided
  async getNodes(ids?: string[]): Promise<{ [key: string]: NodeInfo }> {
    if (!ids || !ids.length) {
      ids = this.cache.keys();
    }
    return await this.cache.mget<NodeInfo>(ids);
  }
}
