import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';
import { HttpsAgent } from 'agentkeepalive';
import { abi } from './contract';
import { logger } from '../../utils/logger';
import { CHECKPOINT_CONTRACT, PARENTCHAIN_URL } from '../../config';
import { HttpException } from '../../exceptions/httpException';
import { networkExtensions, Web3WithExtension } from '../extensions';

export interface SmartContractAuditedBlockInfo {
  smartContractHash: string;
  smartContractHeight: number;
  smartContractCommittedHeight: number;
  smartContractCommittedHash: string;
}

export class ParentChainClient {
  private web3: Web3WithExtension;
  private smartContractInstance: Contract;

  constructor() {
    const keepaliveAgent = new HttpsAgent();
    const provider = new Web3.providers.HttpProvider(PARENTCHAIN_URL, { keepAlive: true, agent: { https: keepaliveAgent } });
    this.web3 = new Web3(provider).extend(networkExtensions());
    this.smartContractInstance = new this.web3.eth.Contract(abi as any[], CHECKPOINT_CONTRACT);
  }

  async getBalance(walletAddress: string): Promise<string> {
    try {
      return await this.web3.eth.getBalance(walletAddress);
    } catch (error) {
      logger.error(`Fail to get balance from the wallet address ${error}`);
      throw error;
    }
  }

  /*
    A method to fetch the last subnet block that has been stored/audited in mainnet XDC
  **/
  async getLastAudittedBlock(): Promise<SmartContractAuditedBlockInfo> {
    try {
      const result = await this.smartContractInstance.methods.getLatestBlocks().call();
      const [latestBlockHash, latestBlockHeight] = result[0];
      const [latestSmComittedHash, latestSmHeight] = result[1];
      if (!latestBlockHash || !latestBlockHeight || !latestSmComittedHash || !latestSmHeight) {
        logger.error('Invalid block hash or height received', latestBlockHash, latestBlockHeight, latestSmComittedHash, latestSmHeight);
        throw new HttpException(500, 'Exception when getting last audited blocks information from parentchain');
      }
      return {
        smartContractHash: latestBlockHash,
        smartContractHeight: parseInt(latestBlockHeight),
        smartContractCommittedHash: latestSmComittedHash,
        smartContractCommittedHeight: parseInt(latestSmHeight),
      };
    } catch (error) {
      logger.error("Error while trying to fetch the last audited subnet's block in XDC mainnet", { message: error.message });
      throw new HttpException(500, error.message ? error.message : 'Error while trying to fetch the last audited subnet block in XDC parentchain');
    }
  }

  async mode(): Promise<string> {
    try {
      const result = await this.smartContractInstance.methods.MODE().call();
      return result;
    } catch (error) {
      logger.error("Error while trying to fetch the last audited subnet's block in XDC mainnet", { message: error.message });
      throw new HttpException(500, error.message ? error.message : 'Error while trying to fetch the last audited subnet block in XDC parentchain');
    }
  }

  /**
   *
   * @param committedSubnetBlockHash WARNING: This method only check against the block has that has already been committed, otherwise always 0
   * @returns The full block header that hosted the transaction submitted by relayer (i.e the tx for committing the subnet block into parentchain)
   */
  async getParentChainBlockBySubnetHash(committedSubnetBlockHash: string) {
    try {
      const { mainnet_num } = await this.smartContractInstance.methods.getHeader(committedSubnetBlockHash).call();
      if (!mainnet_num) {
        logger.error(`Empty value returned when fetching the parentchain block that hosted the subnet block tx, mainet_num: ${mainnet_num}`);
        throw new Error('Empty value from parentchain');
      }
      return await this.web3.eth.getBlock(mainnet_num);
    } catch (error) {
      logger.error(`Error when fetching parent chain block by subnet block hash, error: ${error}`);
      throw error;
    }
  }

  /**
   * Confirm a subnet block whether it has been fully confirmed/committed in parentchain.
   * @param subnetHash The subnet block hash to confirm in parentchain
   * @returns boolean to indicate whether fully confirmed and the hosting block height and hash in parentchain
   */
  async confirmBlock(subnetHash: string) {
    const { finalized, mainnet_num } = await this.smartContractInstance.methods.getHeader(subnetHash).call();
    const { Committed, Hash, Miner, Timestamp } = await this.web3.xdcSubnet.getV2BlockByNumber(Web3.utils.numberToHex(mainnet_num));
    return {
      isCommitted: Committed && finalized,
      parentchainHash: Hash,
      parentChainNum: mainnet_num,
      proposer: Miner,
      timestamp: Timestamp,
    };
  }
}
