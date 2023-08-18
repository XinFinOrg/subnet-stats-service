import { useEffect, useState } from 'react';

import Button from '@/components/button/Button';
import Card from '@/components/card/Card';
import ErrorState from '@/components/error-state/ErrorState';
import InfoList from '@/components/info-list/InfoList';
import Loader from '@/components/loader/Loader';
import LoginError from '@/pages/management-login-page/components/LoginError';
import { AccountDetails, GrandMasterManager } from '@/services/grandmaster-manager';
import { TableContent } from '@/types/managementLoginPage';
import { formatHash } from '@/utils/formatter';

import type { ErrorTypes, ManagerError } from '@/services/grandmaster-manager/errors';

export default function ManagementLoginPage() {
  const [errorType, setErrorType] = useState<ErrorTypes>();
  const [tableContent, setTableContent] = useState<TableContent | null>();
  const [isLoading, setIsLoading] = useState(true);

  function getContent(accountDetails: AccountDetails): TableContent {
    const { accountAddress, balance, denom, networkId, rpcAddress } = accountDetails;

    const walletInfo = {
      data: [
        { name: 'Wallet Connected:', value: formatHash(accountAddress) },
        { name: 'Current Balance:', value: `${balance} hxdc` },
      ]
    };

    const networkInfo = {
      data: [
        { name: 'Network ID:', value: networkId },
        { name: 'Network Denom:', value: denom },
        { name: 'Network RPC:', value: rpcAddress }
      ]
    };

    return {
      wallet: walletInfo,
      network: networkInfo
    };
  }

  useEffect(() => {
    async function getData() {
      try {
        setIsLoading(true);
        const service = new GrandMasterManager();

        const result = await service?.login();
        if (!result || !service) {
          setTableContent(null);
          return;
        }

        setTableContent(getContent(result));
      } catch (error) {
        setErrorType((error as ManagerError).errorType);
        return;
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (errorType) {
    return <LoginError errorType={errorType} />;
  }

  if (!tableContent) {
    return <ErrorState title='master login' />;
  }

  return (
    <>
      <h1 className='text-xl font-extrabold'>Successfully logged in as the grand master</h1>
      <Card className='mt-8'>
        <div className='grid gap-12 grid-cols-1 md:grid-cols-2'>
          <div className='flex flex-col'>
            <div>
              <InfoList info={tableContent.wallet} noIcon />
            </div>
          </div>
          <div>
            <InfoList info={tableContent.network} noIcon />
          </div>
        </div>
        <div className='border-t border-text-dark-400 col-2 mt-12'>
          <Button colour='secondary' className='mt-6'>Log out</Button>
        </div>
      </Card>
    </>
  );
}