import { CandidateDetails } from '@/services/grandmaster-manager';

export interface TableContent {
  headerConfig: TableContent.Header.Config[];
  body: CandidateDetails[];
}

export namespace TableContent {
  export namespace Header {
    export interface Config {
      id: string;
      name: string;
      width: string;
    }
  }
}

