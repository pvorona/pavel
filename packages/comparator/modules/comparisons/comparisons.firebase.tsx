import { firestore } from '../firebase'
import { collection, doc, setDoc, addDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectComparisonById } from './comparisons.selectors'
import { buildComparison, buildFeature } from './comparisons.factories'
import { createOption } from '../options'

const COMPARISONS_PATH = 'ComparisonSets'

export function getComparisonPath(id: string) {
  return `${COMPARISONS_PATH}/${id}`
}

export function getComparisonRef(id: string) {
  return doc(firestore, getComparisonPath(id))
}

export function getComparisonsCollectionRef() {
  return collection(firestore, COMPARISONS_PATH)
}

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

export async function createComparison() {
  const [option1, option2] = await Promise.all([createOption(), createOption()])

  const comparison = buildComparison({
    optionIds: [option1.id, option2.id],
    features: [buildFeature()],
  })

  return addDoc(getComparisonsCollectionRef(), comparison)
}
