import { NextFunction, Request, Response } from 'express';
import { PARENTCHAIN_URL } from '../config';
import { BlocksResponse } from '../interfaces/output/blocksResponse.interface';
import { BlockService } from '../services/block.service';
import { getService } from './../services/index';
import { logger } from '../utils/logger';

export class BlocksController {
  private blockService: BlockService;

  constructor() {
    this.blockService = getService().blockService;
  }

  public loadRecentBlocks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const recentBlocks = await this.blockService.getRecentBlocks();
      const chainStatus = await this.blockService.getBlockChainStatus();
      const lastSubnetCommittedBlock = await this.blockService.getLastCommittedBlock();
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
      logger.error('Exception when load most recent blocks', error);
      next(error);
    }
  };

  public getBlockChainStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { averageBlockTime, txThroughput } = await this.blockService.getBlockStats();
      const chainStatus = await this.blockService.getBlockChainStatus();
      const resp = {
        subnet: {
          block: {
            averageBlockTime,
            txThroughput,
          },
        },
        parentChain: {
          targetChain: PARENTCHAIN_URL,
        },
        health: {
          status: chainStatus,
        },
      };
      res.status(200).json(resp);
    } catch (error) {
      logger.error('Exception when getting blockchain statistics', error);
      next(error);
    }
  };
}
