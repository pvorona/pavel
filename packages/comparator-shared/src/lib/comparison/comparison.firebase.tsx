import { firestore } from '../firebase'
import { collection, doc, addDoc } from 'firebase/firestore'
import { buildComparison, buildFeature } from './comparison.factories'
import { createOption } from '../option'

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

export async function createComparison(ownerId: string) {
  const [option1, option2] = await Promise.all([
    createOption(ownerId),
    createOption(ownerId),
  ])

  const comparison = buildComparison({
    ownerId,
    optionIds: [option1.id, option2.id],
    features: [buildFeature()],
  })

  const { id } = await addDoc(getComparisonsCollectionRef(), comparison)

  return { ...comparison, id }
}
