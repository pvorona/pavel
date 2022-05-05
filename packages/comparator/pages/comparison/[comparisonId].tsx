import { useDispatch, useSelector } from 'react-redux'
import {
  ComparisonTable,
  addComparison,
  ComparisonObserver,
  selectCurrentComparisonId,
  selectCurrentComparisonOptionIds,
  setCurrentComparisonId,
  addOption,
  OptionsObserver,
  HeaderAuth,
  selectCurrentComparisonName,
} from '../../modules'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import {
  Comparison as ComparisonModel,
  Option,
  fetchDoc,
  getComparisonPath,
  getOptionPath,
} from '@pavel/comparator-shared'
import { useLoadable, isSettled, isFailed } from '@pavel/react-utils'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  AuthAction,
} from 'next-firebase-auth'
import { BackIcon } from '../../modules/BackButton'
import { batch } from '@pavel/redux-slice'

async function loadComparisonAndRelatedData(comparisonId: string) {
  const comparison = await fetchDoc<ComparisonModel>(
    getComparisonPath(comparisonId),
  )
  const options = await Promise.all(
    comparison.optionIds.map(optionId =>
      fetchDoc<Option>(getOptionPath(optionId)),
    ),
  )

  return {
    options,
    comparison,
  }
}

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})()

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ComparisonPageDataLoader)

function ComparisonPageDataLoader() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { comparisonId } = router.query
  const loadData = useMemo(
    () =>
      typeof comparisonId === 'string' && comparisonId
        ? () =>
            loadComparisonAndRelatedData(comparisonId).then(
              ({ options, comparison }) => {
                const actions = [
                  ...options.map(option => addOption(option)),
                  addComparison(comparison),
                  setCurrentComparisonId(comparison.id),
                ]
                const batchAction = batch(actions)

                dispatch(batchAction)
              },
            )
        : false,
    [comparisonId, dispatch],
  )
  const loadable = useLoadable(loadData)

  if (isFailed(loadable)) {
    return <pre>{String(loadable.error)}</pre>
  }

  if (!isSettled(loadable)) {
    return <div>loading</div>
  }

  return <Comparison />
}

export function Comparison() {
  const currentComparisonId = useSelector(selectCurrentComparisonId)
  const optionIds = useSelector(selectCurrentComparisonOptionIds)
  const comparisonName = useSelector(selectCurrentComparisonName)

  return (
    <>
      <OptionsObserver optionIds={optionIds} />
      <ComparisonObserver comparisonId={currentComparisonId} />
      <div className="flex flex-col">
        <div className="px-3 py-4 flex items-center justify-between">
          <div className="font-medium tracking-wider flex items-center">
            <BackIcon /> {comparisonName}
          </div>
          <HeaderAuth />
        </div>
        <ComparisonTable />
      </div>
    </>
  )
}
