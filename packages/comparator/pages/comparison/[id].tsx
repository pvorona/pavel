// import { initNewComparison } from '../../modules/comparisons'
import { useDispatch, useSelector } from 'react-redux'
import { Header } from './Header'
import { ComparisonTable } from './ComparisonTable'
import { DocumentData, getDoc, QueryDocumentSnapshot } from 'firebase/firestore'
import {
  addComparison,
  ComparisonObserver,
  selectCurrentComparisonId,
  selectCurrentComparisonOptionIds,
  setCurrentComparisonId,
} from '../../modules/comparisons'
import { addOption, OptionsObserver } from '../../modules/options'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { RecordKey } from '@pavel/types'
import {
  Comparison as ComparisonModel,
  getComparisonRef,
  getOptionRef,
  Option,
} from '@pavel/comparator-shared'

type LoadingState = 'idle' | 'loading' | 'completed' | 'failed'

function fromSnapshot<T extends Record<RecordKey, unknown>>(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): T {
  return Object.assign(snapshot.data(), { id: snapshot.id }) as unknown as T
}

export default function ComparisonPageWrapper() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { id: currentComparisonId } = router.query
  const [loadingState, setLoadingState] = useState<LoadingState>('idle')
  const [comparisonExists, setComparisonExists] = useState(false)

  useEffect(() => {
    if (!currentComparisonId) {
      return
    }

    async function loadPageData() {
      try {
        const comparisonSnapshot = await getDoc(
          getComparisonRef(String(currentComparisonId)),
        )

        if (!comparisonSnapshot.exists()) {
          setLoadingState('failed')

          return
        }

        setComparisonExists(true)

        const comparison = fromSnapshot<ComparisonModel>(comparisonSnapshot)
        const optionsSnapshots = await Promise.all(
          comparison.optionIds.map(optionId => getDoc(getOptionRef(optionId))),
        )
        // Handle option doesn't exist or empty
        const options = optionsSnapshots.map(optionsSnapshot =>
          fromSnapshot<Option>(optionsSnapshot),
        )

        console.log({
          options,
          comparison,
        })

        options.forEach(option => {
          dispatch(addOption(option))
        })

        dispatch(addComparison(comparison))
        dispatch(setCurrentComparisonId(comparison.id))
        setLoadingState('completed')
      } catch (e) {
        console.error('Error fetching documents:', e)
        setLoadingState('failed')
      }
    }

    loadPageData()
  }, [currentComparisonId, dispatch])

  if (!['completed', 'failed'].includes(loadingState)) {
    return 'Loading page data...'
  }

  if (!comparisonExists) {
    return `Comparison ${currentComparisonId} does not exist`
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
