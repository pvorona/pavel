import { AnyRecord } from '@pavel/types'
import { doc, getDoc } from 'firebase/firestore'
import { firestore } from '.'
import { fromSnapshot } from './fromSnapshot'

export async function fetchDoc<T extends AnyRecord>(path: string) {
  const ref = doc(firestore, path)
  const documentSnapshot = await getDoc(ref)

  if (!documentSnapshot.exists()) {
    throw new Error(`Document ${ref.path} does not exist`)
  }

  return fromSnapshot<T>(documentSnapshot)
}
