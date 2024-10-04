import http from 'http';
import { STATS_PORT } from './config';
import { App } from './app';
import { Route } from './routes';
import { EventsHandler } from './events';
import { logger } from './utils/logger';

const app = new App([new Route()]);
// Attach Primus websocket connections
const server = http.createServer(app.getServer());
const eventHandler = new EventsHandler(server);

server.listen(STATS_PORT, () => {
  eventHandler.init();
  logger.info(`=================================`);
  logger.info(`🚀 Subnet Stats Service listening on the port ${STATS_PORT}`);
  logger.info(`=================================`);
});
