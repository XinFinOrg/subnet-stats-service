import { BlockService } from '../services/block.service';
import { CHECKPOINT_CONTRACT, PARENTNET_WALLET, SUBNET_URL } from '../config';
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
          walletAddress: PARENTNET_WALLET,
        },
        backlog: processingBacklog.gap,
        contractAddress: CHECKPOINT_CONTRACT,
        health: {
          status: processingBacklog.isProcessing ? 'UP' : 'DOWN',
        },
        mode: processingBacklog.mode,
      };
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  public getChainDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.accountService.getNetworkInfo();
      const data = {
        ...result,
        rpcUrl: SUBNET_URL,
      };
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}
