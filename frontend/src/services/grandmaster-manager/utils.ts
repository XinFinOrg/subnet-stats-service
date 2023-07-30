export const getSigningMsg = (name: string, chainId: number, nonce: number, encodedData: string, value: string) => {
  return JSON.stringify({
    domain: {
      chainId: chainId.toString(),
      name,
      // verifyingContract: "0x0000000000000000000000000000000000000088", // To be replaced by the actual sm address
      version: "1"
    },
    message: {
      nonce: Number(nonce),
      gasPrice: 250000000,
      gasLimit: 220000,
      to: '0x0000000000000000000000000000000000000088',
      value,
      data: encodedData,
    },
    primaryType: 'Grandmaster',
    types: {
      // This refers to the domain the contract is hosted on.
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        // { name: 'verifyingContract', type: 'address' },
      ],
      Grandmaster: [
        { name: 'nonce', type: 'uint256' },
        { name: 'gasPrice', type: 'uint256' },
        { name: 'gasLimit', type: 'uint256' },
        { name: 'to', type: 'string' },
        { name: 'value', type: 'string' },
        { name: 'data', type: 'string' },
      ],
    },
  });
}