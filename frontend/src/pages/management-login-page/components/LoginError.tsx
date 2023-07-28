import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import XDCPlaceholder from '@/assets/xdc.png';
import Card from '@/components/card/Card';
import InfoList from '@/components/info-list/InfoList';

import type { InfoListInfo } from '@/types/info';

interface LoginErrorProps {
  errorState: number;
}

export default function LoginError({ errorState }: LoginErrorProps) {
  const networkInfo = {
    data: [
      { name: 'Network ID:', value: 'tXDC' },
      { name: 'Network Denom:', value: 'myCoin' },
      { name: 'Network RPC:', value: 'https:192.168.1.1/443' }
    ]
  };

  return (
    <>
      <h1 className='text-2xl font-extrabold'>Login in Portal</h1>
      <ErrorStateCard errorState={errorState} />
      <Card className='mt-8'>
        <div className='text-2xl font-bold border-b dark:border-text-dark-600 border-text-white-600 py-4'>
          <h2 className='pl-4'>How to Log In correctly?</h2>
        </div>
        <div className='mt-8 grid gap-6 grid-cols-[repeat(auto-fill,minmax(330px,1fr))]'>
          <ImagePlaceholder />
          <ImagePlaceholder />
          <ImagePlaceholder />
        </div>
        <p className='mt-8 text-xl'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <ManagementLoginPageNetworkInfo info={networkInfo} />
        <p className='mt-8 text-xl'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Card>
    </>
  );
}

function ImagePlaceholder() {
  return (
    <img loading='lazy' className='p-5' width='330' height='330' src={XDCPlaceholder} alt='placeholder' />
  );
}

interface ManagementLoginPageInfoItemProps {
  info: InfoListInfo;
  className?: string;
}

function ManagementLoginPageNetworkInfo({ className, info }: ManagementLoginPageInfoItemProps) {
  return (
    <div className={twMerge(className, 'w-[300px] mt-8')}>
      <InfoList info={info} noIcon />
    </div>
  );
}

interface ErrorStateCardProps {
  errorState: number;
}

function ErrorStateCard({ errorState }: ErrorStateCardProps) {
  // TODO:
  errorState;

  return (
    <Card className='mt-8 text-lg'>
      Metamask not installed. Please
      <NavLink className='dark:bg-primary bg-primary-300 rounded-3xl px-2 py-[2px] mx-1' to={'/installMetaMask'}>click here</NavLink>
      to install Metamask, and then follow the instructions below to login
    </Card>
  );
}