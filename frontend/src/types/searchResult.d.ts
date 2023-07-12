export interface SearchResult {
  inputType: string;
  parentChain: SearchResult.Chain;
  subnet: SearchResult.Chain;
}

namespace SearchResult {
  interface Chain {
    blockHash: string;
    blockHeight: string;
    isConfirmed: boolean;
  }
}