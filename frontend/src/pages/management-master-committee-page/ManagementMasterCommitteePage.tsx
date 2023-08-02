import { useRef, useState } from 'react';

import Button from '@/components/button/Button';
import Card from '@/components/card/Card';
import { Cell } from '@/components/cell/Cell';
import Dialog, { DialogRef, DialogResultBase } from '@/components/dialog/Dialog';
import PromoteDialog from '@/pages/management-master-committee-page/components/promote-dialog/PromoteDialog';
import { formatHash } from '@/utils/formatter';

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
      address: '0x00000000000000000000abcdwtdf',
      delegation: 123123,
      rank: 1,
      status: 'active'
    }, {
      address: '0x00000000000000000000abcdwtdg',
      delegation: 123123,
      rank: 2,
      status: 'active'
    }]
  };

  const dialogRef = useRef<DialogRef>(null);
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(null);
  const [dialogResult, setDialogResult] = useState<DialogResultBase>();

  function handleOpenDialog(content: React.ReactNode) {
    setDialogContent(content);
    dialogRef.current?.open();
  }

  function handleCloseDialog() {
    dialogRef.current?.close();
  }

  return (
    <>
      <Dialog ref={dialogRef} content={dialogContent} result={dialogResult} setDialogResult={setDialogResult} />
      <h1 className="text-xl font-extrabold">Master Candidate List</h1>
      <Card className='mt-6 flex flex-col'>
        <div className='self-end'>
          <Button colour='primary'>Add a new master candidate</Button>
        </div>
        <table className='dark:bg-bg-dark-800 bg-white sticky top-0'>
          <thead>
            <tr>
              {tableContent.headers.map(header => (
                <Cell key={header.id} className={header.width}>{header.name}</Cell>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableContent.body.map((row, i) => (
              <tr key={i} className='border-b border-text-white-400/40 dark:border-text-dark-400/40'>
                <Cell>{formatHash(row.address)}</Cell>
                <Cell>{row.delegation} xdc</Cell>
                <Cell>{row.rank}</Cell>
                <Cell>{row.status}</Cell>
                <Cell className='flex'>
                  <Button variant='outlined' colour='success' className='px-4' onClick={() => handleOpenDialog(<PromoteDialog closeDialog={handleCloseDialog} data={row} title='Promote via increasing delegation' setDialogResult={setDialogResult} />)}>Promote</Button>
                  <Button variant='outlined' colour='warning' className='px-4 ml-2'>Demote</Button>
                  <Button variant='outlined' colour='danger' className='px-4 ml-2'>Remove</Button>
                </Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
