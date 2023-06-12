import http from 'http';
import { App } from './app';
import { ValidateEnv } from './utils/validateEnv';
import { HealthRoute } from './routes/health.route';
import { EventsHandler } from './events';

ValidateEnv();
const app = new App([new HealthRoute()]);
// Attach Primus websocket connections
const server = http.createServer(app.getServer());
const eventHandler = new EventsHandler(server);

server.listen(() => {
  eventHandler.init();
});
