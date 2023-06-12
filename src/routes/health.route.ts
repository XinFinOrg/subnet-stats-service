import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { HealthController } from '@/controllers/health.controller';

export class HealthRoute implements Routes {
  public router = Router();
  public healthController = new HealthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/health', this.healthController.healthCheck);
  }
}
