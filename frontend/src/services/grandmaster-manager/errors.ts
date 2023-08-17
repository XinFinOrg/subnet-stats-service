export enum ErrorTypes {
  // Login section
  WALLET_NOT_INSTALLED = "WALLET_NOT_INSTALLED",
  CONFLICT_WITH_METAMASK = "CONFLICT_WITH_METAMASK",
  WALLET_NOT_LOGIN = "WALLET_NOT_LOGIN",
  NOT_GRANDMASTER = "NOT_GRANDMASTER",
  // Transaction section
  INVALID_TRANSACTION = "INVALID_TRANSACTION",
  NOT_ENOUGH_BALANCE = "NOT_ENOUGH_BALANCE",
  USER_DENINED = "USER_DENINED",
  REVERTED_WITH_NO_REASON = "REVERTED_WITH_NO_REASON",
  // Everything else
  INTERNAL_ERROR = "INTERNAL_ERROR"
}

export class ManagerError extends Error {
  errorType: ErrorTypes;
  
  constructor(message?: string, errorType?: ErrorTypes) {
    super(message);
    this.errorType = errorType || ErrorTypes.INTERNAL_ERROR
  }
}