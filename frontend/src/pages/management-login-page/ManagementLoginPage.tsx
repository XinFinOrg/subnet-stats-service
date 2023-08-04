import { useContext, useEffect, useState } from 'react';

import Button from '@/components/button/Button';
import Card from '@/components/card/Card';
import ErrorState from '@/components/error-state/ErrorState';
import InfoList from '@/components/info-list/InfoList';
import { ServiceContext } from '@/contexts/ServiceContext';
import LoginError from '@/pages/management-login-page/components/LoginError';
import { AccountDetails } from '@/services/grandmaster-manager';
import { TableContent } from '@/types/managementLoginPage';
import { formatHash } from '@/utils/formatter';

import type { ErrorTypes, ManagerError } from '@/services/grandmaster-manager/errors';

function isError(result: AccountDetails | ManagerError): result is ManagerError {
  return 'errorType' in (result as ManagerError);
}

export default function ManagementLoginPage() {
  const [errorType, setErrorType] = useState<ErrorTypes>();
  const [tableContent, setTableContent] = useState<TableContent | null>();
  const service = useContext(ServiceContext);

  function getContent(accountDetails: AccountDetails): TableContent {
    const { accountAddress, balance, denom, networkId, rpcAddress } = accountDetails;

    const walletInfo = {
      data: [
        { name: 'Wallet Connected:', value: formatHash(accountAddress) },
        { name: 'Current Balance:', value: `${balance} hxdc` },
        { name: 'Redeemable Balance:', value: `${'unknown'} hxdc` }
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
      const result = await service?.login();

      if (!result) {
        setTableContent(null);
        return;
      }

      if (isError(result)) {
        setErrorType(result.errorType)
        return;
      }

      setTableContent(getContent(result));
    }

    getData();
  }, [service]);

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
            <Button colour='primary' className='self-end mt-6'>Redeem</Button>
          </div>
          <div>
            <InfoList info={tableContent.network} noIcon />
          </div>
        </div>
        <div className='border-t border-text-dark-400 col-2 mt-6'>
          <Button colour='secondary' className='mt-6'>Log out</Button>
        </div>
      </Card>
    </>
  );
}