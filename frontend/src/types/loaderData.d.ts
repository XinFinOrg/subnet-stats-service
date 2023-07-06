export interface LoaderData {
  masterNodes: MasterNodes;
  blocks: Blocks;
  network: Network;
  relayer: Relayer;
}

interface MasterNodes {
  summary: {
    committee: number;
    activeNodes: number;
    /** Number of penalised nodes */
    inActiveNodes: number;
  };
  /** A list of existing master nodes. Sorted by nodeId */
  nodes: MasterNodes.Node[];
}

namespace MasterNodes {
  interface Node {
    address: string;
    type: 'CANDIDATE', 'MASTERNODE', 'PENALTY';
  }
}

interface Blocks {
  /** A list of recently mined blocks. Sorted by block number */
  blocks: Blocks.Block[];
  /** The block that was most recently mined in the subnet. regardless its confirmation status */
  latestMinedBlock: {
    hash: string;
    number: number;
  };
  /** The block that was most recently confirm to be committed in the subnet. (Ignoring its confirmation status from parent chain) */
  latestSubnetCommittedBlock: {
    hash: string;
    number: number;
  };
  /** The block that was most recently confirm to be committed in the parent chain. */
  latestParentChainCommittedBlock: {
    hash: string;
    number: number;
  };
  /** A simple enum to indicate whether the subnet chain is operational. i.e if blocks are mined */
  chainHealth: "UP" | "DOWN";
}

namespace Blocks {
  interface Block {
    /** The subnet block hash */
    hash: string;
    /** The subnet block number */
    number: number;
    /** The subnet block's parentHash */
    parentHash: string;
    /** The masternode address who mined this block */
    miner: string;
    /** This boolean value is to indicate whether this block has been confirmed in the subnet itself */
    committedInSubnet: boolean;
    /** This boolean value is to indicate whether this block has been confirmed in the parent chain smart contract */
    committedInParentChain: boolean;

    timestamp: number;
  }
}

interface Relayer {
  /** The admin/super account information */
  account: {
    /** The super/admin account remaining balance in XDC */
    balance: string;
    /** The wallet address of the account */
    walletAddress: string;
  };
  /** The current gap between audited block in smartcontract (parent chain) and latest minded block in subnet */
  backlog: number;
  contractAddress: string;
  health: {
    /** An enum value to indicate the current relayer status. */
    status: "UP" | "DOWN";
    /** A short description about the current running status when there is an issue. E.g System is running but very low */
    details: string;
  };
}

interface Network {
  subnet: {
    /** block metadata, such as mining frequency */
    block: {
      /** The block mining time per X second. */
      averageBlockTime: number;
      /** The subnet transaction throughput, we only keep track of the last 10 txs and take average per second. */
      txThroughput: number;
    };
  };
  parentChain: {
    /** A string value which is used to identify the target parent chain. It can be a URL, IP address or a name. */
    url: string;
    /** Parent Chain name */
    name: string;
  };
  health: {
    /** An enum value to indicate the current relayer status. */
    status: "UP" | "DOWN";
    /** A short description about the current running status when there is an issue. E.g System is running but very low */
    details: string;
  };
}
