import { MAX_NUM_OF_BLOCKS_IN_HISTORY } from '../config';
import { Db } from './base';

const TYPE = 'BLOCK';
// In case of no new blocks in 60s, we declare the block componenet of the system is not operational
const STATUS_KEY = 'BLOCK_STATUS';
const STATUS_TTL = 60;

const LATEST_COMMITTEDBLOCK_KEY = 'LATEST_COMMITTED_BLOCK';

/** 
  This class is created so that we can easily swap with real DB without making changes to any other files.
  We using Promise for all the method eventho there is no need for that. This is also just to make it convenient when we move to a proper cache/db
*/
export class BlockStorage {
  private db: Db;
  // Temporary use in memory array until a proper solution is implemented
  private minedBlockPool: StoredBlock[] = [];
  constructor() {
    this.db = new Db(TYPE);
  }

  async getMinedBlockPointer(): Promise<{ latest: StoredBlock; earliest: StoredBlock }> {
    return {
      latest: this.minedBlockPool.length ? this.minedBlockPool[this.minedBlockPool.length - 1] : undefined,
      earliest: this.minedBlockPool.length ? this.minedBlockPool[0] : undefined,
    };
  }

  async addMinedBlock(block: StoredBlock): Promise<boolean> {
    const { hash, number, parentHash, timestamp, txs } = block;
    const dataToStore = { hash, number, parentHash, timestamp, txs };
    this.minedBlockPool.push(dataToStore);
    this.minedBlockPool.sort((a: StoredBlock, b: StoredBlock) => a.number - b.number);
    if (this.minedBlockPool.length > MAX_NUM_OF_BLOCKS_IN_HISTORY) {
      this.minedBlockPool.shift();
    }

    return this.db.set(STATUS_KEY, true, STATUS_TTL);
  }

  async getMinedBlockByHash(hash: string): Promise<StoredBlock> {
    return this.minedBlockPool.find(b => b.hash === hash);
  }

  async getAllBlocks(): Promise<StoredBlock[]> {
    return [...this.minedBlockPool];
  }

  async getLatestCommittedBlock(): Promise<StoredLatestCommittedBlock> {
    return this.db.get(LATEST_COMMITTEDBLOCK_KEY);
  }

  async setLatestCommittedBlock(block: StoredLatestCommittedBlock): Promise<boolean> {
    return this.db.set(LATEST_COMMITTEDBLOCK_KEY, block);
  }

  async getStatus(): Promise<boolean> {
    return this.db.get(STATUS_KEY) || false;
  }
}

export interface StoredBlock {
  hash: string;
  number: number;
  parentHash: string;
  timestamp: number;
  txs: string[];
}

export interface StoredLatestCommittedBlock {
  number: number;
  hash: string;
  round: number;
}
