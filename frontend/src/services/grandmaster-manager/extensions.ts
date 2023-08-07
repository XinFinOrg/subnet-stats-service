import { Web3PluginBase } from 'web3';


export class CustomRpcMethodsPlugin extends Web3PluginBase {
  public pluginNamespace = 'xdcSubnet';
  public async getCandidates(epochNum: "latest"): Promise<{
      candidates: {
        [key: string]: {
          capacity: number;
          status: 'MASTERNODE' | 'PROPOSED' | 'SLASHED'
        }
      };
      epoch: number;
      success: boolean;
    } | undefined> {
    return await this.requestManager.send({
      // plugin has access to web3.js internal features like request manager
      method: 'eth_getCandidates',
      params: [epochNum],
    });
  }
}

// Module Augmentation
declare module 'web3' {
  interface Web3Context {
    xdcSubnet: CustomRpcMethodsPlugin;
  }
}