import Web3 from "web3";
import {
  JsonRpcResponse
} from 'web3-core-helpers';
import { ErrorTypes, ManagerError } from "@/services/grandmaster-manager/errors";
import { networkExtensions, Web3WithExtension } from "@/services/grandmaster-manager/extensions";
import { getSigningMsg } from "@/services/grandmaster-manager/utils";

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
  status: 'MASTERNODE' | 'PROPOSED' | 'SLASHED'
}

type ContractAvailableActions = 'propose' | 'resign' | 'vote' | 'unvote';
interface ContractAvailableActionDetail {
  name: string;
  action: ContractAvailableActions;
}
const contractAvailableActions: {[key in ContractAvailableActions]: ContractAvailableActionDetail} = {
  propose: {
    action: "propose",
    name: "Propose a new masternode"
  },
  resign: {
    action: "resign",
    name: "Resign an existing masternode"
  },
  vote: {
    action: "vote",
    name: "Increase masternode delegation",
  },
  unvote: {
    action: "unvote",
    name: "Decrease masternode delegation",
  }
}


const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000088";

export class GrandMasterManager {
  private web3Client: Web3WithExtension;
  constructor() {
    this.web3Client = new Web3((window as any).ethereum).extend(networkExtensions());
  }
  
  private isXdcWalletInstalled() {
    if (this.web3Client.currentProvider) {
      return true;
    }
    return false;
  }
  
  private async getGrandMasterAccountDetails() {
    const accounts = await this.web3Client.eth.getAccounts();
    if (!accounts || !accounts.length || !accounts[0].length) {
      throw new Error("No wallet address found, have you logged in?");
    }
    const accountAddress = accounts[0];
    const balance = await this.web3Client.eth.getBalance(accountAddress);
    const networkId = await this.web3Client.eth.getChainId();
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
    if (!this.isXdcWalletInstalled) {
      throw new ManagerError("XDC Pay Not Installed", ErrorTypes.WALLET_NOT_INSTALLED)
    }
    
    try {
      const { accountAddress, balance, networkId } = await this.getGrandMasterAccountDetails();
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
  
  private encodeAbi(functionName: ContractAvailableActions, address: string) {
    return this.web3Client.eth.abi.encodeFunctionCall({
      name: functionName,
      type: 'function',
      inputs: [{
          type: 'string',
          name: 'address'
      }]
    }, [address])
  }
  
  private async signTransaction(action: ContractAvailableActionDetail, targetAddress: string, value: string) {
    const { accountAddress, networkId } = await this.getGrandMasterAccountDetails();
    const nonce = await this.web3Client.eth.getTransactionCount(accountAddress);
    const encodedData = this.encodeAbi(action.action, targetAddress);
    const msg = getSigningMsg(action.name, networkId, nonce, encodedData, value);
    const payload = {
      method: "eth_signTypedData_v4",
      params: [accountAddress, msg],
      from: accountAddress
    };
    (this.web3Client.currentProvider as any).sendAsync(payload, (err: any, result: JsonRpcResponse) => {
      if (err) {
        throw err;
      }
      if (result.error) {
        throw new ManagerError("Received error when signing the transaction")
      }
      return result.result;
    })
  }
  /**
   * Propose to add a new masternode for being a mining candidate from the next epoch
   * @param address The master node to be added
   * @returns If transaction is successful, return. Otherwise, an error details will be thrown
   */
  async addNewMasterNode(address: string): Promise<true> {
    const signedTransaction = await this.signTransaction(contractAvailableActions.propose, address, "0x84595161401484a000000");
    
    return true;
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
    (this.web3Client.currentProvider as any).on("accountsChanged", (accounts: string[]) => {
      if (accounts && accounts.length) {
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
    try {
      const { candidates, success } = await this.web3Client.xdcSubnet.getCandidates("latest");
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
      throw new ManagerError(error.message);
    }
  }
}