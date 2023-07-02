import { NextFunction, Request, Response } from 'express';

export class RelayerController {
  public getRelayerRelatedDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resp = {
        account: {
          balance: '2000',
          walletAddress: 'xdc123123',
        },
        backlog: 10,
        contractAddress: '0x123123',
        health: {
          status: 'UP',
        },
      };
      res.status(200).json(resp);
    } catch (error) {
      next(error);
    }
  };
}
