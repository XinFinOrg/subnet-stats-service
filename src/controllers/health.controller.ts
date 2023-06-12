import { NextFunction, Request, Response } from 'express';

export class HealthController {
  public healthCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).send('OK');
    } catch (error) {
      next(error);
    }
  };
}
