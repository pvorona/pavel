import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { RecordKey } from '@pavel/types'

export function fromSnapshot<T extends Record<RecordKey, unknown>>(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): T {
  return Object.assign(snapshot.data(), { id: snapshot.id }) as unknown as T
}
