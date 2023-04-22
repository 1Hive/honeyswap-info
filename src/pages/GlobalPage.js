import React, { useEffect, useState, useMemo } from 'react'
import { withRouter } from 'react-router-dom'
import { Box } from 'rebass'
import styled from 'styled-components'

import { AutoRow, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import PairList from '../components/PairList'
import TopTokenList from '../components/TokenList'
import TxnList from '../components/TxnList'
import GlobalChart from '../components/GlobalChart'
import Search from '../components/Search'
import GlobalStats from '../components/GlobalStats'

import { useGlobalData, useGlobalTransactions } from '../contexts/GlobalData'
import { useAllPairData } from '../contexts/PairData'
import { useMedia } from 'react-use'
import Panel from '../components/Panel'
import { useAllTokenData } from '../contexts/TokenData'
import { formattedNum, formattedPercent, getTokenBySymbol } from '../utils'
import { TYPE, ThemedBackground } from '../Theme'
import { transparentize } from 'polished'
import { CustomLink } from '../components/Link'

import { PageWrapper, ContentWrapper } from '../components'

import { useSelectedNetwork } from '../contexts/Network'
import { NETWORK_COLORS } from '../constants'
import UnitOptions from "../components/UnitOptions"

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

const GridRow = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 6px;
  align-items: start;
  justify-content: space-between;
`

function GlobalPage() {
  // get data for lists and totals
  const allPairs = useAllPairData()
  const allTokens = useAllTokenData()
  const transactions = useGlobalTransactions()
  const { totalLiquidityUSD, oneDayVolumeUSD, volumeChangeUSD, liquidityChangeUSD } = useGlobalData()
  const network = useSelectedNetwork()

  const ethTokenData = useMemo(() => getTokenBySymbol('WETH', allTokens), [allTokens]);

  const [currencySelected, setCurrencySelected] = useState('usd') // 'usd' or 'eth' 

  // breakpoints
  const below800 = useMedia('(max-width: 800px)')

  // scrolling refs

  useEffect(() => {
    document.querySelector('body').scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  const handlePriceUSDETH = (value, options = { showSymbol: true, numericFormat: false }) => {
    if (options?.numericFormat) {
      return value / ethTokenData.priceUSD;
    }
    switch (currencySelected) {
      case 'eth': 
        const num = formattedNum(value / ethTokenData.priceUSD, false);
        return (options?.showSymbol) ? `${num} ETH` : num; 
      case 'usd':
        const showSymbolUsd = options?.showSymbol;
        return formattedNum(value, showSymbolUsd);
      default:
        return value;
    }
  }

  let $liquidityGlobalChart = null;
  if (currencySelected === 'usd') {
    $liquidityGlobalChart = <div key="usd-liquidity"><GlobalChart display="liquidity" /></div>
  } else {
    $liquidityGlobalChart = <div key="eth-liquidity"><GlobalChart display="liquidity" handlePrice={handlePriceUSDETH} showETH={true} /></div>
  }

  let $volumeGlobalChart = null;
  if (currencySelected === 'usd') {
    $volumeGlobalChart = <div key="usd-volume"><GlobalChart display="volume" /></div>
  } else {
    $volumeGlobalChart = <div key="eth-volume"><GlobalChart display="volume" handlePrice={handlePriceUSDETH} showETH={true}/></div>
  }

  return (
    <PageWrapper>
      <ThemedBackground
        backgroundColor={transparentize(0.8, NETWORK_COLORS[network].hex)}
      />
      <ContentWrapper>
        <div>
          <AutoColumn gap="24px" style={{ paddingBottom: below800 ? '0' : '24px' }}>
            <TYPE.largeHeader>{below800 ? 'Protocol Analytics' : 'Honeyswap Protocol Analytics'}</TYPE.largeHeader>
            <Search />
            <GlobalStats />
          </AutoColumn>
          <UnitOptions selected={currencySelected} setSelected={setCurrencySelected} />
          {below800 && ( // mobile card
            <Box mb={20}>
              <Panel>
                <Box>
                  <AutoColumn gap="36px">
                    <AutoColumn gap="20px">
                      <RowBetween>
                        <TYPE.main>Volume (24hrs)</TYPE.main>
                        <div />
                      </RowBetween>
                      <RowBetween align="flex-end">
                        <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
                          {handlePriceUSDETH(oneDayVolumeUSD)}
                        </TYPE.main>
                        <TYPE.main fontSize={12}>{formattedPercent(volumeChangeUSD)}</TYPE.main>
                      </RowBetween>
                    </AutoColumn>
                    <AutoColumn gap="20px">
                      <RowBetween>
                        <TYPE.main>Total Liquidity</TYPE.main>
                        <div />
                      </RowBetween>
                      <RowBetween align="flex-end">
                        <TYPE.main fontSize={'1.5rem'} lineHeight={1} fontWeight={600}>
                          {handlePriceUSDETH(totalLiquidityUSD)}
                        </TYPE.main>
                        <TYPE.main fontSize={12}>{formattedPercent(liquidityChangeUSD)}</TYPE.main>
                      </RowBetween>
                    </AutoColumn>
                  </AutoColumn>
                </Box>
              </Panel>
            </Box>
          )}
          {!below800 && (
            <GridRow>
              <Panel style={{ height: '100%', minHeight: '300px' }}>
                {$liquidityGlobalChart}
              </Panel>
              <Panel style={{ height: '100%' }}>
                {$volumeGlobalChart}
              </Panel>
            </GridRow>
          )}
          {below800 && (
            <AutoColumn style={{ marginTop: '6px' }} gap="24px">
              <Panel style={{ height: '100%', minHeight: '300px' }}>
                {$liquidityGlobalChart}
              </Panel>
            </AutoColumn>
          )}
          <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
            <RowBetween>
              <TYPE.main fontSize={'1.125rem'}>Top Tokens</TYPE.main>
              <CustomLink to={'/tokens'}>See All</CustomLink>
            </RowBetween>
          </ListOptions>
          <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
            <TopTokenList tokens={allTokens} handlePrice={handlePriceUSDETH} />
          </Panel>
          <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
            <RowBetween>
              <TYPE.main fontSize={'1rem'}>Top Pairs</TYPE.main>
              <CustomLink to={'/pairs'}>See All</CustomLink>
            </RowBetween>
          </ListOptions>
          <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
            <PairList pairs={allPairs} handlePrice={handlePriceUSDETH} />
          </Panel>

          <span>
            <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '2rem' }}>
              Transactions
            </TYPE.main>
          </span>
          <Panel style={{ margin: '1rem 0' }}>
            <TxnList transactions={transactions} handlePrice={handlePriceUSDETH}/>
          </Panel>
        </div>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(GlobalPage)
