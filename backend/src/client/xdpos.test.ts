import { emptyIfUnknownBlock, formatMasternodesInfo, formatNetworkInfo, formatV2BlockInfo } from './xdpos';

// Responses captured from a mixed subnet: an XDPoSChain node and a Nethermind node answering for the same chain.
const masternodes = [
  '0x4f07c2fb1c42685848ae9d9a6512363010a427ef',
  '0x702e39d66025a2b8c5de9f8bc135abf97e2756c4',
  '0xba69e7a4fdb0d8c76dc3a8b0a231ff4849d68db0',
  '0xc95ca30ab502c64403ee782160e8bee5b1f4fb7f',
];

describe('formatMasternodesInfo', () => {
  const expected = { Number: 695, Round: 695, MasternodesLen: 4, Masternodes: masternodes, PenaltyLen: 0, Penalty: [] as string[] };

  it('reads XDPoSChain PascalCase responses with numeric fields', () => {
    expect(
      formatMasternodesInfo({
        Number: 695,
        Round: 695,
        MasternodesLen: 4,
        Masternodes: masternodes,
        PenaltyLen: 0,
        Penalty: [],
        StandbynodesLen: 0,
        Standbynodes: [],
        Error: null,
      }),
    ).toEqual(expected);
  });

  it('reads Nethermind camelCase responses with hex fields', () => {
    expect(
      formatMasternodesInfo({
        epoch: '0x0',
        number: '0x2b7',
        round: '0x2b7',
        masternodesLen: 4,
        masternodes,
        penaltyLen: 0,
        penalty: [],
        standbynodesLen: 0,
        standbynodes: [],
      }),
    ).toEqual(expected);
  });

  it('keeps penalised nodes from either client', () => {
    expect(formatMasternodesInfo({ Penalty: ['0xaa'], PenaltyLen: 1 })).toMatchObject({ Penalty: ['0xaa'], PenaltyLen: 1 });
    expect(formatMasternodesInfo({ penalty: ['0xaa'], penaltyLen: 1 })).toMatchObject({ Penalty: ['0xaa'], PenaltyLen: 1 });
  });

  it('leaves missing lists undefined', () => {
    expect(formatMasternodesInfo({}).Masternodes).toBeUndefined();
  });

  it('passes null results through unchanged', () => {
    expect(formatMasternodesInfo(null)).toBeNull();
  });
});

describe('formatV2BlockInfo', () => {
  const hash = '0xe2497c71ff68f459dfb57cebded2e08ca79f7ac9bed4b96597884109e13a7637';
  const parentHash = '0x236487d45251937b1b4ee25f906acc5fbaef3009c0c2ac80bcfe6d3806344932';

  it('normalizes both client shapes of the same block', () => {
    const geth = formatV2BlockInfo({
      Hash: hash,
      Round: 729,
      Number: 729,
      ParentHash: parentHash,
      Committed: true,
      Miner: '0x702e39d66025a2b8c5de9f8bc135abf97e2756c4',
      Timestamp: 1793090889,
      EncodedRLP: '+QM6',
      Error: '',
    });
    const nethermind = formatV2BlockInfo({
      hash,
      round: '0x2d9',
      number: '0x2d9',
      parentHash,
      committed: true,
      miner: '0x702e39d66025a2b8c5de9f8bc135abf97e2756c4',
      timestamp: '0x6ae06549',
      encodedRLP: '+QM6',
    });
    expect(nethermind).toEqual({ ...geth, Error: undefined });
    expect(nethermind).toMatchObject({ Number: 729, Round: 729, Committed: true, Timestamp: 1793090889 });
  });

  it('keeps the null Number of an XDPoSChain unknown-hash result falsy, so callers still answer 404', () => {
    const unknown = formatV2BlockInfo({ Hash: hash, Round: 0, Number: null, Committed: false, Error: 'not found' });
    expect(unknown.Number).toBeUndefined();
    expect(unknown.Error).toBe('not found');
  });

  it.each([
    ['decimal number', 729, 729],
    ['hex string', '0x2d9', 729],
    ['decimal string', '729', 729],
    ['zero hex string', '0x0', 0],
  ])('parses Number given as a %s', (_, input, expected) => {
    expect(formatV2BlockInfo({ number: input }).Number).toBe(expected);
  });

  it('matches keys regardless of case and prefers the exact key', () => {
    expect(formatV2BlockInfo({ ENCODEDRLP: 'abc', COMMITTED: false }).EncodedRLP).toBe('abc');
    expect(formatV2BlockInfo({ Hash: '0xexact', hash: '0xother' }).Hash).toBe('0xexact');
  });

  it('passes null results through unchanged', () => {
    expect(formatV2BlockInfo(null)).toBeNull();
  });
});

describe('emptyIfUnknownBlock', () => {
  it("turns Nethermind's unknown-block error into an empty result", () => {
    expect(emptyIfUnknownBlock(new Error('Returned error: Unknown block'))).toEqual({});
  });

  it.each([new Error('Returned error: invalid argument 0'), new Error('CONNECTION ERROR: timeout')])('rethrows other errors: %s', error => {
    expect(() => emptyIfUnknownBlock(error)).toThrow(error);
  });
});

describe('formatNetworkInfo', () => {
  it('normalizes both client shapes', () => {
    const validator = '0x0000000000000000000000000000000000000088';
    expect(formatNetworkInfo({ NetworkId: 28749, XDCValidatorAddress: validator, Denom: 'sdc', NetworkName: 'myxdcsubnet' })).toEqual({
      NetworkId: 28749,
      XDCValidatorAddress: validator,
      Denom: 'sdc',
      NetworkName: 'myxdcsubnet',
    });
    expect(formatNetworkInfo({ networkId: '0x704d', xdcValidatorAddress: validator })).toEqual({
      NetworkId: 28749,
      XDCValidatorAddress: validator,
      Denom: undefined,
      NetworkName: undefined,
    });
  });
});
