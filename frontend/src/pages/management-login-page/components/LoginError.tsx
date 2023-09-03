import { twMerge } from "tailwind-merge";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import XDCPlaceholder from "@/assets/xdc-logo.png";
import Card from "@/components/card/Card";
import InfoList from "@/components/info-list/InfoList";
import { ErrorTypes } from "@/pages/errors";


import type { InfoListInfo } from "@/types/info";
interface LoginErrorProps {
  errorType: ErrorTypes;
}

export default function LoginError({ errorType }: LoginErrorProps) {
  return (
    <>
      <h1 className="text-2xl font-extrabold">Login in Portal</h1>
      <ErrorStateCard errorType={errorType} />
      <Card className="mt-8">
        <div className="text-2xl font-bold border-b dark:border-text-dark-600 border-text-white-400 py-4">
          <h2 className="pl-4">How to log in correctly?</h2>
        </div>
        <div className="mt-8 grid gap-6 grid-cols-[repeat(auto-fill,minmax(330px,1fr))]">
          <ImagePlaceholder />
          <ImagePlaceholder />
          <ImagePlaceholder />
        </div>
        <p className="mt-8 text-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
        <p className="mt-8 text-xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </Card>
    </>
  );
}

function ImagePlaceholder() {
  return (
    <img
      loading="lazy"
      className="p-5 h-[330px] object-contain"
      width="330"
      height="330"
      src={XDCPlaceholder}
      alt="placeholder"
    />
  );
}

interface ManagementLoginPageInfoItemProps {
  info: InfoListInfo;
  className?: string;
}

function ManagementLoginPageNetworkInfo({
  className,
  info,
}: ManagementLoginPageInfoItemProps): JSX.Element {
  return (
    <div className={twMerge(className, "w-[300px] mt-8")}>
      <InfoList info={info} noIcon />
    </div>
  );
}

interface ErrorStateCardProps {
  errorType: ErrorTypes;
}

function ErrorStateCard({ errorType }: ErrorStateCardProps) {
  return (
    <Card className="mt-8 text-lg font-extrabold">
      <CardContent errorType={errorType} />
    </Card>
  );
}

interface CardContentProps {
  errorType: ErrorTypes;
}

function CardContent({ errorType }: CardContentProps): JSX.Element {
  switch (errorType) {
    case ErrorTypes.NOT_GRANDMASTER:
      return (
        <>
          Logged in but not Grandmaster. Please switch to the right address for using the management features
        </>
      );

    case ErrorTypes.WALLET_NOT_LOGIN:
      return (
        <>
          <div>Not logged in</div>
          <p className="text-base font-normal">
            Please login via XDC Wallet
          </p>
          <ConnectButton />
        </>
      );
    case ErrorTypes.NOT_ON_THE_RIGHT_NETWORK: // TODO: Add rpc and chainId address
      return (
        <>
          <div>Not logged into the right network</div>
          <p className="text-base font-normal">
            Please consider switch to the right network
          </p>
        </>
      );
  
    default:
      return <>internal error</>;
  }
}
