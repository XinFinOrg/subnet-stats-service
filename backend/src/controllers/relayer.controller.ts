import { NextFunction, Request, Response } from 'express';

export class RelayerController {
  public getRelayerRelatedDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resp = {
        account: {
          balance: '2000',
          walletAddress: 'xdc16C4d7e3f059C3288ad286756EEc9F70814CFC6F',
        },
        backlog: 10,
        contractAddress: 'xdc16C4d7e3f059C3288ad286756EEc9F70814CFC6F',
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
