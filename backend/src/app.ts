import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { LOG_FORMAT, CORS_ALLOW_ORIGIN } from './config';
import { Routes } from './interfaces/routes.interface';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { logger, stream } from './utils/logger';


export class App {
  public app: express.Application;

  constructor(routes: Routes[]) {
    this.app = express();

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeSwagger();
    this.initializeErrorHandling();
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    if (CORS_ALLOW_ORIGIN != ''){
      this.app.use(cors({origin: CORS_ALLOW_ORIGIN}));   
    }
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeSwagger() {
    try {
      const options = {
        swaggerDefinition: {
          openapi: '3.0.0',
          info: {
            title: 'Subnet Stats Service REST API',
            version: '1.0.0',
            description: 'Swagger for the subnet stats server',
          },
        },
        apis: ['swagger.yaml'],
      };

      const specs = swaggerJSDoc(options);
      this.app.use('/', swaggerUi.serve, swaggerUi.setup(specs));
    } catch (error) {
      logger.error(`Fail to initialize swagger: ${error}`);
    }
  }

  private initializeErrorHandling() {
    this.app.use(ErrorMiddleware);
  }
}
