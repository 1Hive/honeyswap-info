import React, { useMemo } from "react";
import styled from "styled-components";
import Panel from "../Panel";
import { AutoColumn } from "../Column";
import { RowFixed } from "../Row";
import { TYPE } from "../../Theme";
import { usePairData } from "../../contexts/PairData";
import { formattedNum } from "../../utils";
import { useNativeCurrencySymbol } from "../../contexts/Network";

const PriceCard = styled(Panel)`
  position: absolute;
  right: -220px;
  width: 220px;
  top: -20px;
  z-index: 9999;
  height: fit-content;
  background-color: ${({ theme }) => theme.bg1};
`;

function formatPercent(rawPercent) {
  if (rawPercent < 0.01) {
    return "<1%";
  } else return parseFloat(rawPercent * 100).toFixed(0) + "%";
}

export default function UniPrice() {
  const daiPair = usePairData("0xa478c2975ab1ea89e8196811f51a7b7ade33eb11");
  const usdcPair = usePairData("0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc");
  const usdtPair = usePairData("0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852");

  const totalLiquidity = useMemo(() => {
    return daiPair && usdcPair && usdtPair
      ? daiPair.trackedReserveUSD +
          usdcPair.trackedReserveUSD +
          usdtPair.trackedReserveUSD
      : 0;
  }, [daiPair, usdcPair, usdtPair]);
  const nativeCurrencySymbol = useNativeCurrencySymbol();

  const daiPerNativeCurrency = daiPair
    ? parseFloat(daiPair.token0Price).toFixed(2)
    : "-";
  const usdcPerNativeCurrency = usdcPair
    ? parseFloat(usdcPair.token0Price).toFixed(2)
    : "-";
  const usdtPerNativeCurrency = usdtPair
    ? parseFloat(usdtPair.token1Price).toFixed(2)
    : "-";

  return (
    <PriceCard>
      <AutoColumn gap="10px">
        <RowFixed>
          <TYPE.main>
            DAI/{nativeCurrencySymbol}:{" "}
            {formattedNum(daiPerNativeCurrency, true)}
          </TYPE.main>
          <TYPE.light style={{ marginLeft: "10px" }}>
            {daiPair && totalLiquidity
              ? formatPercent(daiPair.trackedReserveUSD / totalLiquidity)
              : "-"}
          </TYPE.light>
        </RowFixed>
        <RowFixed>
          <TYPE.main>
            USDC/{nativeCurrencySymbol}:{" "}
            {formattedNum(usdcPerNativeCurrency, true)}
          </TYPE.main>
          <TYPE.light style={{ marginLeft: "10px" }}>
            {usdcPair && totalLiquidity
              ? formatPercent(usdcPair.trackedReserveUSD / totalLiquidity)
              : "-"}
          </TYPE.light>
        </RowFixed>
        <RowFixed>
          <TYPE.main>
            USDT/{nativeCurrencySymbol}:{" "}
            {formattedNum(usdtPerNativeCurrency, true)}
          </TYPE.main>
          <TYPE.light style={{ marginLeft: "10px" }}>
            {usdtPair && totalLiquidity
              ? formatPercent(usdtPair.trackedReserveUSD / totalLiquidity)
              : "-"}
          </TYPE.light>
        </RowFixed>
      </AutoColumn>
    </PriceCard>
  );
}