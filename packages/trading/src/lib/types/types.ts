import { ExternalMarker } from '@pavel/chart'

export enum Asset {
  USD = 'USD',
  BYN = 'BYN',
}

export type Capital = {
  readonly USD: number
  readonly BYN: number
}

export type ExchangeRate = {
  readonly buyUSDPrice: number
  readonly buyBYNPrice: number
}

export type Exchange = {
  readonly buyUSD: (capital: Capital, rate: ExchangeRate) => Capital
  readonly buyBYN: (capital: Capital, rate: ExchangeRate) => Capital
}

export type TradeStatistics = {
  readonly getAbsoluteChange: () => Capital
  readonly getRelativeChange: () => Capital
  readonly getAverageAnnualAbsoluteChange: () => number
  readonly getAverageAnnualRelativeChange: () => number
}

export type TradeHistory = {
  readonly getTrades: () => readonly Trade[]
  readonly getStatistics: () => TradeStatistics
}

export enum TradeType {
  BUY_USD='BUY_USD',
  BUY_BYN='BUY_BYN',
}

export type Trade = {
  readonly type: TradeType
  readonly timestamp: number
  readonly capital: Capital
  readonly rate: ExchangeRate
}

export type Strategy = {
  readonly next: (timestamp: number, rate: ExchangeRate) => Capital
  readonly getCapital: () => Capital
  readonly getHistory: () => readonly Trade[]
  readonly getMarkers: () => readonly ExternalMarker[]
}

export enum Decision {
  DO_NOTHING,
  BUY_USD,
  BUY_BYN,
}

export type DecisionMachine = {
  readonly next: (state: {
    timestamp: number
    rate: ExchangeRate
    capital: Capital
    position: Trade | undefined
  }) => Decision
}

export type Position = {
  open: Trade
  close: Trade
}

// export type Verifier = (data, strategy: Strategy) => TradeHistory
