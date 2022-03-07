import { firestore } from '../firebase'
import { addDoc, collection, doc } from 'firebase/firestore'
import { buildOption } from './option.factories'
import { Option } from './option.types'

const OPTIONS_PATH = 'Options'

export function getOptionPath(id: string) {
  return `${OPTIONS_PATH}/${id}`
}

export function getOptionRef(id: string) {
  return doc(firestore, getOptionPath(id))
}

export function getOptionsCollectionRef() {
  return collection(firestore, OPTIONS_PATH)
}

export async function createOption(ownerId: string): Promise<Option> {
  const option = buildOption({ ownerId })
  const { id } = await addDoc(getOptionsCollectionRef(), option)

  return { ...option, id }
}
