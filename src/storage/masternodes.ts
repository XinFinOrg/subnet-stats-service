import { Db } from './base';

const TYPE = 'MASTERNODES';
const TTL = 60;

const MASTERNODE_KEY = 'MASTERNODE_KEY';

/** 
  This class is created so that we can easily swap with real DB without making changes to any other files.
  We using Promise for all the method eventho there is no need for that. This is also just to make it convenient when we move to a proper cache/db
*/
export class MasternodesStorage {
  private db: Db;
  // Temporary use in memory array until a pr
  constructor() {
    this.db = new Db(TYPE);
  }

  async addNodesToCache(masternodesInfo: CachedMasternodes): Promise<boolean> {
    return this.db.set(MASTERNODE_KEY, masternodesInfo, TTL);
  }

  async getCachedNodes(): Promise<CachedMasternodes> {
    return this.db.get(MASTERNODE_KEY);
  }
}

export interface CachedMasternodes {
  masternodes: string[];
  penalties: string[];
}
