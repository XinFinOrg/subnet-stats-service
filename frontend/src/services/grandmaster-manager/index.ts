import { StatsServiceClient } from './statsServiceClient';
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Web3, { FMT_BYTES, FMT_NUMBER } from "web3";
import { ErrorTypes, ManagerError } from "@/services/grandmaster-manager/errors";
import { CustomRpcMethodsPlugin } from "@/services/grandmaster-manager/extensions";
import { ABI } from "./abi";

export interface AccountDetails {
  accountAddress: string;
  balance: number;
  networkId: number;
  rpcAddress: string;
  denom: string;
}
export type CandidateDetailsStatus = 'MASTERNODE' | 'PROPOSED' | 'SLASHED';

export interface CandidateDetails {
  address: string;
  delegation: number;
  status: CandidateDetailsStatus
}

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000088";
const FIXED_CAP_VALUE = "0x84595161401484a000000";

export class GrandMasterManager {
  private initilised: boolean;
  private web3Client: Web3 | undefined;
  private web3Contract: any;
  
  private rpcBasedWeb3: Web3 | undefined;
  private statsServiceClient: StatsServiceClient;
  
  constructor() {
    this.initilised = false;
    if (!(window as any).ethereum) {
      throw new ManagerError("XDC Pay Not Installed", ErrorTypes.WALLET_NOT_INSTALLED)
    }
    this.web3Client = new Web3((window as any).ethereum);
    this.web3Contract = new this.web3Client.eth.Contract(ABI, CONTRACT_ADDRESS);
    this.statsServiceClient = new StatsServiceClient();
  }
  
  async init(forceInit = false) {
    if (this.initilised && !forceInit) {
      return
    }
    this.rpcBasedWeb3 = new Web3(await this.statsServiceClient.getRpcUrl());
    this.rpcBasedWeb3.registerPlugin(new CustomRpcMethodsPlugin());
    this.initilised = true;
  }
  
  private async getGrandMasterAccountDetails() {
    await this.init()
    const accounts = await this.web3Client!.eth.getAccounts();
    if (!accounts || !accounts.length || !accounts[0].length) {
      throw new Error("No wallet address found, have you logged in?");
    }
    const accountAddress = accounts[0];
    const balance = await this.web3Client!.eth.getBalance(accountAddress, undefined, { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX });
    const networkId = await this.web3Client!.eth.getChainId({ number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX });
    // TODO: Get denom, rpcAddress
    // TODO: Check with the grand master info from the node. Make sure they are the same, otherwise NOT_GRANDMASTER error
    return {
      accountAddress, balance, networkId
    }
  }
  
  /**
   * This method will detect XDC-Pay and verify if customer has alraedy loggin.
   * @returns Account details will be returned if all good
   * @throws ManagerError with type of "WALLET_NOT_INSTALLED" || "WALLET_NOT_LOGIN"
   */
  async login(): Promise<AccountDetails> {
    await this.init()
    try {
      const { accountAddress, balance, networkId } = await this.getGrandMasterAccountDetails();
      console.log(accountAddress)
      return {
        accountAddress,
        balance,
        networkId,
        denom: "hxdc",
        rpcAddress: "https://devnetstats.apothem.network/subnet"
      }
    } catch (err: any) {
      throw new ManagerError(err.message, ErrorTypes.WALLET_NOT_LOGIN)
    }
  }
  
  /**
   * Propose to add a new masternode for being a mining candidate from the next epoch
   * @param address The master node to be added
   */
  async addNewMasterNode(address: string): Promise<void> {
    await this.init()
    try {
      const { accountAddress } = await this.getGrandMasterAccountDetails();
      const nonce = await this.web3Client!.eth.getTransactionCount(accountAddress, undefined, { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX });
      await this.web3Contract.methods.propose(replaceXdcWith0x(address)).send({
        from: accountAddress,
        nonce,
        value: FIXED_CAP_VALUE,
        gas: 220000,
        gasPrice: 250000000
      });  
    } catch (error: any) {
      throw new ManagerError(error.message, ErrorTypes.INVALID_TRANSACTION) // Temporary return all errors as invalid
    }
  }
    
