import { initializeApp } from 'firebase/app'
import {
  FirestoreError,
  getFirestore,
  onSnapshot,
  runTransaction,
  setDoc,
} from 'firebase/firestore'
import { AnyRecord } from '@pavel/types'
import { collection, doc, getDoc, DocumentSnapshot } from 'firebase/firestore'
import { DEFAULT_TREE } from './tree.constants'
import { MindMapNode } from './tree.types'

const firebaseConfig = {
  apiKey: 'AIzaSyAcCrEUxCJ2z9o9LH4WpgQVtpZz18L99_E',
  authDomain: 'comparator-342612.firebaseapp.com',
  projectId: 'comparator-342612',
  storageBucket: 'comparator-342612.appspot.com',
  messagingSenderId: '89512111902',
  appId: '1:89512111902:web:57bac28d6f19b5fd05a30f',
}

export const app = initializeApp(firebaseConfig)

export const firestore = getFirestore()

export function fromSnapshot<T extends AnyRecord>(
  snapshot: DocumentSnapshot,
): T {
  return snapshot.data() as unknown as T
}

export async function fetchDoc<T extends AnyRecord>(path: string) {
  const ref = doc(firestore, path)
  const documentSnapshot = await getDoc(ref)

  if (!documentSnapshot.exists()) {
    throw new Error(`Document ${ref.path} does not exist`)
  }

  return fromSnapshot<T>(documentSnapshot)
}

const TREE_PATH = 'MindMaps'

export function getTreePath(id: string) {
  return `${TREE_PATH}/${id}`
}

export function getTreeRef(id: string) {
  return doc(firestore, getTreePath(id))
}

export function getTreeCollectionRef() {
  return collection(firestore, TREE_PATH)
}

export function observeTree({
  id,
  valueObserver,
  errorObserver,
}: {
  id: string
  valueObserver: (tree: MindMapNode) => void
  errorObserver?: (error: FirestoreError) => void
}) {
  const ref = getTreeRef(id)

  return onSnapshot(
    ref,
    snapshot => {
      if (snapshot.metadata.hasPendingWrites) {
        console.log(`[${Date.now()}] Ignoring optimistic snapshot`)

        return
      }

      valueObserver(fromSnapshot<MindMapNode>(snapshot))
    },
    errorObserver,
  )
}

function buildTree(): MindMapNode {
  return DEFAULT_TREE
}

export async function getOrCreateTreeDoc(id: string): Promise<MindMapNode> {
  const ref = getTreeRef(id)
  const doc = await getDoc(ref)

  if (doc.exists()) {
    return fromSnapshot<MindMapNode>(doc)
  }

  const tree = buildTree()
  await setDoc(ref, tree)

  return tree
}

export async function setTreeDoc(id: string, tree: MindMapNode): Promise<void> {
  const ref = getTreeRef(id)

  return runTransaction(firestore, async transaction => {
    transaction.set(ref, tree)
  })
}
