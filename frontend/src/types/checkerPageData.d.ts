export interface CheckerPageData {
  status?: number;
  data?: CheckerPageData.Data[];
}

namespace CheckerPageData {
  export interface Data {
    value: string;
  }
}