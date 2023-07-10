import { BlockService } from '../services/block.service';
import { CONTRACT_ADDRESS, WALLET_ADDRESS } from '../config';
import { getService } from '../services';
import { AccountService } from '../services/account.service';
import { NextFunction, Request, Response } from 'express';

export class RelayerController {
  private accountService: AccountService;
  private blockService: BlockService;

  constructor() {
    this.accountService = getService().accountService;
    this.blockService = getService().blockService;
  }

  public getRelayerRelatedDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const [balance, processingBacklog] = await Promise.all([this.accountService.getBalance(), this.blockService.getProcessingBacklog()]);

      const resp = {
        account: {
          balance: balance,
          walletAddress: WALLET_ADDRESS,
        },
        backlog: processingBacklog.gap,
        contractAddress: CONTRACT_ADDRESS,
        health: {
          status: processingBacklog.isProcessing ? 'UP' : 'DOWN',
        },
      };
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
}
