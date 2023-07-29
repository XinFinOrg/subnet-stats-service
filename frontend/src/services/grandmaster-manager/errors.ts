
export interface ManagerError {
  errorType: ErrorTypes;
  errorStatus: number;
  errorMessage?: string;
}

export enum ErrorTypes {
  // Login section
  WALLET_NOT_INSTALLED = "WALLET_NOT_INSTALLED",
  WALLET_NOT_LOGIN = "WALLET_NOT_LOGIN",
  NOT_GRANDMASTER = "NOT_GRANDMASTER",
  // Transaction section
  INVALID_TRANSACTION = "INVALID_TRANSACTION",
  NOT_ENOUGH_BALANCE = "NOT_ENOUGH_BALANCE",
  // Everything else
  INTERNAL_ERROR = "INTERNAL_ERROR"
}