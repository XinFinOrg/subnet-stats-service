import 'reflect-metadata';
import { BlockService } from './block.service';
import { SubnetClient } from '../client/subnet';
import { ParentChainClient } from '../client/parentchain';

// Nethermind's EthStats block events carry no committed block information, so BlockService reads it over RPC.
describe('BlockService.refreshLatestSubnetCommittedBlock', () => {
  const setup = (committed: { hash: string; number: number; round: number }[]) => {
    const getLatestCommittedBlockInfo = jest.fn();
    committed.forEach(c => getLatestCommittedBlockInfo.mockResolvedValueOnce(c));
    const subnetClient = { getLatestCommittedBlockInfo } as unknown as SubnetClient;
    const service = new BlockService(subnetClient, {} as ParentChainClient);
    return { service, getLatestCommittedBlockInfo };
  };

  it('stores the committed block read from the subnet', async () => {
    const { service } = setup([{ hash: '0xc1', number: 97, round: 97 }]);
    await service.refreshLatestSubnetCommittedBlock(100);
    await expect(service.getLastSubnetCommittedBlock()).resolves.toEqual({ hash: '0xc1', number: 97, round: 97 });
  });

  it('reads the committed block once per mined block, however many nodes report it', async () => {
    const { service, getLatestCommittedBlockInfo } = setup([
      { hash: '0xc1', number: 97, round: 97 },
      { hash: '0xc2', number: 98, round: 98 },
    ]);
    await service.refreshLatestSubnetCommittedBlock(100);
    await service.refreshLatestSubnetCommittedBlock(100);
    await service.refreshLatestSubnetCommittedBlock(99);
    await service.refreshLatestSubnetCommittedBlock(101);
    expect(getLatestCommittedBlockInfo).toHaveBeenCalledTimes(2);
    await expect(service.getLastSubnetCommittedBlock()).resolves.toMatchObject({ number: 98 });
  });

  it('passes a failed read to the caller and tries again on the next mined block', async () => {
    const { service, getLatestCommittedBlockInfo } = setup([]);
    getLatestCommittedBlockInfo.mockRejectedValueOnce(new Error('subnet unreachable')).mockResolvedValueOnce({ hash: '0xc2', number: 98, round: 98 });
    await expect(service.refreshLatestSubnetCommittedBlock(100)).rejects.toThrow('subnet unreachable');
    await service.refreshLatestSubnetCommittedBlock(101);
    await expect(service.getLastSubnetCommittedBlock()).resolves.toMatchObject({ number: 98 });
  });

  it('never moves the committed block backwards', async () => {
    const { service } = setup([
      { hash: '0xc2', number: 98, round: 98 },
      { hash: '0xc1', number: 97, round: 97 },
    ]);
    await service.refreshLatestSubnetCommittedBlock(100);
    await service.refreshLatestSubnetCommittedBlock(101);
    await expect(service.getLastSubnetCommittedBlock()).resolves.toMatchObject({ number: 98 });
  });
});
