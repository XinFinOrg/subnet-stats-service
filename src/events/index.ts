import Primus, { Spark } from 'primus';
import { Server } from 'http';
import * as _ from 'lodash';

import { logger } from '../utils/logger';
import { HelloEventData } from '../interfaces/input/hello.interface';
import { NodeInfo } from '../interfaces/input/node.interface';
import { MAX_NUM_OF_BLOCKS_IN_HISTORY, WS_SECRET } from '../config';
import { BlockEventData, BlockInfo } from '../interfaces/input/block.interface';
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
      spark.on('node-ping', (data: any) => {
        spark.emit('node-pong', {
          clientTime: data.clientTime,
          serverTime: Date.now(),
        });
      });

      spark.on('hello', (data: HelloEventData) => {
        logger.info(`RECEIVER: Hello, Data: ${JSON.stringify(data)}`);
        // Auth checking
        if (!data || !data.secret || websocketSecret != data.secret) {
          logger.info(`Disconnect a node who does not have the correct WS secret: ${spark.address.ip} `);
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

        spark.emit('ready') // send ack back

        // Load the initial data
        logger.info('Emitting a history event to the connected node');
        spark.emit('history', _.fill(Array(MAX_NUM_OF_BLOCKS_IN_HISTORY), {}));
      });

      // Subnet block data are emitted per each mined block
      spark.on('block', (data: BlockEventData) => {
        logger.info(`RECEIVER: block, data: ${JSON.stringify(data)}`);
        if (data.id) {
          // This event also include the committed block information
          if (data.block && data.latestCommittedBlockInfo) {
            this.services.blockService.addBlock(data.block);
            this.services.blockService.addLatestCommittedBlock(data.latestCommittedBlockInfo);
          }
        }
      });

      spark.on('history', (historyBlocks: { id: number; history: BlockInfo[] }) => {
        logger.info(`RECEIVER: history, data: ${JSON.stringify(historyBlocks)}`);
        if (historyBlocks.id && historyBlocks.history.length) {
          historyBlocks.history.map(b => {
            this.services.blockService.addBlock(b);
          });
        }
      });
    });

    logger.info('🎬 Subnet websocket event handler initilised!');
  }
}
