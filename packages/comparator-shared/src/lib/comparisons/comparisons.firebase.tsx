import { firestore } from '../firebase'
import { collection, doc, addDoc } from 'firebase/firestore'
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

export async function createComparison() {
  const [option1, option2] = await Promise.all([createOption(), createOption()])

  const comparison = buildComparison({
    optionIds: [option1.id, option2.id],
    features: [buildFeature()],
  })

  return addDoc(getComparisonsCollectionRef(), comparison)
}
