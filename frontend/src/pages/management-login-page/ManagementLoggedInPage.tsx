import { useContext, useEffect, useState } from "react";
import Card from "@/components/card/Card";
import ErrorState from "@/components/error-state/ErrorState";
import InfoList from "@/components/info-list/InfoList";
import Loader from "@/components/loader/Loader";
import LoginError from "@/pages/management-login-page/components/LoginError";
import { formatHash } from "@/utils/formatter";
import { useAccount, useBalance, useNetwork } from "wagmi";
import type {
  ErrorTypes,
  ManagerError,
} from "@/pages/errors";

export default function ManagementLoggedInPage() {
  const [errorType, setErrorType] = useState<ErrorTypes>();

  const [isLoading, setIsLoading] = useState(true);

  const { address } = useAccount();
  const { data: balance } = useBalance({ address: address });
  const network = useNetwork();

  const walletInfo = {
    data: [
      { name: "Wallet Connected:", value: formatHash(address as any) },
      {
        name: "Current Balance:",
        value: `${(balance?.formatted as any) / 1} hxdc`,
      },
    ],
  };

  const networkInfo = {
    data: [
      { name: "Network ID:", value: network.chain?.id },
      { name: "Network Denom:", value: network.chain?.name },
      { name: "Network RPC:", value: network.chain?.rpcUrls.default.http },
    ],
  };
  
  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (errorType) {
    return <LoginError errorType={errorType} />;
  }

  if (!address) {
    return <ErrorState title="master login" />;
  }
  // TODO: Check if address is the grandmaster
  return (
    <>
      <h1 className="text-xl font-extrabold">
        Successfully logged in as the grand master
      </h1>
      <Card className="mt-8">
        <div className="grid gap-12 grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col">
            <div>
              <InfoList info={walletInfo} noIcon />
            </div>
          </div>
          <div>
            <InfoList info={networkInfo as any} noIcon />
          </div>
        </div>
      </Card>
    </>
  );
}
