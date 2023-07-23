import Web3 from "web3";
import { ManagerError } from "./errors";

interface AccountDetails {
  accountAddress: string;
  balance: string;
  chainId: number;
}


export class GrandMasterManager {
  private web3Client;
  constructor() {
    const win = window as any;
    this.web3Client = new Web3(win.xdc ? win.xdc : win.ethereum);
  }
  
  /**
   * * This method will detect XDC-Pay and verify if customer has alraedy loggin.
   * @returns Account details will be returned if all good, otherwise, relevant error message and type will be returned such as WALLET_NOT_LOGIN
   */
  login(): AccountDetails | ManagerError {
    return {
      accountAddress: "xdc888c073313b36cf03cf1f739f39443551ff12bbe",
      balance: "123",
      chainId: 551
    }
  }
  
  /**
   * Remove a masternode from the manager view list
   * @param address The master node to be removed
   * @returns If transaction is successful, return. Otherwise, an error details will be returned
   */
  removeMasterNode(address: string): true | ManagerError {
    return true;
  }
  
  /**
   * Propose to add a new masternode for being a mining candidate from the next epoch
   * @param address The master node to be added
   * @returns If transaction is successful, return. Otherwise, an error details will be returned
   */
  addNewMasterNode(address: string): true | ManagerError {
    return true;
  }
  
  /**
   * Change the voting/ranking power/order of a particular masternode.
   * @param address The targeted masternode
   * @param value The xdc value that will be applied to the targeted address. Postive number means increase power, negative means decrease the power
   * @returns If transaction is successful, return. Otherwise, an error details will be returned
   */
  changeVote(address: string, value: number): true | ManagerError {
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
  
}

