import { NextFunction, Request, Response } from 'express';
import { PARENTCHAIN_URL } from '../config';
import { BlocksResponse } from '../interfaces/output/blocksResponse.interface';
import { BlockService } from '../services/block.service';
import { getService } from './../services/index';
import { logger } from '../utils/logger';
import { HttpException } from '../exceptions/httpException';

export class BlocksController {
  private blockService: BlockService;

  constructor() {
    this.blockService = getService().blockService;
  }

  public loadRecentBlocks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [recentBlocks, chainStatus, lastSubnetCommittedBlock] = await Promise.all([
        this.blockService.getRecentBlocks(),
        this.blockService.getBlockChainStatus(),
        this.blockService.getLastSubnetCommittedBlock(),
      ]);

      const latestMinedBlock =
        recentBlocks && recentBlocks.length
          ? {
              hash: recentBlocks[recentBlocks.length - 1].hash,
              number: recentBlocks[recentBlocks.length - 1].number,
            }
          : {};
      const data: BlocksResponse = {
        blocks: recentBlocks,
        latestMinedBlock,
        latestSubnetCommittedBlock: lastSubnetCommittedBlock
          ? {
              hash: lastSubnetCommittedBlock.hash,
              number: lastSubnetCommittedBlock.number,
            }
          : {},
        latestParentChainCommittedBlock: {}, // TODO: WIP for the parent chain block confirmation
        chainHealth: chainStatus ? 'UP' : 'DOWN',
      };
      res.status(200).json(data);
    } catch (error) {
      logger.error(`Exception when load most recent blocks, ${error}`);
      next(error);
    }
  };

  public getBlockChainStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [blockStatus, chainStatus] = await Promise.all([this.blockService.getBlockStats(), this.blockService.getBlockChainStatus()]);
      const resp = {
        subnet: {
          block: {
            averageBlockTime: blockStatus.averageBlockTime,
            txThroughput: blockStatus.txThroughput,
          },
        },
        parentChain: {
          url: PARENTCHAIN_URL,
          name: 'Devnet', // TODO: get from web3 api
        },
        health: {
          status: chainStatus,
        },
      };
      res.status(200).json(resp);
    } catch (error) {
      logger.error(`Exception when getting blockchain statistics, ${error}`);
      next(error);
    }
  };

  public confirmBlock = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let resp: ConfirmationResponse;
      const input = req.query.input as string;

      if (input.startsWith('0x')) {
        let blockHash = input;
        let inputType: InputType = 'BLOCK_HASH';
        // It's either block hash or tx hash
        const tx = await this.blockService.getTransactionInfo(input);
        if (tx) {
          inputType = 'TRANSACTION_HASH';
          resp = {
            transaction: {
              from: tx.from,
              to: tx.to,
              gas: tx.gas,
              timestamp: tx.timestamp,
            },
          } as ConfirmationResponse;
          blockHash = tx.blockHash;
        }
        const { subnet, parentChain } = await this.blockService.confirmBlockByHash(blockHash);
        resp = {
          ...resp,
          inputType,
          subnet: {
            isConfirmed: subnet.committedInSubnet,
            blockHeight: subnet.subnetBlockHeight,
            blockHash: subnet.subnetBlockHash,
          },
          parentChain: {
            isConfirmed: parentChain.committedInParentChain,
            blockHash: parentChain.parentchainBlockHash,
            blockHeight: parentChain.parentchainBlockHeight,
          },
        };
      } else if (parseInt(input)) {
        // Verify by block number
        const { subnet, parentChain } = await this.blockService.confirmBlockByHeight(parseInt(input));
        resp = {
          inputType: 'BLOCK_HEIGHT',
          subnet: {
            isConfirmed: subnet.committedInSubnet,
            blockHeight: subnet.subnetBlockHeight,
            blockHash: subnet.subnetBlockHash,
          },
          parentChain: {
            isConfirmed: parentChain.committedInParentChain,
            blockHash: parentChain.parentchainBlockHash,
            blockHeight: parentChain.parentchainBlockHeight,
          },
        };
      } else {
        logger.warn(`Invalid input type, not hex and not integer, value: ${input}`);
        throw new HttpException(400, 'Invalid input type');
      }
      res.status(200).json(resp);
    } catch (error) {
      if (!(error instanceof HttpException)) {
        logger.error(`Exception when confirming block, ${error}`);
      }
      next(error);
    }
  };
}

type InputType = 'BLOCK_HEIGHT' | 'BLOCK_HASH' | 'TRANSACTION_HASH' | 'INVALID';
interface ConfirmationResponse {
  inputType: InputType;
  subnet: {
    isConfirmed: boolean;
    blockHeight: number;
    blockHash: string;
    proposer?: string;
  };
  parentChain: {
    isConfirmed: boolean;
    blockHeight: number;
    blockHash: string;
    proposer?: string;
  };
  transaction?: {
    from: string;
    to: string;
    gas: number;
    timestamp: string;
  };
}
