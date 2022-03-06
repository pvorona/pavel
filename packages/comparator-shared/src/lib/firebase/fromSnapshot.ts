import { DocumentSnapshot } from 'firebase/firestore'
import { AnyRecord } from '@pavel/types'

export function fromSnapshot<T extends AnyRecord>(
  snapshot: DocumentSnapshot,
): T {
  return Object.assign(snapshot.data(), { id: snapshot.id }) as unknown as T
}
