import http from 'http';
import { App } from './app';
import { Route } from './routes';
import { EventsHandler } from './events';
import { logger } from './utils/logger';

const app = new App([new Route()]);
// Attach Primus websocket connections
const server = http.createServer(app.getServer());
const eventHandler = new EventsHandler(server);

server.listen(5213, () => {
  eventHandler.init();
  logger.info(`=================================`);
  logger.info('🚀 Subnet Stats Service listening on the port 5213');
  logger.info(`=================================`);
});
