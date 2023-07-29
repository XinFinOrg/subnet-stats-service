import Web3 from "web3";
import { ErrorTypes, ManagerError } from "@/services/grandmaster-manager/errors";

export interface AccountDetails {
  accountAddress: string;
  balance: string;
  networkId: number;
  rpcAddress: string;
  denom: string;
}

export interface CandidateDetails {
  address: string;
  delegation: number;
  rank: number;
  status: CandidateDetailsStatus;
}

export type CandidateDetailsStatus = 'MASTERNODE' | 'PROPOSED' | 'SLASHED';

export class GrandMasterManager {
  private web3Client;
  constructor() {
    const win = window as any;
    this.web3Client = new Web3(win.xdc ? win.xdc : win.ethereum);
  }
  
  private isXdcWalletInstalled() {
    if (this.web3Client.currentProvider && (window as any).xdc) {
      return true;
    }
    return false;
  }
  
  private async getAccountDetails() {
    const accounts = await this.web3Client.eth.getAccounts();
    if (!accounts || !accounts.length || !accounts[0].length) {
      throw new Error("No wallet address found, have you logged in?");
    }
    const accountAddress = accounts[0];
    const balance = await this.web3Client.eth.getBalance(accountAddress);
    const networkId = await this.web3Client.eth.getChainId();
    // TODO: Get denom, rpcAddress
    return {
      accountAddress, balance, networkId
    }
  }
  
  /**
   * This method will detect XDC-Pay and verify if customer has alraedy loggin.
   * @returns Account details will be returned if all good
   * @throws ManagerError with type of "WALLET_NOT_INSTALLED" || "CONFLICT_WITH_METAMASK" || "WALLET_NOT_LOGIN"
   */
  async login(): Promise<AccountDetails> {
    if (!this.isXdcWalletInstalled) {
      throw new ManagerError("XDC Pay Not Installed", ErrorTypes.WALLET_NOT_INSTALLED)
    }
    if ((this.web3Client.currentProvider as any).chainId) {
      throw new ManagerError("Metamask need to be disabled", ErrorTypes.CONFLICT_WITH_METAMASK)
    }
    
    try {
      const { accountAddress, balance, networkId } = await this.getAccountDetails();
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
   * Remove a masternode from the manager view list
   * @param address The master node to be removed
   * @returns If transaction is successful, return. Otherwise, an error details will be thrown
   */
  async removeMasterNode(address: string): Promise<true> {
    return true;
  }

  /**
   * Propose to add a new masternode for being a mining candidate from the next epoch
   * @param address The master node to be added
   * @returns If transaction is successful, return. Otherwise, an error details will be thrown
   */
  async addNewMasterNode(address: string): Promise<true> {
    return true;
  }

  /**
   * Change the voting/ranking power/order of a particular masternode.
   * @param address The targeted masternode
   * @param value The xdc value that will be applied to the targeted address. Postive number means increase power, negative means decrease the power
   * @returns If transaction is successful, return. Otherwise, an error details will be thrown
   */
  async changeVote(address: string, value: number): Promise<true> {
    return true;
  }

  /**
   * A event listener on wallet account. If user switch to a different account, this method will update notify the provided handler
   * @param changeHandler The handler function to process when the accounts changed. The provided value will be the new wallet address.
   */
  onAccountChange(changeHandler: (accounts: string) => any) {
    changeHandler("0x3c03a0abac1da8f2f419a59afe1c125f90b506c5");
    // TODO: 1. Handle the account change via accountsChanged
    // TODO: 2. Handle the chain change via chainChanged. This could happen if switch from testnet to mainnet etc.
  }

  /**
   * A method to return subnet candidates and its status.
   * @returns The address and its current status and stake.
   * 'MASTERNODE' means it's one of the mining masternode
   * 'PROPOSED' means it just been proposed, but waiting for have enough vote in order to be the masternode.
   * 'SLASHED' means it's been taken out from the masternode list
   */
  async getCandidates(): Promise<CandidateDetails[]> {
    return [
      {
        address: "xdc25B4CBb9A7AE13feadC3e9F29909833D19D16dE5",
        delegation: 5e+22,
        rank: 0,
        status: "MASTERNODE"
      },
      {
        address: "xdc2af0Cacf84899F504a6dC95e6205547bDfe28c2c",
        delegation: 5e+22,
        rank: 1,
        status: "MASTERNODE"
      },
      {
        address: "xdc30f21E514A66732DA5Dff95340624fa808048601",
        delegation: 5e+22,
        rank: 2,
        status: "MASTERNODE"
      },
      {
        address: "xdc3C03a0aBaC1DA8f2f419a59aFe1c125F90B506c5",
        delegation: 5e+22,
        rank: 3,
        status: "PROPOSED"
      },
      {
        address: "xdc3D9fd0c76BB8B3B4929ca861d167f3e05926CB68",
        delegation: 5e+22,
        rank: 4,
        status: "SLASHED"
      }
    ];
  }
}