import React from "react";
import styled from "styled-components";
import { RowFixed, RowBetween } from "../Row";
import { useMedia } from "react-use";
import {
  useGlobalData,
  useNativeCurrencyPrice,
} from "../../contexts/GlobalData";
import { formattedNum, localNumber } from "../../utils";

import { TYPE } from "../../Theme";
import { useNativeCurrencySymbol } from "../../contexts/Network";

import { useAllPairData } from "../../contexts/PairData";
import { getAddress } from "ethers/utils";

const Header = styled.div`
  width: 100%;
  position: sticky;
  top: 0;
`;

const Medium = styled.span`
  font-weight: 500;
`;

export default function GlobalStats() {
  const below1295 = useMedia("(max-width: 1295px)");
  const below1180 = useMedia("(max-width: 1180px)");
  const below1024 = useMedia("(max-width: 1024px)");
  const below400 = useMedia("(max-width: 400px)");
  const below816 = useMedia("(max-width: 816px)");

  const { oneDayTxns, pairCount } = useGlobalData();
  const nativeCurrencySymbol = useNativeCurrencySymbol();
  const [nativeCurrencyPrice] = useNativeCurrencyPrice();
  const formattedNativeCurrencyPrice = nativeCurrencyPrice
    ? formattedNum(nativeCurrencyPrice, true)
    : "-";

  const wethContract = getAddress("0x7ceb23fd6bc0add59e62ac25578270cff1b9f619");
  const allPair = Object.values(useAllPairData());
  let oneDayFees;

  if (!allPair.length) oneDayFees = "";
  else {
    const unformattedOneDayFees = allPair
      .map((pair) =>
        getAddress(pair.token0.id) === wethContract ||
        getAddress(pair.token1.id) === wethContract
          ? +pair.oneDayVolumeUSD * 0.00125
          : +pair.oneDayVolumeUSD * 0.0025
      )
      .reduce((acum, current) => acum + current);

    oneDayFees = formattedNum(unformattedOneDayFees, true);
  }

  return (
    <Header>
      <RowBetween style={{ padding: below816 ? "0.5rem" : ".5rem" }}>
        <RowFixed>
          {!below400 && (
            <TYPE.main mr={"1rem"} style={{ position: "relative" }}>
              {nativeCurrencySymbol} Price:{" "}
              <Medium>{formattedNativeCurrencyPrice}</Medium>
            </TYPE.main>
          )}

          {!below1180 && (
            <TYPE.main mr={"1rem"}>
              Transactions (24H): <Medium>{localNumber(oneDayTxns)}</Medium>
            </TYPE.main>
          )}
          {!below1024 && (
            <TYPE.main mr={"1rem"}>
              Pairs: <Medium>{localNumber(pairCount)}</Medium>
            </TYPE.main>
          )}
          {!below1295 && (
            <TYPE.main mr={"1rem"}>
              Fees (24H): <Medium>{oneDayFees}</Medium>&nbsp;
            </TYPE.main>
          )}
        </RowFixed>
      </RowBetween>
    </Header>
  );
}
