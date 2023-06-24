import { Service } from 'typedi';
import { BlockStorage, StoredBlock } from '../storage/block';
import { BlockInfo, LatestCommittedBlockInfoData } from '../interfaces/block.interface';

@Service()
export class BlockService {
  private blockStorage: BlockStorage;

  constructor() {
    this.blockStorage = new BlockStorage();
  }

  public async addBlock(blockData: BlockInfo): Promise<void> {
    const pointers = await this.blockStorage.getMinedBlockPointer();
    // Only add if the new block number is higher
    if (await this.shouldAddBlock(pointers, blockData)) {
      await this.blockStorage.addMinedBlock(blockData);
    }
  }

  public async getBlockByHash(hash: string): Promise<StoredBlock> {
    return await this.blockStorage.getMinedBlockByHash(hash);
  }

  // Get all available blocks in sorted by block number order.
  public async getAll(): Promise<StoredBlock[]> {
    return await this.blockStorage.getAllBlocks();
  }

  public async addLatestCommittedBlock(newCommittedBlock: LatestCommittedBlockInfoData): Promise<void> {
    const lastCommittedBlock = await this.blockStorage.getLatestCommittedBlock();
    if (!lastCommittedBlock || lastCommittedBlock.number < newCommittedBlock.number) {
      this.blockStorage.setLatestCommittedBlock(newCommittedBlock);
    }
  }

  public async getBlockChainStatus(): Promise<boolean> {
    return await this.blockStorage.getStatus();
  }

  /**
    In order to insert into the queue. we need it satisfy any of the below condition
    
    1. The queue is empty
    2. OR New block is newer than what's currently in queue
    3. OR new block is newer than the earliest stored in the queue AND also not received before.
  */
  private async shouldAddBlock(pointer: { latest: StoredBlock; earliest: StoredBlock }, newBlock: BlockInfo): Promise<Boolean> {
    const { earliest, latest } = pointer;
    if (
      !earliest ||
      latest.number < newBlock.number ||
      (earliest.number < newBlock.number && !(await this.blockStorage.getMinedBlockByHash(newBlock.hash)))
    ) {
      return true;
    }
    return false;
  }
}