  /**
   * Remove a masternode from the manager view list
   * @param address The master node to be removed
   */
  async removeMasterNode(address: string): Promise<void> {
    await this.init()
    try {
      const { accountAddress } = await this.getGrandMasterAccountDetails();
      const nonce = await this.web3Client!.eth.getTransactionCount(accountAddress, undefined, { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX });
      await this.web3Contract.methods.resign(replaceXdcWith0x(address)).send({
        from: accountAddress,
        nonce,
        value: "0x0",
        gas: 220000,
        gasPrice: 250000000
      });  
    } catch (error: any) {
      console.log(error)
      throw new ManagerError(error.message, ErrorTypes.INVALID_TRANSACTION) // Temporary return all errors as invalid
    }
  }
  
  async vote(address: string): Promise<void> {
    await this.init()
    try {
      const { accountAddress } = await this.getGrandMasterAccountDetails();
      const nonce = await this.web3Client!.eth.getTransactionCount(accountAddress, undefined, { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX });
      await this.web3Contract.methods.vote(replaceXdcWith0x(address)).send({
        from: accountAddress,
        nonce,
        value: FIXED_CAP_VALUE,
        gas: 220000,
        gasPrice: 250000000
      });  
    } catch (error: any) {
      throw new ManagerError(error.message, ErrorTypes.INVALID_TRANSACTION) // Temporary return all errors as invalid
    }
  }

  /**
   * Change the voting/ranking power/order of a particular masternode.
   * @param address The targeted masternode
   * @param unvoteCap The xdc value that will be applied to the targeted address. This value indicates the cap that would like to be reduced on this address
   */
  async unvote(address: string, unvoteCap: number): Promise<void> {
    await this.init()
    try {
      const { accountAddress } = await this.getGrandMasterAccountDetails();
      const nonce = await this.web3Client!.eth.getTransactionCount(accountAddress, undefined, { number: FMT_NUMBER.NUMBER , bytes: FMT_BYTES.HEX });
      await this.web3Contract.methods.unvote(replaceXdcWith0x(address), unvoteCap).send({
        from: accountAddress,
        nonce,
        value: "0x0",
        gas: 220000,
        gasPrice: 250000000
      });  
    } catch (error: any) {
      throw new ManagerError(error.message, ErrorTypes.INVALID_TRANSACTION) // Temporary return all errors as invalid
    }
  }

  /**
   * A event listener on wallet account. If user switch to a different account, this method will update notify the provided handler
   * @param changeHandler The handler function to process when the accounts changed. The provided value will be the new wallet address.
   */
  async onAccountChange(changeHandler: (accounts: string) => any) {
    (this.web3Client!.currentProvider as any).on("accountsChanged", (accounts: string[]) => {
      if (accounts && accounts.length) {
        this.init(true);
        changeHandler(accounts[0])
      }
    })
  }

  /**
   * A method to return subnet candidates and its status.
   * @returns The address and its current status and stake.
   * 'MASTERNODE' means it's one of the mining masternode
   * 'PROPOSED' means it just been proposed, but waiting for have enough vote in order to be the masternode.
   * 'SLASHED' means it's been taken out from the masternode list
   */
  async getCandidates(): Promise<CandidateDetails[]> {
    await this.init()
    try {
      const result = await this.rpcBasedWeb3!.xdcSubnet.getCandidates("latest");
      if (!result) {
        throw new ManagerError("Fail to get list of candidates from xdc subnet, empty value returned");
      }
      const { candidates, success } = result;
      if (!success) {
        throw new ManagerError("Fail to get list of candidates from xdc subnet");
      }
      return Object.entries(candidates).map(entry => {
        const [ address, { capacity, status }] = entry;
        return {
          address,
          delegation: capacity,
          status
        }
      }).sort((a, b) => b.delegation - a.delegation);
      
    } catch (error: any) {
      throw new ManagerError(error);
    }
  }
}

const replaceXdcWith0x = (address: string) => {
  return address.replace("xdc", "0x")
}