export interface SearchResult {
  inputType: SearchResult.InputType;
  parentChain: SearchResult.Chain;
  subnet: SearchResult.Chain;
  transaction: SearchResult.Transaction;
}

namespace SearchResult {
  export interface Chain {
    blockHash: string;
    blockHeight: string;
    isConfirmed: boolean;
  }

  export interface Transaction {
    from: string;
    to: string;
    gas: number;
    timestamp: number;
  }

  export type InputType = 'BLOCK_HASH' | 'BLOCK_HEIGHT' | 'TRANSACTION_HASH';
}