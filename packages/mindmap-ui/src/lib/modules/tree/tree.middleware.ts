import { Lambda } from '@pavel/types'
import { isServer } from '@pavel/utils'
import { Middleware } from 'redux'
import { observeTree, setTreeDoc } from './tree.firebase'
import { selectText, selectTreeId } from './tree.selectors'
import { setText, setTree, setTreeId } from './tree.slice'
import { MindMapNode } from './tree.types'
import { markdownToTree, treeToMarkdown } from './tree.utils'

const UPDATE_TREE_DEBOUNCE_MS = 500

let lastUpdatedTime = Date.now()

export const observeTreeMiddleware: Middleware = store => next => {
  const valueObserver = (tree: MindMapNode) => {
    if (Date.now() - lastUpdatedTime <= UPDATE_TREE_DEBOUNCE_MS) {
      return
    }

    store.dispatch(setTree(tree))
    const newText = treeToMarkdown(tree)
    const text = selectText(store.getState())

    if (text !== newText) {
      store.dispatch({
        type: setText.toString(),
        payload: newText,
        skipPush: true,
      })
    }
  }

  const errorObserver = console.error
  const id = selectTreeId(store.getState())
  const startObserving = (id: string) => {
    return observeTree({
      id,
      valueObserver,
      errorObserver,
    })
  }

  let unobserve: Lambda | undefined

  if (id && !isServer) {
    unobserve = startObserving(id)
  }

  return action => {
    if (action.type === setTreeId.toString()) {
      unobserve?.()

      unobserve = startObserving(action.payload)
    }

    next(action)
  }
}

export const updateTreeMiddleware: Middleware = store => next => {
  let debounceTimeoutId: undefined | NodeJS.Timeout = undefined

  async function updateTree(id: string, tree: MindMapNode) {
    debounceTimeoutId = undefined

    try {
      await setTreeDoc(id, tree)
    } catch (error) {
      console.error('Failed to update tree.', error)
    }
  }

  return async action => {
    next(action)

    if (action.type === setText.toString()) {
      if (action.skipPush) {
        return
      }

      lastUpdatedTime = Date.now()

      if (debounceTimeoutId) {
        clearTimeout(debounceTimeoutId)
      }

      const maybeTree = markdownToTree(action.payload)

      if (!maybeTree) {
        return
      }

      const id = selectTreeId(store.getState())

      if (!id) {
        console.error(`Invalid tree id: ${id}`)

        return
      }

      debounceTimeoutId = setTimeout(
        () => updateTree(id, maybeTree),
        UPDATE_TREE_DEBOUNCE_MS,
      )
    }
  }
}
