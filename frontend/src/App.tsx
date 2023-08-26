import { Outlet, useNavigation } from "react-router-dom";

import Alert from "@/components/alert/Alert";
import Loader from "@/components/loader/Loader";
import Nav from "@/components/nav/Nav";
import AlertProvider from "@/contexts/AlertContext";
import ServiceContextProvider from "@/contexts/ServiceContext";
import ThemeContextProvider from "@/contexts/ThemeContext";
import TimeContextProvider from "@/contexts/TimeContext";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import "@rainbow-me/rainbowkit/styles.css";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { Chain, Wallet, connectorsForWallets } from "@rainbow-me/rainbowkit";

export const xdcsubnet = {
  id: 56162,
  name: "XDC Subnet",
  network: "XDC Subnet",
  nativeCurrency: {
    decimals: 18,
    name: "XDC Subnet",
    symbol: "XDC",
  },
  rpcUrls: {
    public: { http: ["https://devnetstats.apothem.network/subnet"] },
    default: { http: ["https://devnetstats.apothem.network/subnet"] },
  },
} as const satisfies Chain;

export interface MyWalletOptions {
  chains: Chain[];
}

export const injectedWallet = ({ chains }: MyWalletOptions): Wallet => ({
  id: "injected",
  name: "XDC Pay",
  iconUrl: async () => (await import("./assets/icon/icon.ico")).default,
  iconBackground: "#fff",
  hidden: ({ wallets }) =>
    wallets.some(
      (wallet) =>
        wallet.installed &&
        wallet.name === wallet.connector.name &&
        (wallet.connector instanceof InjectedConnector ||
          wallet.id === "coinbase")
    ),
  createConnector: () => ({
    connector: new InjectedConnector({
      chains,
    }),
  }),
});
const { chains, publicClient } = configureChains(
  [xdcsubnet],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: "https://devnetstats.apothem.network/subnet",
      }),
    }),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [injectedWallet({ chains })],
  },
]);
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

function App() {
  const navigation = useNavigation();
  const isDesktop = useIsDesktop();

  const rainbowKitConfig = {
    chains: chains,
    showRecentTransactions: true,
    coolMode: true,
  };
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider {...rainbowKitConfig}>
        <TooltipProvider delayDuration={150}>
          <TimeContextProvider>
            <ThemeContextProvider>
              <AlertProvider>
                <ServiceContextProvider>
                  <div
                    className={`
                ${!isDesktop ? "flex-col" : ""}
                relative max-w-[1440px] mx-auto flex font-nunito-sans text-text-dark dark:text-text-white dark:bg-bg-dark-900
              `}
                  >
                    <Nav />
                    <main className="mx-6 my-8 grow llg-w-[1146px] relative">
                      {navigation.state === "loading" ? (
                        <Loader />
                      ) : (
                        <>
                          <Outlet />
                          <Alert />
                        </>
                      )}
                    </main>
                  </div>
                </ServiceContextProvider>
              </AlertProvider>
            </ThemeContextProvider>
          </TimeContextProvider>
        </TooltipProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
