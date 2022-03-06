import { useDispatch, useSelector } from 'react-redux'
import {
  Header,
  ComparisonTable,
  addComparison,
  ComparisonObserver,
  selectCurrentComparisonId,
  selectCurrentComparisonOptionIds,
  setCurrentComparisonId,
  addOption,
  OptionsObserver,
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
import { useLoadable, isSettled, isFailed } from '@pavel/components'

async function loadComparisonAndRelatedData(comparisonId: string) {
  console.log({ comparisonId })

  const comparison = await fetchDoc<ComparisonModel>(
    getComparisonPath(comparisonId),
  )
  const options = await Promise.all(
    comparison.optionIds.map(optionId =>
      fetchDoc<Option>(getOptionPath(optionId)),
    ),
  )

  console.log({
    options,
    comparison,
  })

  return {
    options,
    comparison,
  }
}

export default function ComparisonPageDataLoader() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { comparisonId } = router.query
  const loadData = useMemo(
    () =>
      typeof comparisonId === 'string' && comparisonId
        ? () =>
            loadComparisonAndRelatedData(comparisonId).then(
              ({ options, comparison }) => {
                dispatch([
                  ...options.map(option => addOption(option)),
                  addComparison(comparison),
                  setCurrentComparisonId(comparison.id),
                ])
              },
            )
        : false,
    [comparisonId, dispatch],
  )
  const loadable = useLoadable(loadData)

  if (isFailed(loadable)) {
    return String(loadable.error)
  }

  if (!isSettled(loadable)) {
    return 'Loading page data...'
  }

  return <Comparison />
}

export function Comparison() {
  const currentComparisonId = useSelector(selectCurrentComparisonId)
  const optionIds = useSelector(selectCurrentComparisonOptionIds)

  return (
    <>
      <OptionsObserver optionIds={optionIds} />
      <ComparisonObserver comparisonId={currentComparisonId} />
      <div className="flex flex-col">
        <Header />
        <ComparisonTable />
      </div>
    </>
  )
}
