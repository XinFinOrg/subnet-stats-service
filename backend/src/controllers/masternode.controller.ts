import { MasternodesService } from '../services/masternodes.service';
import { getService } from '../services/index';
import { NextFunction, Request, Response } from 'express';
import { Masternode, MasternodeRole } from '../interfaces/output/Masternodes.interface';

export class MasterNodeController {
  private masternodeService: MasternodesService;

  constructor() {
    this.masternodeService = getService().masternodeService;
  }

  public getMasternodesInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const nodesInfo = await this.masternodeService.getMasternodesInfo();
      const miners: Masternode[] = nodesInfo.masternodes.map(n => {
        return {
          address: n,
          role: MasternodeRole.MASTERNODE,
        };
      });
      const penalty: Masternode[] = nodesInfo.penalties.map(n => {
        return {
          address: n,
          role: MasternodeRole.PENALTY,
        };
      });
      const summary = {
        committee: miners.length + penalty.length,
        activeNodes: miners.length,
        inActiveNodes: penalty.length,
      };
      res.status(200).json({
        summary,
        nodes: miners.concat(penalty),
      });
    } catch (error) {
      next(error);
    }
  };

  public getCandidates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await this.masternodeService.getLatestCandidates();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };
}
