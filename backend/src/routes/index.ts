import { MasterNodeController } from './../controllers/masternode.controller';
import { BlocksController } from './../controllers/blocks.controller';
import { Router } from 'express';
import { Routes } from '../interfaces/routes.interface';
import { HealthController } from '../controllers/health.controller';
import { RelayerController } from '../controllers/account.controller';

export class Route implements Routes {
  public router = Router();
  healthController = new HealthController();
  blocksController = new BlocksController();
  masterNodeController = new MasterNodeController();
  relayerController = new RelayerController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/health', this.healthController.healthCheck);
    this.router.get('/information/blocks', this.blocksController.loadRecentBlocks);
    this.router.get('/information/masternodes', this.masterNodeController.getMasternodesInfo);
    this.router.get('/information/network', this.blocksController.getBlockChainStats);
    this.router.get('/information/relayer', this.relayerController.getRelayerRelatedDetails);
  }
}
