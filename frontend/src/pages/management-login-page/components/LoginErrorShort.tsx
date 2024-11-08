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


export default function LoginErrorShort({ errorType, chainSetting }: LoginErrorProps) {
  return (
    <>
      <h1 className="text-2xl font-extrabold">Master Candidate List</h1>
      <ErrorStateCard errorType={errorType} />
    </>
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
