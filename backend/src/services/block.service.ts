import { ParentChainClient } from '../client/parentchain';
import { Service } from 'typedi';
import * as _ from 'lodash';
import { BlockStorage, StoredBlock, StoredLatestCommittedBlock } from '../storage/block';
import { BlockInfo, LatestCommittedBlockInfoData } from '../interfaces/input/block.interface';
import { BaseBlockResponse, BlockResponse } from '../interfaces/output/blocksResponse.interface';
import { SubnetClient } from '../client/subnet';
import { HttpException } from '@/exceptions/httpException';
import { NUM_OF_BLOCKS_RETURN } from '../config';
import { logger } from '../utils/logger';


@Service()
export class BlockService {
  private blockStorage: BlockStorage;
  private subnetClient: SubnetClient;
  private parentChainClient: ParentChainClient;

  constructor(subnetClient: SubnetClient, parentChainClient: ParentChainClient) {
    this.blockStorage = new BlockStorage();
    this.subnetClient = subnetClient;
    this.parentChainClient = parentChainClient;
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

  public async getBlockStats() {
    const allBlocks = await this.blockStorage.getAllBlocks();
    let averageBlockTime = 0;
    let txThroughput = 0;
    if (allBlocks && allBlocks.length > 1) {
      allBlocks.sort((a, b) => b.timestamp - a.timestamp);
      const timeDiff = allBlocks[0].timestamp - allBlocks[allBlocks.length - 1].timestamp;
      averageBlockTime = timeDiff / allBlocks.length;

      const totalNumOfTxs = _.reduce(
        allBlocks,
        (prev, curr) => {
          return prev + curr.transactions.length;
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

  public async getLastMinedBlocks(): Promise<BaseBlockResponse> {
    const allBlocks = await this.blockStorage.getAllBlocks();
    const latestMinedBlock =
      allBlocks && allBlocks.length
        ? {
            hash: allBlocks[allBlocks.length - 1].hash,
            number: allBlocks[allBlocks.length - 1].number,
          }
        : {
            hash: '',
            number: 0,
          };
    return latestMinedBlock;
  }

  // Get all available blocks on the same chain (sorted by block number)
  public async getRecentBlocks(blockIndex: number): Promise<BlockResponse[]> {
    const allBlocks = await this.blockStorage.getAllBlocks();
    const lastCommittedBlockInfo = await this.getLastSubnetCommittedBlock();
    const lastCommittedBlock = await this.blockStorage.getMinedBlockByHash(lastCommittedBlockInfo.hash);
    const endIndex = blockIndex != -1 ? allBlocks.findIndex(block => block.number == blockIndex) : allBlocks.length - 1;
    const startIndex = endIndex - NUM_OF_BLOCKS_RETURN >= 0 ? endIndex - NUM_OF_BLOCKS_RETURN : 0;
    const selectedBlocks = allBlocks.slice(startIndex, endIndex);

    // Short-curcit if the committedBlock is not even recored in the system. The gap between mined and committed is too far
    if (!lastCommittedBlock) {
      return this.shortCircuitRecentBlocks(selectedBlocks);
    }

    const sameChainBlocks = this.filterOutForksBeforeStartingBlock(selectedBlocks, lastCommittedBlock);
    const { committed, submitted } = await this.getLastParentchainSubnetBlock();

    return sameChainBlocks.map(b => {
      return {
        ...b,
        committedInSubnet: b.number <= lastCommittedBlockInfo.number,
        committedInParentChain: b.number <= committed.height,
        submittedInParentChain: b.number <= submitted.height,
      };
    });
  }

  public async addLatestSubnetCommittedBlock(newCommittedBlock: LatestCommittedBlockInfoData): Promise<void> {
    const lastCommittedBlock = await this.blockStorage.getLatestCommittedBlock();
    if (!lastCommittedBlock || lastCommittedBlock.number < newCommittedBlock.number) {
      await this.blockStorage.setLatestCommittedBlock(newCommittedBlock);
    }
  }

  // This method will get the latest committed block in subnet
  public async getLastSubnetCommittedBlock(): Promise<StoredLatestCommittedBlock> {
    let block = await this.blockStorage.getLatestCommittedBlock();
    if (!block) {
      block = await this.subnetClient.getLatestCommittedBlockInfo();
      await this.blockStorage.setLatestCommittedBlock(block);
    }
    return block;
  }

  public async getLastParentchainSubnetBlock() {
    const { smartContractCommittedHash, smartContractCommittedHeight, smartContractHash, smartContractHeight } =
      await this.getAndSetLastSubmittedBlockInfo();
    return {
      committed: {
        height: smartContractCommittedHeight,
        hash: smartContractCommittedHash,
      },
      submitted: {
        height: smartContractHeight,
        hash: smartContractHash,
      },
    };
  }

  public async getBlockChainStatus(): Promise<boolean> {
    return await this.blockStorage.getStatus();
  }

  // Returns the block num difference between what's mined in subnet and what's submitted to parent chain
  public async getProcessingBacklog(): Promise<{ gap: number; isProcessing: boolean; mode: string }> {
    const [lastSubnetCommittedBlock, smartContractProcessingInfo] = await Promise.all([
      this.getLastSubnetCommittedBlock(),
      this.getSmartContractProcessingInfo(),
    ]);
    return {
      gap: lastSubnetCommittedBlock.number - smartContractProcessingInfo.processedUntil || -1,
      isProcessing: smartContractProcessingInfo.isProcessing,
      mode: smartContractProcessingInfo.mode,
    };
  }

  public async confirmBlockByHeight(blockToConfirmHeight: number) {
    const result = await this.subnetClient.getBlock(blockToConfirmHeight);
    if (!result) {
      throw new HttpException(404, 'No such block exit in subnet');
    }
    return this.confirmBlock(result.hash);
  }

  public async confirmBlockByHash(blockToConfirmHash: string) {
    const result = await this.subnetClient.getBlockInfoByHash(blockToConfirmHash);
    if (!result) {
      throw new HttpException(404, 'No such block exit in subnet');
    }
    return this.confirmBlock(blockToConfirmHash, result);
  }

  public async getTransactionInfo(hash: string) {
    const txResult = await this.subnetClient.getTxByTransactionHash(hash);
    if (!txResult) {
      return undefined;
    }
    const { timestamp } = await this.subnetClient.getBlock(txResult.blockHash);
    return {
      from: txResult.from,
      to: txResult.to,
      gas: txResult.gas,
      timestamp: timestamp.toString(),
      blockHash: txResult.blockHash,
    };
  }

  // Perform confirmation operation to confirm the subnet block has been confirm on both subnet and parentchain
  private async confirmBlock(
    blockToConfirmHash: string,
    subnetBlockInfo?: { subnetBlockNumber: number; committedInSubnet: boolean; proposer: string; timestamp: number },
  ) {
    // Only fetch if not provided
    if (!subnetBlockInfo) {
      subnetBlockInfo = await this.subnetClient.getBlockInfoByHash(blockToConfirmHash);
    }

    const parentchainConfirmation = await this.parentChainClient.confirmBlock(blockToConfirmHash);
    return {
      subnet: {
        committedInSubnet: subnetBlockInfo.committedInSubnet,
        subnetBlockHeight: subnetBlockInfo.subnetBlockNumber,
        subnetBlockHash: blockToConfirmHash,
        proposer: subnetBlockInfo.proposer,
        timestamp: subnetBlockInfo.timestamp,
      },
      parentChain: {
        committedInParentChain: parentchainConfirmation.isCommitted,
        parentchainBlockHeight: parentchainConfirmation.parentChainNum,
        parentchainBlockHash: parentchainConfirmation.parentchainHash,
        proposer: parentchainConfirmation.proposer,
        timestamp: parentchainConfirmation.timestamp,
      },
    };
  }

  private async getSmartContractProcessingInfo(): Promise<{ processedUntil: number; isProcessing: boolean; mode: string }> {
    const { smartContractHeight, smartContractCommittedHash } = await this.getAndSetLastSubmittedBlockInfo();
    const mode = await this.parentChainClient.mode();
    const { timestamp } = await this.parentChainClient.getParentChainBlockBySubnetHash(smartContractCommittedHash);
    const { number: subnetCommittedNumber } = await this.subnetClient.getLatestCommittedBlockInfo();

    let isProcessing = true;
    const blockDiff = subnetCommittedNumber - smartContractHeight;
    if (mode == 'lite' && blockDiff > 1000) {
      isProcessing = false;
    }
    if (mode == 'full' && blockDiff > 100) {
      isProcessing = false;
    }

    return {
      processedUntil: smartContractHeight,
      isProcessing,
      mode,
    };
  }

  private async getAndSetLastSubmittedBlockInfo() {
    const lastSubmittedBlockInfo = await this.blockStorage.getLastSubmittedBlockInfo();
    // Not exist, we need to call the parentchain node and set the value
    if (!lastSubmittedBlockInfo) {
      const result = await this.parentChainClient.getLastAudittedBlock();
      await this.blockStorage.setLastSubmittedToParentchainBlockInfo(result);
      return result;
    }
    return lastSubmittedBlockInfo;
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

    const lastBLock = chainToFilter[chainToFilter.length - 1];
    const startingPointer = startingBlock && startingBlock.number <= lastBLock.number ? startingBlock : lastBLock;
    const onChainHash = [startingPointer.hash];
    let parentHashPointer = startingPointer.parentHash;
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
        submittedInParentChain: false,
      };
    });
  }
}
