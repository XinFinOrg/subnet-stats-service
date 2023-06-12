import Primus, { Spark } from 'primus';
import { Server } from 'http';

import { logger } from '../utils/logger';
import { HelloData } from '../interfaces/hello.interface';
import { NodeInfo } from '../interfaces/node.interface';
import { NodeService } from '../services/node.service';

export class EventsHandler {
  private nodeServide: NodeService;
  private receiver: Primus;

  constructor(server: Server) {
    this.receiver = new Primus(server, {
      pathname: '/api',
      plugin: {
        emit: require('primus-emit'),
        'spark-latency': require('primus-spark-latency'),
      },
    });

    this.nodeServide = new NodeService();
  }

  public init() {
    // The instance that will receive the events from subnet nodes
    this.receiver.on('connection', (spark: Spark) => {
      logger.info('🚀 Received an event from subnet node: ', spark.address.ip);
      spark.on('hello', (data: HelloData) => {
        logger.debug('RECEIVER: Hello, Data: ', JSON.stringify(data));
        if (data.id) {
          const nodeInfo: NodeInfo = {
            id: data.id.toString(),
            connectionId: spark.id,
            ip: spark.address.ip,
            latency: spark.latency || 0,
          };
          this.nodeServide.addNode(nodeInfo);
        }
      });
    });

    logger.info('🎬 Subnet websocket event handler initilised!');
  }
}
