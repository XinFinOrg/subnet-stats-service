import { config } from 'dotenv';
config({ path: '.env.stats' });
import { logger } from '../utils/logger';

export const MAX_NUM_OF_BLOCKS_IN_HISTORY = 50;
export const { SUBNET_URL, PARENTCHAIN_URL } = process.env;
if (!SUBNET_URL || !PARENTCHAIN_URL) {
  logger.error('SUBNET_URL and PARENTCHAIN_URL configuration must be set!');
  process.exit(1);
}

export const { NODE_ENV, LOG_FORMAT, WS_SECRET } = process.env;
