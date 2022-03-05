import { firestore } from '../firebase'
import { addDoc, collection, doc } from 'firebase/firestore'
import { buildOption } from './options.factories'
import { Option } from './types'

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

export async function createOption(data = buildOption()): Promise<Option> {
  const { id } = await addDoc(getOptionsCollectionRef(), data)

  return { ...data, id }
}
