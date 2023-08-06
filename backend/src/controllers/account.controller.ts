import { BlockService } from '../services/block.service';
import { CHECKPOINT_CONTRACT, PARENTCHAIN_WALLET, SUBNET_URL } from '../config';
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
          walletAddress: PARENTCHAIN_WALLET,
        },
        backlog: processingBacklog.gap,
        contractAddress: CHECKPOINT_CONTRACT,
        health: {
          status: processingBacklog.isProcessing ? 'UP' : 'DOWN',
        },
      };
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };

  // TODO: Fetch the chain grandmaster address etc.
  public getChainDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = {
      rpcUrl: SUBNET_URL,
      grandmasterAddress: 'xxx',
      minimumDelegation: '10000000000000000000000000',
    };
    res.status(200).json(data);
  };
}
