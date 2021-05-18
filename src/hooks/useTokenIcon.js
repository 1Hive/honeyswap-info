import { useEffect, useState } from "react";
import { SupportedNetwork } from "../constants";
import { useSelectedNetwork } from "../contexts/Network";

const CACHE = {
  // [SupportedNetwork.MAINNET]: {},
  [SupportedNetwork.XDAI]: {},
  [SupportedNetwork.MATIC]: {},
};

async function getTokenLogo(network, address) {
  if (Object.values(SupportedNetwork).indexOf(network) < 0) {
    console.warn(`could not fetch token logos for network ${network}`);
  }
  if (Object.keys(CACHE[network]).length === 0) {
    let tokenListURL = "";
    // if (network === SupportedNetwork.MAINNET) {
    //   tokenListURL = "https://tokens.coingecko.com/uniswap/all.json"; // coingecko list used for mainnet
    // }
    if (network === SupportedNetwork.XDAI) {
      tokenListURL = "https://tokens.honeyswap.org"; // honeyswap list used for xdai
    } else {
      tokenListURL =
        "https://unpkg.com/quickswap-default-token-list@latest/build/quickswap-default.tokenlist.json";
    }
    const response = await fetch(tokenListURL);
    if (!response.ok) {
      console.warn(`could not fetch token list at ${tokenListURL}`);
      return;
    }
    const { tokens } = await response.json();
    CACHE[network] = tokens.reduce((cache, token) => {
      cache[token.address.toLowerCase()] = token.logoURI;
      return cache;
    }, {});
  }
  return CACHE[network][address.toLowerCase()];
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useTokenIcon(address) {
  const selectedNetwork = useSelectedNetwork();
  const [uri, setUri] = useState();

  useEffect(() => {
    async function fetchTokenLogo() {
      if (!address) return undefined;
      setUri(await getTokenLogo(selectedNetwork, address.toLowerCase()));
    }
    fetchTokenLogo();
  }, [selectedNetwork, address]);

  return uri;
}
