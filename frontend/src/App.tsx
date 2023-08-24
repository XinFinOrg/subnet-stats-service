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
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";

import { publicProvider } from "wagmi/providers/public";

import { Chain } from "wagmi";

export const xdcsubnet = {
  id: 8230,
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

const { connectors } = getDefaultWallets({
  appName: "App",
  projectId: "2a612b9a18e81ce3fda2f82787eb6a4a",
  chains,
});
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
