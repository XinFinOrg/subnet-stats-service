import { BlocksResponse } from '../interfaces/output/blocksResponse.interface';
import { BlockService } from '../services/block.service';
import { getService } from './../services/index';
import { NextFunction, Request, Response } from 'express';

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
      next(error);
    }
  };
}
