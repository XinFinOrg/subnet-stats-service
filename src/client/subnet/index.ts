import Web3 from 'web3';
import { HttpsAgent } from 'agentkeepalive';
import { subnetExtensions, Web3WithExtension } from './extensions';
import { logger } from '../../utils/logger';
import { HttpException } from '../../exceptions/httpException';
import { SUBNET_URL } from '../../config';

export interface MasternodesInfo {
  currentBlockNumber: number;
  currentRound: number;
  masternodesAddress: string[];
  penalisedMasternodesAddress: string[];
}

export class SubnetClient {
  private web3: Web3WithExtension;

  constructor() {
    const keepaliveAgent = new HttpsAgent();
    const provider = new Web3.providers.HttpProvider(SUBNET_URL, { keepAlive: true, agent: { https: keepaliveAgent } });

    this.web3 = new Web3(provider).extend(subnetExtensions);
  }

  async getLastMasternodesInformation(): Promise<MasternodesInfo> {
    try {
      const { Number, Round, Masternodes, Penalty } = await this.web3.xdcSubnet.getMasternodesByNumber('latest');
      return {
        currentBlockNumber: Number,
        currentRound: Round,
        masternodesAddress: Masternodes,
        penalisedMasternodesAddress: Penalty,
      };
    } catch (error) {
      logger.error('Fail to load masternodes information from subnet nodes', error);
      throw new HttpException(500, error.message ? error.message : 'Exception when getting mastenode information from subnet node');
    }
  }
}
