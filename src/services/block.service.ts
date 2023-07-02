import { Service } from 'typedi';
import * as _ from 'lodash';
import { BlockStorage, StoredBlock, StoredLatestCommittedBlock } from '../storage/block';
import { BlockInfo, LatestCommittedBlockInfoData } from '../interfaces/input/block.interface';
import { BlockResponse } from '../interfaces/output/blocksResponse.interface';

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

  public async getBlockStats(): Promise<any> {
    const allBlocks = await this.blockStorage.getAllBlocks();
    let averageBlockTime = 0;
    let txThroughput = 0;
    if (allBlocks && allBlocks.length > 1) {
      allBlocks.sort((a, b) => b.timestamp - a.timestamp);
      const timeDiff = (allBlocks[0].timestamp - allBlocks[allBlocks.length - 1].timestamp) / 1000;
      averageBlockTime = allBlocks.length / timeDiff;

      const totalNumOfTxs = _.reduce(
        allBlocks,
        (prev, curr) => {
          return prev + curr.txs.length;
        },
        0,
      );
      txThroughput = totalNumOfTxs / timeDiff;
    }
    return {
      averageBlockTime,
      txThroughput,
    };
  }

  // Get all available blocks on the same chain (sorted by block number)
  public async getRecentBlocks(): Promise<BlockResponse[]> {
    const allBlocks = await this.blockStorage.getAllBlocks();
    const lastCommittedBlockInfo = await this.blockStorage.getLatestCommittedBlock();
    if (!lastCommittedBlockInfo) {
      return this.shortCircuitRecentBlocks(allBlocks);
    }
    const lastCommittedBlock = await this.blockStorage.getMinedBlockByHash(lastCommittedBlockInfo.hash);
    // Short-curcit if the committedBlock is not even recored in the system. The gap between mined and committed is too far
    if (!lastCommittedBlock) {
      return this.shortCircuitRecentBlocks(allBlocks);
    }

    const sameChainBlocks = this.filterOutForksBeforeStartingBlock(allBlocks, lastCommittedBlock);

    return sameChainBlocks.map(b => {
      let committedInSubnet = false;
      if (b.number <= lastCommittedBlockInfo.number) {
        committedInSubnet = true;
      }
      return {
        ...b,
        committedInSubnet,
        committedInParentChain: false, // TODO: WIP for checking the status with parent chain
      };
    });
  }

  public async addLatestCommittedBlock(newCommittedBlock: LatestCommittedBlockInfoData): Promise<void> {
    const lastCommittedBlock = await this.blockStorage.getLatestCommittedBlock();
    if (!lastCommittedBlock || lastCommittedBlock.number < newCommittedBlock.number) {
      this.blockStorage.setLatestCommittedBlock(newCommittedBlock);
    }
  }

  public async getLastCommittedBlock(): Promise<StoredLatestCommittedBlock> {
    return await this.blockStorage.getLatestCommittedBlock();
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
    if (!earliest || latest.number < newBlock.number) {
      return true;
    }
    if (earliest.number < newBlock.number && !(await this.blockStorage.getMinedBlockByHash(newBlock.hash))) {
      return true;
    }
    return false;
  }

  /**
   *
   * @param chainToFilter: The list of blocks which you want to filter forks with
   * @param startingBlock: Optional value to indicate the starting block for filtering. If not provided, we start from the last block in the chainToFilter. A common value for this is the last committedBlock
   * @returns
   */
  private filterOutForksBeforeStartingBlock(chainToFilter: StoredBlock[], startingBlock?: StoredBlock): StoredBlock[] {
    // Nothing to filter if nothing in the chain
    if (!chainToFilter || !chainToFilter.length) {
      return chainToFilter;
    }

    const startingPointer = startingBlock ? startingBlock : chainToFilter[chainToFilter.length - 1];
    const onChainHash = [startingPointer.hash];
    let parentHashPointer = startingBlock.parentHash;
    // Track back through the parentChain hash, if found then mark them as on the same chain
    while (parentHashPointer) {
      const parentBlock = chainToFilter.find(b => b.hash === parentHashPointer);
      if (!parentBlock) {
        parentHashPointer = undefined;
        break;
      }
      onChainHash.push(parentHashPointer);
      parentHashPointer = parentBlock.parentHash;
    }
    // Special case, we don't want to filter out any blocks that is mined after the startingBlock.
    const filterBypassedBlockHash = chainToFilter.filter(b => b.number > startingBlock.number).map(b => b.hash);
    onChainHash.push(...filterBypassedBlockHash);

    // Now filter out anything that is not on the onChainHash list and sort the final list by block number again
    return chainToFilter.filter(b => onChainHash.find(onchainBlockHash => onchainBlockHash === b.hash)).sort((a, b) => a.number - b.number);
  }

  private shortCircuitRecentBlocks(allBlocks: StoredBlock[]) {
    return allBlocks.map(b => {
      return {
        ...b,
        committedInSubnet: false,
        committedInParentChain: false,
      };
    });
  }
}
