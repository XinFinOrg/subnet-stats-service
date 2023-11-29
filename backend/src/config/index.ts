import { config } from 'dotenv';
config({ path: '.env.stats' });
import { logger } from '../utils/logger';

export const MAX_NUM_OF_BLOCKS_IN_HISTORY = 300;
export const NUM_OF_BLOCKS_RETURN = 50;

export const { SUBNET_URL, PARENTNET_URL } = process.env;
if (!SUBNET_URL || !PARENTNET_URL) {
  logger.error('SUBNET_URL and PARENTNET_URL configuration must be set!');
  process.exit(1);
}

export const { PARENTNET_WALLET, CHECKPOINT_CONTRACT } = process.env;
if (!PARENTNET_WALLET || !CHECKPOINT_CONTRACT) {
  logger.error('PARENTNET_WALLET and CHECKPOINT_CONTRACT configuration must be set!');
  process.exit(1);
}

export const { NODE_ENV, LOG_FORMAT, STATS_SECRET } = process.env;

export const CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || '';
