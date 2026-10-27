import type { FetchedV2BlockInfo, MasternodesInfo, NetworkInfo } from './extensions';

// XDPoS RPC responses differ by client: XDPoSChain returns PascalCase keys ("Masternodes") and JSON
// numbers, while Nethermind returns camelCase keys ("masternodes") and hex strings ("0x2b7").
// These formatters map either shape onto the PascalCase/number interfaces the stats service uses.

type RawResult = Record<string, unknown>;

const isObject = (raw: unknown): raw is RawResult => typeof raw === 'object' && raw !== null;

const getField = (raw: RawResult, key: string): unknown => {
  if (key in raw) return raw[key];
  const lowerKey = key.toLowerCase();
  const match = Object.keys(raw).find(k => k.toLowerCase() === lowerKey);
  return match === undefined ? undefined : raw[match];
};

// Number() parses both decimal and "0x" hex strings; missing values stay undefined so the callers'
// presence checks still catch them.
const getNumber = (raw: RawResult, key: string): number | undefined => {
  const value = getField(raw, key);
  return value === undefined || value === null ? undefined : Number(value);
};

export const formatV2BlockInfo = (raw: unknown): FetchedV2BlockInfo => {
  if (!isObject(raw)) return raw as FetchedV2BlockInfo;
  return {
    Committed: getField(raw, 'Committed') as boolean,
    Hash: getField(raw, 'Hash') as string,
    ParentHash: getField(raw, 'ParentHash') as string,
    Number: getNumber(raw, 'Number'),
    Round: getNumber(raw, 'Round'),
    EncodedRLP: getField(raw, 'EncodedRLP') as string,
    Error: getField(raw, 'Error') as string,
    Miner: getField(raw, 'Miner') as string,
    Timestamp: getNumber(raw, 'Timestamp'),
  };
};

export const formatMasternodesInfo = (raw: unknown): MasternodesInfo => {
  if (!isObject(raw)) return raw as MasternodesInfo;
  return {
    Number: getNumber(raw, 'Number'),
    Round: getNumber(raw, 'Round'),
    MasternodesLen: getNumber(raw, 'MasternodesLen'),
    Masternodes: getField(raw, 'Masternodes') as string[],
    PenaltyLen: getNumber(raw, 'PenaltyLen'),
    Penalty: getField(raw, 'Penalty') as string[],
  };
};

export const formatNetworkInfo = (raw: unknown): NetworkInfo => {
  if (!isObject(raw)) return raw as NetworkInfo;
  return {
    NetworkId: getNumber(raw, 'NetworkId'),
    XDCValidatorAddress: getField(raw, 'XDCValidatorAddress') as string,
    Denom: getField(raw, 'Denom') as string,
    NetworkName: getField(raw, 'NetworkName') as string,
  };
};

// XDPoSChain answers XDPoS_getV2BlockBy* for an unknown block with an empty result, Nethermind with an
// "Unknown block" error. Use as a .catch() handler to turn that error into the same empty result.
export const emptyIfUnknownBlock = (error: Error): Partial<FetchedV2BlockInfo> => {
  if (error?.message?.includes('Unknown block')) return {};
  throw error;
};

// web3-core types Method.outputFormatter as `() => void`, but web3 calls it with the RPC result.
export const web3Formatter = (format: (raw: unknown) => unknown) => format as unknown as () => void;
