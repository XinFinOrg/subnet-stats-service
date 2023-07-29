import Button from '@/components/button/Button';
import Card from '@/components/card/Card';
import { Cell } from '@/components/cell/Cell';

export default function ManagementMasterCommitteePage() {
  const tableContent = {
    headers: [{
      id: 'address',
      name: 'Address',
      width: 'w-[50px]'
    }, {
      id: 'delegation',
      name: 'Delegation',
      width: 'w-[100px]'
    },
    {
      id: 'rank',
      name: 'Rank',
      width: 'w-[100px]'
    },
    {
      id: 'status',
      name: 'Status',
      width: 'w-[100px]'
    },
    {
      id: 'actions',
      name: 'Actions',
      width: 'w-[100px]'
    }],
    body: [{
      address: 'xxxx',
      delegation: '123123 xdc',
      rank: 1,
      status: 'active'
    }, {
      address: 'xxxx',
      delegation: '123123 xdc',
      rank: 2,
      status: 'active'
    }]
  };

  return (
    <>
      <h1 className="text-xl font-extrabold">Master Candidate List</h1>
      <Card className='mt-6 flex flex-col'>
        <div className='self-end'>
          <Button colour='primary'>Add a new master candidate</Button>
        </div>
        <table className='dark:bg-bg-dark-800 bg-white sticky top-0'>
          <tr>
            {tableContent.headers.map(header => (
              <Cell className={header.width}>{header.name}</Cell>
            ))}
          </tr>
          {tableContent.body.map(row => (
            <tr className='border-b border-text-white-400/40 dark:border-text-dark-400/40'>
              <Cell>{row.address}</Cell>
              <Cell>{row.delegation}</Cell>
              <Cell>{row.rank}</Cell>
              <Cell>{row.status}</Cell>
              <Cell className='flex'>
                <Button variant='outlined' colour='success' className='px-4'>Promote</Button>
                <Button variant='outlined' colour='warning' className='px-4 ml-2'>Demote</Button>
                <Button variant='outlined' colour='danger' className='px-4 ml-2'>Remove</Button>
              </Cell>
            </tr>
          ))}
        </table>
      </Card>
    </>
  );
}
