/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Web3, { FMT_BYTES, FMT_NUMBER } from 'web3';

import { CONTRACT_ADDRESS, FIXED_CAP_VALUE } from '@/constants/config';
import { ErrorTypes, ManagerError } from '@/services/grandmaster-manager/errors';
import { CustomRpcMethodsPlugin } from '@/services/grandmaster-manager/extensions';
import { weiToEther } from '@/utils/formatter';

import { ABI } from './abi';
import { StatsServiceClient } from './statsServiceClient';

export interface AccountDetails {
  accountAddress: string;
  balance: number;
  networkId: number;
  rpcAddress: string;
  denom: string;
}

interface GrandMasterInfo {
  grandMasterAddress: string;
  networkId: number;
  rpcUrl: string;
  denom: string;
  minimumDelegation: number;
}

export class GrandMasterManager {
  private grandMaster: GrandMasterInfo | undefined;
  private web3Client: Web3 | undefined;
  private web3Contract: any;
  private statsServiceClient: StatsServiceClient;

  constructor() {
    if (!(window as any).ethereum) {
      throw new ManagerError("XDC Pay Not Installed", ErrorTypes.WALLET_NOT_INSTALLED);
    }
    this.web3Client = new Web3((window as any).ethereum);
    this.web3Contract = new this.web3Client.eth.Contract(ABI, CONTRACT_ADDRESS);
    this.web3Contract.defaultHardfork = "homestead";
    this.web3Contract.defaultChain = "mainnet";

    this.statsServiceClient = new StatsServiceClient();
  }

  /**
   * This method will detect XDC-Pay and verify if customer has alraedy loggin.
   * @returns Account details will be returned if all good
   * @throws ManagerError with type of "WALLET_NOT_INSTALLED" || "WALLET_NOT_LOGIN"
   */
  async login(): Promise<AccountDetails> {
    try {
      const { accountAddress, balance, networkId, rpcUrl, denom } = await this.grandMasterAccountDetails();

      return {
        accountAddress,
        balance,
        networkId,
        denom,
        rpcAddress: rpcUrl
      };
    } catch (err: any) {
      if (err instanceof ManagerError) throw err;
      throw new ManagerError(err.message, ErrorTypes.WALLET_NOT_LOGIN);
    }
  }

  /**
   * Propose to add a new masternode for being a mining candidate from the next epoch
   * @param address The master node to be added
   */
  async addNewMasterNode(address: string): Promise<void> {
    try {
      const { accountAddress } = await this.grandMasterAccountDetails();
      const nonce = await this.web3Client!.eth.getTransactionCount(accountAddress, undefined, { number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX });
      await this.web3Contract.methods.propose(replaceXdcWith0x(address)).send({
        from: accountAddress,
        nonce,
        value: FIXED_CAP_VALUE,
        gas: 220000,
        gasPrice: '250000000'
      });
    } catch (error: any) {
      throw handleTransactionError(error);
    }
  }

  /**
   * Remove a masternode from the manager view list
   * @param address The master node to be removed
   */
  async removeMasterNode(address: string): Promise<void> {
    try {
      const { accountAddress } = await this.grandMasterAccountDetails();
      const nonce = await this.web3Client!.eth.getTransactionCount(accountAddress, undefined, { number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX });
      await this.web3Contract.methods.resign(replaceXdcWith0x(address)).send({
        from: accountAddress,
        nonce,
        value: 100,
        gas: 2200000,
        gasPrice: '250000000'
      });
    } catch (error: any) {
      throw handleTransactionError(error);
    }
  }

  /**
   * Change the voting/ranking power/order of a particular masternode.
   * @param address The targeted masternode
   * @param capValue The xdc value that will be applied to the targeted address. This value indicates the cap that would like to be increase/reduced on this address
   */
  async changeVote(address: string, capValue: number): Promise<void> {
    try {
      const { accountAddress } = await this.grandMasterAccountDetails();
      const nonce = await this.web3Client!.eth.getTransactionCount(accountAddress, undefined, { number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX });

      if (capValue > 0) {
        await this.web3Contract.methods.vote(replaceXdcWith0x(address)).send({
          from: accountAddress,
          nonce,
          value: capValue,
          gas: 220000,
          gasPrice: '250000000'
        });
      } else {
        await this.web3Contract.methods.unvote(replaceXdcWith0x(address), Math.abs(capValue)).send({
          from: accountAddress,
          nonce,
          value: "0x0",
          gas: 220000,
          gasPrice: '250000000'
        });
      }
    } catch (error: any) {
      throw handleTransactionError(error);
    }
  }

