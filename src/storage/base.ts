import NodeCache from 'node-cache';

// This class is created so that we can easily swap with real DB without making changes to any other files
export class Db {
  private cache: NodeCache;
  private type: string;
  constructor(type: string) {
    this.cache = new NodeCache();
    this.type = type;
  }

  async get(id: string): Promise<any> {
    return this.cache.get(id);
  }

  // Update if already exist, otherwise create a new one
  async set<T>(id: string, data: T, ttl?: number): Promise<boolean> {
    return this.cache.set(id, data, ttl);
  }

  // Get values. Default to return all if ids not provided
  async bulkGet<T>(ids?: string[]): Promise<{ [key: string]: T }> {
    if (!ids || !ids.length) {
      ids = this.cache.keys();
    }
    return this.cache.mget<T>(ids);
  }
}
