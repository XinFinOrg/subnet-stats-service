export interface SearchResult {
  status?: number;
  data?: SearchResult.Data[];
}

namespace SearchResult {
  interface Data {
    value: string;
  }
}