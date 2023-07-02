import { NextFunction, Request, Response } from 'express';

export class SystemNetworkController {
  public systemNetworkDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resp = {
        subnet: {
          block: {
            averageBlockTime: 2,
            txThroughput: 10,
          },
        },
        parentChain: {
          targetChain: 'XDC',
        },
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