  /**
   * A event listener on wallet account. If user switch to a different account, this method will notify the provided handler
   * @param changeHandler The handler function to process when the accounts changed. The provided value will be the new wallet address.
   */
  async onAccountChange(changeHandler: (accounts: string) => any) {
    (this.web3Client!.currentProvider as any).on("accountsChanged", (accounts: string[]) => {
      if (accounts && accounts.length) {
        changeHandler(accounts[0]);
      }
    });
  }

  /**
   * A method to return subnet candidates and its status.
   * @returns The address and its current status and stake.
   * 'MASTERNODE' means it's one of the mining masternode
   * 'PROPOSED' means it just been proposed, but waiting for have enough vote in order to be the masternode.
   * 'SLASHED' means it's been taken out from the masternode list
   */
  async getCandidates() {
    try {
      return this.getCandidates_temporary()
      // return await this.statsServiceClient.getCandidates();
    } catch (error) {
      if (error instanceof ManagerError) throw error;
      throw new ManagerError("Unable to get list of candidates", ErrorTypes.INTERNAL_ERROR);
    }
  }
  
  // TODO: To be removed after API is done for the getCandidates method
  private async getCandidates_temporary() {
    const rpcBasedWeb3 = new Web3("https://devnetstats.apothem.network/subnet");
    rpcBasedWeb3.registerPlugin(new CustomRpcMethodsPlugin());
    
    const result = await rpcBasedWeb3!.xdcSubnet.getCandidates("latest");
    if (!result) {
      throw new ManagerError("Fail to get list of candidates from xdc subnet, empty value returned");
    }
    const { candidates, success } = result;
    if (!success) {
      throw new ManagerError("Fail to get list of candidates from xdc subnet");
    }
    return Object.entries(candidates).map(entry => {
      const [address, { capacity, status }] = entry;
      return {
        address,
        delegation: weiToEther(capacity),
        status
      };
    }).sort((a, b) => b.delegation - a.delegation);
  }
  
  private async verifyGrandMaster(accountAddress: string, networkId: number, forceRefreshGrandMaster?: boolean) {
    if (!this.grandMaster || forceRefreshGrandMaster) {
      const { grandmasterAddress, chainId, rpcUrl, denom, minimumDelegation } = await this.statsServiceClient.getChainSettingInfo();
      this.grandMaster = {
        grandMasterAddress: grandmasterAddress,
        networkId: chainId,
        rpcUrl,
        denom,
        minimumDelegation
      }
    }
    
    if (accountAddress != this.grandMaster.grandMasterAddress) {
      throw new ManagerError("Not GrandMaster", ErrorTypes.NOT_GRANDMASTER);
    } else if(networkId != this.grandMaster.networkId) {
      throw new ManagerError("Not on the right networkId", ErrorTypes.NOT_ON_THE_RIGHT_NETWORK);
    }
    return this.grandMaster!!
  }

  private async grandMasterAccountDetails() {
    const accounts = await this.web3Client!.eth.getAccounts();
    if (!accounts || !accounts.length || !accounts[0].length) {
      throw new Error("No wallet address found, have you logged in?");
    }
    const accountAddress = accounts[0];
    const balance = await this.web3Client!.eth.getBalance(accountAddress, undefined, { number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX });
    const networkId = await this.web3Client!.eth.getChainId({ number: FMT_NUMBER.NUMBER, bytes: FMT_BYTES.HEX });
    const { rpcUrl, denom } = await this.verifyGrandMaster(accountAddress, networkId);
    return {
      accountAddress, balance, networkId, rpcUrl, denom
    };
  }
}

const handleTransactionError = (error: any) => {
  if (error instanceof ManagerError) throw error;
  else if (error && error.code) {
    switch (error.code) {
      case 100:
        return new ManagerError(error.message, ErrorTypes.USER_DENINED);
      case 405:
        return new ManagerError(error.message, ErrorTypes.REVERTED_WITH_NO_REASON);
      default:
        return new ManagerError("Unable to process this transaction in xdc node, something wrong with your transaction/smart contract call input", ErrorTypes.INVALID_TRANSACTION);
    }
  }
  return new ManagerError("Error while processing, but no message found", ErrorTypes.INTERNAL_ERROR);
};

const replaceXdcWith0x = (address: string) => {
  if(address.startsWith("xdc")) {
    return address.replace("xdc", "0x");
  }
  return address;
};