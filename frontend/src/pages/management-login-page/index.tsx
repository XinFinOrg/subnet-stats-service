import { useAccount, useContractReads } from "wagmi";
import ManagementLoggedInPage from "./ManagementLoggedInPage";
import LoginError from "./components/LoginError";
import { ErrorTypes } from "@/pages/errors";
import { CONTRACT_ADDRESS } from "@/constants/config";
import { useLoaderData } from "react-router-dom";
import { ChainSetting } from "@/main";
import ABI from "../../abi/ABI.json";

export default function LoginPage() {
  const loaderData = useLoaderData() as ChainSetting
  const { isConnected, address } = useAccount();
  const { data: readData0 } = useContractReads({
    contracts: [
      {
        address: CONTRACT_ADDRESS,
        abi: ABI as any,
        functionName: "getGrandMasters",
      },
    ],
  });
  const grandmMasters = readData0?.[0]?.["result"] as any;
  if (isConnected) {
    if (grandmMasters != address) {
      return <LoginError errorType={ErrorTypes.NOT_GRANDMASTER}/>
    }    
    return <ManagementLoggedInPage/>
  } else {
    return <LoginError errorType={ErrorTypes.WALLET_NOT_LOGIN}/>
  }
  
}