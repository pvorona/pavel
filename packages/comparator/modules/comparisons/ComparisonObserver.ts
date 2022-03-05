import { getComparisonRef } from '@pavel/comparator-shared'
import { setDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectComparisonById } from './comparisons.selectors'

export function ComparisonObserver({ comparisonId }: { comparisonId: string }) {
  // const dispatch = useDispatch()
  const comparison = useSelector(selectComparisonById(comparisonId))

  // useEffect(() => {
  //   const comparisonReference = doc(db, `ComparisonSets/${comparison.id}`)

  //   return onSnapshot(comparisonReference, {
  //     next: documentSnapshot => {
  //       const parsedComparison = documentSnapshot.data() as ComparisonModel

  //       console.log({ parsedComparison })
  //       if (!isEqual(comparison, parsedComparison)) {
  //         console.log('parsed comparison is not equal, updating local state')
  //         dispatch(addComparison(parsedComparison))
  //       }
  //     },
  //   })
  // }, [dispatch, comparison])

  useEffect(() => {
    // update instead of set
    const comparisonReference = getComparisonRef(comparison.id)

    setDoc(comparisonReference, comparison)
  }, [comparison])

  return null
}
