export interface SearchResult {
  status: number;
  statusText?: string;
  data?: {
    inputType: string;
    parentChain: SearchResult.Chain;
    subnet: SearchResult.Chain;
  }
}

namespace SearchResult {
  interface Chain {
    blockHash: string;
    blockHeight: string;
    isConfirmed: boolean;
  }
}