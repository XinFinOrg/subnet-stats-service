import { useContext, useEffect, useRef, useState } from "react";
import { useAccount, useContractReads } from "wagmi";
import  LoginErrorShort from "../management-login-page/components/LoginErrorShort";
import { ErrorTypes } from "@/pages/errors"
import { ChainSetting } from "@/main";
import { useLoaderData } from "react-router-dom";
import { CONTRACT_ADDRESS } from "@/constants/config";
import ABI from "../../abi/ABI.json";

import Button from "@/components/button/Button";
import Card from "@/components/card/Card";
import { Cell } from "@/components/cell/Cell";
import Dialog, {
  DialogRef,
  DialogResultBase,
} from "@/components/dialog/Dialog";
import ErrorState from "@/components/error-state/ErrorState";
import Loader from "@/components/loader/Loader";
import { ServiceContext } from "@/contexts/ServiceContext";
import AddMasterNodeDialog from "@/pages/management-master-committee-page/components/add-master-node-dialog/AddMasterNodeDialog";
import PromoteDialog from "@/pages/management-master-committee-page/components/promote-dialog/PromoteDialog";
import RemoveMasterNodeDialog from "@/pages/management-master-committee-page/components/remove-master-node-dialog/RemoveMasterNodeDialog";
import { ManagerError } from "@/pages/errors";
import { TableContent } from "@/types/managementMasterCommitteePage";
import { formatHash } from "@/utils/formatter";
import { baseUrl } from '@/constants/urls.ts';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import axios from "axios";

export type CandidateDetailsStatus = 'MASTERNODE' | 'PROPOSED' | 'SLASHED';

export interface CandidateDetails {
  address: string;
  delegation: number;
  status: CandidateDetailsStatus;
}



export default function ManagementMasterCommitteePage() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tableContent, setTableContent] = useState<TableContent | null>();
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );
  const [dialogResult, setDialogResult] = useState<DialogResultBase>();
  const [error, setError] = useState<ManagerError>();

  const service = useContext(ServiceContext);
  const dialogRef = useRef<DialogRef>(null);

  const { isConnected, address } = useAccount();
  const chainSetting = useLoaderData() as ChainSetting

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get<CandidateDetails[]>(`${baseUrl}/information/candidates`);
        if (!data) {
          setTableContent(null);
          return;
        }

        const tableContent: TableContent = {
          headerConfig: [
            {
              id: "address",
              name: "Address",
              width: "w-[220px]",
            },
            {
              id: "delegation",
              name: "Delegation",
              width: "w-[220px]",
            },
            {
              id: "rank",
              name: (
                <Tooltip>
                  <TooltipTrigger>
                    Rank
                    <span className="w-4 h-4 text-xs inline-flex items-center justify-center rounded-full dark:bg-bg-dark-600 bg-bg-white-1000 text-primary dark:text-white md:ml-1.5 ml-1">
                      ?
                    </span>
                  </TooltipTrigger>
                  <TooltipContent
                    sideOffset={10}
                    className="w-[232px] dark:bg-bg-dark-600 bg-white border border-text-white-600 dark:border-none whitespace-normal rounded-3xl text-center shadow-sm py-4 px-3 leading-tight"
                  >
                    <p>
                      The top x master candidates are in the current master
                      committee with equal voting power
                    </p>
                  </TooltipContent>
                </Tooltip>
              ),
              width: "w-[220px]",
            },
            {
              id: "status",
              name: "Status",
              width: "w-[220px]",
            },
            {
              id: "actions",
              name: "Actions",
              width: "w-[100px]",
            },
          ],
          body: data,
        };

        setTableContent(tableContent);
      } catch (error) {
        setError(error as ManagerError);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData(); // Call the asynchronous function to fetch the data
  }, [service]);

  function openDialog(content: React.ReactNode) {
    setDialogContent(content);
    dialogRef.current?.open();
  }

  function handleCloseDialog() {
    dialogRef.current?.close();
  }

  function getDisplayStatus(status: CandidateDetailsStatus): string {
    switch (status) {
      case "MASTERNODE":
        return "Master Node";

      case "PROPOSED":
        return "Candidate";

      case "SLASHED":
        return "Penalty";

      default:
        return "unknown";
    }
  }
  const { data: readData0 } = useContractReads({
    contracts: [
      {
        address: CONTRACT_ADDRESS,
        abi: ABI as any,
        functionName: "getGrandMasters",
      },
    ],
  });

  if (isLoading) {
    return <Loader />;
  }

  if (error?.errorType) {
    return <ErrorState title={`master candidate list - ${error.message}`} />;
  }

  if (!tableContent) {
    return <ErrorState title="master candidate list" />;
  }
  
  const grandmMasters = readData0?.[0]?.["result"] as any;
  if (!isConnected) {
    return <LoginErrorShort errorType={ErrorTypes.WALLET_NOT_LOGIN} chainSetting={chainSetting}/>
  } else {
    
    if (grandmMasters != address) {
      return <LoginErrorShort errorType={ErrorTypes.NOT_GRANDMASTER} chainSetting={chainSetting}/>
    }    
    return (
      <>
        <Dialog
          ref={dialogRef}
          content={dialogContent}
          result={dialogResult}
          setDialogResult={setDialogResult}
        />
        <h1 className="text-xl font-extrabold">Master Candidate List</h1>
        <Card className="mt-6 flex flex-col">
          <div className="self-end">
            <Button
              colour="primary"
              onClick={() =>
                openDialog(
                  <AddMasterNodeDialog
                    closeDialog={handleCloseDialog}
                    setDialogResult={setDialogResult}
                  />
                )
              }
            >
              Add a new master candidate
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="dark:bg-bg-dark-800 bg-white sticky top-0 mt-6 w-full">
              <thead>
                <tr className="border-b border-text-white-400/40 dark:border-text-dark-400/40">
                  {tableContent.headerConfig.map((header) => (
                    <Cell
                      key={header.id}
                      className={`${header.width} whitespace-nowrap`}
                    >
                      {header.name}
                    </Cell>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableContent.body.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-text-white-400/40 dark:border-text-dark-400/40"
                  >
                    <Cell>{formatHash(row.address)}</Cell>
                    <Cell>{row.delegation} xdc</Cell>
                    <Cell>{i + 1}</Cell>
                    <Cell>{getDisplayStatus(row.status)}</Cell>
                    <Cell className="flex">
                      <Button
                        variant="outlined"
                        colour="success"
                        className="px-4"
                        onClick={() =>
                          openDialog(
                            <PromoteDialog
                              closeDialog={handleCloseDialog}
                              data={row}
                              type="promote"
                              setDialogResult={setDialogResult}
                            />
                          )
                        }
                      >
                        Promote
                      </Button>
                      <Button
                        variant="outlined"
                        colour="warning"
                        className="px-4 ml-2"
                        onClick={() =>
                          openDialog(
                            <PromoteDialog
                              closeDialog={handleCloseDialog}
                              data={row}
                              type="demote"
                              setDialogResult={setDialogResult}
                            />
                          )
                        }
                      >
                        Demote
                      </Button>
                      <Button
                        variant="outlined"
                        colour="danger"
                        className="px-4 ml-2"
                        onClick={() =>
                          openDialog(
                            <RemoveMasterNodeDialog
                              closeDialog={handleCloseDialog}
                              address={row.address}
                              setDialogResult={setDialogResult}
                            />
                          )
                        }
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
  }}