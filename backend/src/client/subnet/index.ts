import Web3 from 'web3';
import { HttpsAgent } from 'agentkeepalive';
import { networkExtensions, Web3WithExtension } from '../extensions';
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

    this.web3 = new Web3(provider).extend(networkExtensions());
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
      logger.error(`Fail to load masternodes information from subnet nodes, ${error}`);
      throw new HttpException(500, error.message ? error.message : 'Exception when getting mastenode information from subnet node');
    }
  }

  async getLatestCommittedBlockInfo(): Promise<{ hash: string; number: number; round: number }> {
    try {
      const { Hash, Number, Round } = await this.web3.xdcSubnet.getV2Block('committed');
      return {
        hash: Hash,
        number: Number,
        round: Round,
      };
    } catch (error) {
      logger.error(`Fail to load last committed block information from subnet, ${error}`);
      throw new HttpException(500, error.message ? error.message : 'Exception when getting last committed block information from subnet node');
    }
  }

  async getBlockInfoByHash(hash: string) {
    const { Hash, Number, Committed, Miner } = await this.web3.xdcSubnet.getV2BlockByHash(hash);
    if (!Hash || !Number) {
      logger.warn(`Invalid block hash or height or ParentHash received, hash: ${hash}, number: ${Number}`);
      throw new HttpException(404, 'No such block exit in subnet');
    }
    return {
      subnetBlockHash: Hash,
      subnetBlockNumber: Number,
      committedInSubnet: Committed,
      proposer: Miner,
    };
  }

  async getBlock(blockHashOrBlockNumber: number | string) {
    return this.web3.eth.getBlock(blockHashOrBlockNumber);
  }

  async getTxByTransactionHash(transactionHash: string) {
    return this.web3.eth.getTransaction(transactionHash);
  }
}
