import { twMerge } from "tailwind-merge";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import fillinNetworkGif from "@/assets/fillin-network.gif";
import addNetworkGif from "@/assets/add-network.gif";
import importAccountGif from "@/assets/import-account.gif";
import Card from "@/components/card/Card";
import InfoList from "@/components/info-list/InfoList";
import { ErrorTypes } from "@/pages/errors";


import type { InfoListInfo } from "@/types/info";
import { ChainSetting } from "@/main";
import { rpcUrl } from "@/constants/urls";
interface LoginErrorProps {
  errorType: ErrorTypes;
  chainSetting: ChainSetting;
}

export default function LoginError({ errorType, chainSetting }: LoginErrorProps) {
  return (
    <>
      <h1 className="text-2xl font-extrabold">Login in Portal</h1>
      <ErrorStateCard errorType={errorType} />
      <Card className="mt-8">
        <div className="text-2xl font-bold border-b dark:border-text-dark-600 border-text-white-400 py-4">
          <h2 className="pl-4">How to log in correctly?</h2>
        </div>
        <div className="mt-8 grid gap-6 grid-cols-[repeat(auto-fill,minmax(330px,1fr))]">
          <AddNetworkGif />
          <FillInNetworkGif />
          <ImportAccountGif />
        </div>
        <p className="mt-8 text-xl">
          <b>Metamask</b>
        </p>
        <p className="mt-8 text-xl">
          1. Download the Wallet from <a target="_blank" href="https://metamask.io/download/" style={{color: "blue"}}>Metamask</a> or <a target="_blank" href="https://chrome.google.com/webstore/detail/xdcpay-20/iidmfamdbddcbjmemafekkohbnfiblhp" style={{color: "blue"}}>XDCPay 2.0</a>
        </p>
        <p className="mt-8 text-xl">
          2. Follow wallet instruction to <b>Create new wallet</b>
        </p>
        <p className="mt-8 text-xl">
          3. Click top left network selector button and <b>"Add a network manually"</b>, filling below fields and save:
          <br></br>
          <b>Network name:</b> {chainSetting.networkName}
          <br></br>
          <b>New RPC URL:</b> {rpcUrl}
          <br></br>
          <b>Chain ID:</b> {chainSetting.networkId}
          <br></br>
          <b>Currency symbol:</b> {chainSetting.denom}
        </p>
        <p className="mt-8 text-xl">
          4. Click account selector and select <b>Import account</b>, paste your <b>grandmaster private key</b>
        </p>
        <p className="mt-8 text-xl">
          5. Click the "Connect Wallet" button and click "XDC Pay". Follow the instruction to connect to the site.
        </p>
      </Card>
    </>
  );
}

function AddNetworkGif() {
  return (
    <img
      loading="lazy"
      className="p-5 h-[330px] object-contain"
      width="330"
      height="330"
      src={addNetworkGif}
      alt="placeholder"
    />
  );
}
function FillInNetworkGif() {
  return (
    <img
      loading="lazy"
      className="p-5 h-[330px] object-contain"
      width="330"
      height="330"
      src={fillinNetworkGif}
      alt="placeholder"
    />
  );
}

function ImportAccountGif() {
  return (
    <img
      loading="lazy"
      className="p-5 h-[330px] object-contain"
      width="330"
      height="330"
      src={importAccountGif}
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
