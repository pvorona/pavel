import { assertNever } from '@pavel/assert'
import { abs } from '@pavel/utils'
import { Asset, Decision, DecisionMachine, TradeType } from '../types'

export function createStopLossDecisionMachine({
  maxDrawdown,
}: {
  readonly maxDrawdown: number
}): DecisionMachine {
  return {
    next: ({ timestamp, position, rate, capital }) => {
      if (position === undefined) {
        return Decision.DO_NOTHING
      }

      const asset = position.type === TradeType.BUY_BYN ? Asset.BYN : Asset.USD

      const buyPriceOfAssetAtTheTimeOfBuying = (() => {
        if (position.type === TradeType.BUY_USD) {
          return position.rate.buyUSDPrice
        }

        if (position.type === TradeType.BUY_BYN) {
          return position.rate.buyBYNPrice
        }

        assertNever(position.type)
      })()

      const sellPriceOfAssetNow: number = (() => {
        if (asset === Asset.USD) {
          return rate.buyBYNPrice
        }

        if (asset === Asset.BYN) {
          return rate.buyUSDPrice
        }

        assertNever(asset)
      })()

      const assetQuantity: number = (() => {
        if (asset === Asset.USD) {
          return capital.USD
        }

        if (asset === Asset.BYN) {
          return capital.BYN
        }

        assertNever(asset)
      })()

      const valueOfOppositeAssetAtTheTimeOfBuying = (() => {
        if (asset === Asset.USD) {
          return assetQuantity * buyPriceOfAssetAtTheTimeOfBuying
        }

        if (asset === Asset.BYN) {
          return assetQuantity / buyPriceOfAssetAtTheTimeOfBuying
        }

        assertNever(asset)
      })()
      const valueOfOppositeAssetNow = (() => {
        if (asset === Asset.USD) {
          return assetQuantity * sellPriceOfAssetNow
        }

        if (asset === Asset.BYN) {
          return assetQuantity / sellPriceOfAssetNow
        }

        assertNever(asset)
      })()

      const relativeChangeInTheValueOfOppositeAsset =
        valueOfOppositeAssetNow / valueOfOppositeAssetAtTheTimeOfBuying - 1
      const absoluteChangeInValueOfOppositeAsset =
        valueOfOppositeAssetNow - valueOfOppositeAssetAtTheTimeOfBuying

      if (
        relativeChangeInTheValueOfOppositeAsset >= 0 ||
        abs(relativeChangeInTheValueOfOppositeAsset) < maxDrawdown
      ) {
        return Decision.DO_NOTHING
      }

      // console.log(
      //   `Stop loss ${absoluteChangeInValueOfOppositeAsset.toFixed(
      //     1,
      //   )} ${asset} (${relativeChangeInTheValueOfOppositeAsset.toFixed(
      //     2,
      //   )}) on ${new Date(timestamp)}`,
      // )

      if (asset === Asset.USD) {
        return Decision.BUY_BYN
      }

      if (asset === Asset.BYN) {
        return Decision.BUY_USD
      }

      assertNever(asset)
    },
  }
}
