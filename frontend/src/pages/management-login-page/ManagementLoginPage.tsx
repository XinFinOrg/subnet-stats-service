import { useState } from 'react';

import Card from '@/components/card/Card';
import InfoList from '@/components/info-list/InfoList';
import LoginError from '@/pages/management-login-page/components/LoginError';
import { formatHash } from '@/utils/formatter';

export default function ManagementLoginPage() {
  // TODO: Load init state
  const [errorState] = useState(0);

  if (errorState !== 0) {
    return <LoginError errorState={errorState} />;
  }

  const walletInfo = {
    data: [
      { name: 'Wallet Connected:', value: formatHash('0abcdasdfasdfsdfxyz') },
      { name: 'Current Balance:', value: `${'123'} hxdc` },
      { name: 'Redeemable Balance:', value: `${'123'} hxdc` }
    ]
  };

  const networkInfo = {
    data: [
      { name: 'Network ID:', value: 'tXDC' },
      { name: 'Network Denom:', value: 'myCoin' },
      { name: 'Network RPC:', value: 'https:192.168.1.1/443' }
    ]
  };

  return (
    <>
      <h1 className='text-xl font-extrabold'>Successfully logged in as the grand master</h1>
      <Card className='mt-8'>
        <div className='grid gap-12 grid-cols-2'>
          <div className='flex flex-col'>
            <div>
              <InfoList info={walletInfo} noIcon />
            </div>
            <button className='self-end font-bold mt-6 rounded-3xl dark:bg-primary bg-primary-200 py-1.5 px-6'>Redeem</button>
          </div>
          <div>
            <InfoList info={networkInfo} noIcon />
          </div>
        </div>
        <div className='border-t border-text-dark-400 col-2 mt-6'>
          <button className='mt-6 font-bold rounded-3xl dark:bg-bg-dark-600 bg-text-white-300 py-1.5 px-6'>Log out</button>
        </div>
      </Card>
    </>
  );
}