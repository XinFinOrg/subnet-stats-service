import { useEffect, useRef, useState } from 'react';

import Button from '@/components/button/Button';
import Card from '@/components/card/Card';
import { Cell } from '@/components/cell/Cell';
import Dialog, { DialogRef, DialogResultBase } from '@/components/dialog/Dialog';
import ErrorState from '@/components/error-state/ErrorState';
import Loader from '@/components/loader/Loader';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/tooltip/Tooltip';
import AddMasterNodeDialog from '@/pages/management-master-committee-page/components/add-master-node-dialog/AddMasterNodeDialog';
import PromoteDialog from '@/pages/management-master-committee-page/components/promote-dialog/PromoteDialog';
import RemoveMasterNodeDialog from '@/pages/management-master-committee-page/components/remove-master-node-dialog/RemoveMasterNodeDialog';
import { CandidateDetailsStatus, GrandMasterManager } from '@/services/grandmaster-manager';
import { ManagerError } from '@/services/grandmaster-manager/errors';
import { TableContent } from '@/types/managementMasterCommitteePage';
import { formatHash } from '@/utils/formatter';

export default function ManagementMasterCommitteePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableContent, setTableContent] = useState<TableContent | null>();
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(null);
  const [dialogResult, setDialogResult] = useState<DialogResultBase>();
  const [error, setError] = useState<ManagerError>();

  const dialogRef = useRef<DialogRef>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const service = new GrandMasterManager();
        const candidates = await service?.getCandidates();

        if (!candidates) {
          setTableContent(null);
          return;
        }

        const tableContent: TableContent = {
          headerConfig: [{
            id: 'address',
            name: 'Address',
            width: 'w-[220px]'
          }, {
            id: 'delegation',
            name: (
              <Tooltip>
                <TooltipTrigger withQuestionMark>Delegation</TooltipTrigger>
                <TooltipContent>
                  <p>The number is rounded down to 6 decimal places</p>
                </TooltipContent>
              </Tooltip>
            ),
            width: 'w-[220px]'
          }, {
            id: 'rank',
            name: (
              <Tooltip>
                <TooltipTrigger withQuestionMark>Rank</TooltipTrigger>
                <TooltipContent>
                  <p>The top x master candidates are in the current master committee with equal voting power</p>
                </TooltipContent>
              </Tooltip>
            ),
            width: 'w-[220px]'
          },
          {
            id: 'status',
            name: 'Status', width: 'w-[220px]'
          },
          {
            id: 'actions',
            name: 'Actions',
            width: 'w-[100px]'
          }],
          body: candidates
        };

        setTableContent(tableContent);
      } catch (error) {
        setError(error as ManagerError);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData(); // Call the asynchronous function to fetch the data
  }, []);

  function openDialog(content: React.ReactNode) {
    setDialogContent(content);
    dialogRef.current?.open();
  }

  function handleCloseDialog() {
    dialogRef.current?.close();
  }

  function getDisplayStatus(status: CandidateDetailsStatus): string {
    switch (status) {
      case 'MASTERNODE':
        return 'Master Node';

      case 'PROPOSED':
        return 'Candidate';

      case 'SLASHED':
        return 'Penalty';

      default:
        return 'unknown';
    }
  }

  if (isLoading) {
    return (
      <Loader />
    );
  }

  if (error?.errorType) {
    return (
      <ErrorState isPage title={`master candidate list - ${error.message}`} />
    );
  }

  if (!tableContent) {
    return (
      <ErrorState title='master candidate list' />
    );
  }

  return (
    <>
      <Dialog ref={dialogRef} content={dialogContent} result={dialogResult} setDialogResult={setDialogResult} />
      <h1 className="text-xl font-extrabold">Master Candidate List</h1>
      <Card className='mt-6 flex flex-col'>
        <div className='self-end'>
          <Button
            colour='primary'
            onClick={() => openDialog(<AddMasterNodeDialog closeDialog={handleCloseDialog} setDialogResult={setDialogResult} />)}
          >
            Add a new master candidate
          </Button>
        </div>
        <div className='overflow-x-auto'>
          <table className='dark:bg-bg-dark-800 bg-white sticky top-0 mt-6 w-full'>
            <thead>
              <tr className='border-b border-text-white-400/40 dark:border-text-dark-400/40'>
                {tableContent.headerConfig.map(header => (
                  <Cell key={header.id} className={`${header.width} whitespace-nowrap`}>{header.name}</Cell>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableContent.body.map((row, i) => (
                <tr key={i} className='border-b border-text-white-400/40 dark:border-text-dark-400/40'>
                  <Cell>{formatHash(row.address)}</Cell>
                  <Cell>{row.delegation} xdc</Cell>
                  <Cell>{i + 1}</Cell>
                  <Cell>{getDisplayStatus(row.status)}</Cell>
                  <Cell className='flex'>
                    <Button
                      variant='outlined'
                      colour='success'
                      className='px-4'
                      onClick={() => openDialog(<PromoteDialog closeDialog={handleCloseDialog} data={row} type='promote' setDialogResult={setDialogResult} />)}
                    >
                      Promote
                    </Button>
                    <Button
                      variant='outlined'
                      colour='warning'
                      className='px-4 ml-2'
                      onClick={() => openDialog(<PromoteDialog closeDialog={handleCloseDialog} data={row} type='demote' setDialogResult={setDialogResult} />)}
                    >
                      Demote
                    </Button>
                    <Button
                      variant='outlined'
                      colour='danger'
                      className='px-4 ml-2'
                      onClick={() => openDialog(<RemoveMasterNodeDialog closeDialog={handleCloseDialog} address={row.address} setDialogResult={setDialogResult} />)}
                    >
                      Remove
                    </Button>
                  </Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
