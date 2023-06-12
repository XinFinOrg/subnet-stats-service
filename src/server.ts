import http from 'http';
import { App } from './app';
import { HealthRoute } from './routes/health.route';
import { EventsHandler } from './events';
import { logger } from './utils/logger';

const app = new App([new HealthRoute()]);
// Attach Primus websocket connections
const server = http.createServer(app.getServer());
const eventHandler = new EventsHandler(server);

server.listen(3000, () => {
  eventHandler.init();
  logger.info(`=================================`);
  logger.info('🚀 Subnet Stats Service listening on the port 3000');
  logger.info(`=================================`);
});
