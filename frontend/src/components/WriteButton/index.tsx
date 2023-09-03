import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

const WriteButton = (props: any) => {
  const addRecentTransaction = useAddRecentTransaction();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { isConnected } = useAccount();

  const { data: tx, write } = useContractWrite({
    ...props?.data,
    onError(error) {
      console.error(error);
      // Notify.failure(error.message);
    },
  });
  const { isSuccess: confirmed, isLoading: confirming } = useWaitForTransaction(
    {
      ...tx,
      onError(error) {
              console.error(error);
        // Notify.failure(error.message);
      },
    }
  );

  useEffect(() => {
    props?.callback?.(confirmed);
  }, [confirmed]);

  return (
    mounted && (
      <>
        {!isConnected && <ConnectButton />}
        {isConnected && (
          <button
            className={
              (props?.disabled || !write || confirming ? "btn-disabled " : "") +
              (confirming
                ? "btn btn-primary loading" + props.className
                : "btn btn-primary" + props.className)
            }
            // disabled={props?.disabled || !write || confirming}
            style={{ minWidth: 112 }}
            onClick={() => {
              write?.();
              if (tx) {
                addRecentTransaction({
                  hash: tx as any,
                  description: props?.buttonName,
                });
              }
            }}
          >
            {confirming ? "confirming" : props?.buttonName}
          </button>
        )}
      </>
    )
  );
};

export default WriteButton;
