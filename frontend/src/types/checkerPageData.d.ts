export interface CheckerPageData {
  status?: number;
  data?: CheckerPageData.Data[];
}

namespace CheckerPageData {
  interface Data {
    value: string;
  }
}