import { config } from 'dotenv';
config({ path: '.env.stats' });

export const { NODE_ENV, LOG_FORMAT, WS_SECRET } = process.env;
