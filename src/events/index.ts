import Primus, { Spark } from 'primus';
import { Server } from 'http';

import { logger } from '../utils/logger';
import { HelloEventData } from '../interfaces/hello.interface';
import { NodeInfo } from '../interfaces/node.interface';
import { WS_SECRET } from '../config';
import { BlockEventData } from '../interfaces/input/block.interface';
import { Services, getService } from '../services';

const websocketSecret = WS_SECRET || 'subnet-stats-server';

export class EventsHandler {
  private services: Services;

  private receiver: Primus;

  constructor(server: Server) {
    this.receiver = new Primus(server, {
      pathname: '/api',
      plugin: {
        emit: require('primus-emit'),
        'spark-latency': require('primus-spark-latency'),
      },
    });
    this.services = getService();
  }

  public init() {
    // The instance that will receive the events from subnet nodes
    this.receiver.on('connection', (spark: Spark) => {
      logger.info('🚀 Received an event from subnet node: ', spark.address.ip);
      spark.on('hello', (data: HelloEventData) => {
        logger.debug('RECEIVER: Hello, Data: ', JSON.stringify(data));
        // Auth checking
        if (!data.secret || websocketSecret != data.secret) {
          logger.info('Disconnect a node who does not have the correct WS secret: ', spark.address.ip);
          spark.end(undefined, { reconnect: false });
          return false;
        }

        if (data.id) {
          const nodeInfo: NodeInfo = {
            id: data.id.toString(),
            connectionId: spark.id,
            ip: spark.address.ip,
            latency: spark.latency || 0,
          };
          this.services.nodeServide.addNode(nodeInfo);
        }
      });

      // Subnet block data are emitted per each mined block
      spark.on('block', (data: BlockEventData) => {
        logger.debug('RECEIVER: block, data: ', JSON.stringify(data));
        if (data.id) {
          // This event also include the committed block information
          if (data.block && data.latestCommittedBlockInfo) {
            this.services.blockService.addBlock(data.block);
            this.services.blockService.addLatestCommittedBlock(data.latestCommittedBlockInfo);
          }
        }
      });
    });

    logger.info('🎬 Subnet websocket event handler initilised!');
  }
}
