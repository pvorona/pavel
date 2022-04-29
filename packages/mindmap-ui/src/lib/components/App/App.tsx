import { Provider } from 'react-redux'
import { makeStore } from '../../store'
import { CreateNewButton } from '../CreateNewButton'
import { MainView } from '../MainView'
import { ZoomControls } from '../ZoomControls'
import { ViewModeSwitch } from '../ViewModeSwitch'
import { ShareButton } from '../ShareButton'
import { MindMapNode, treeToMarkdown, ViewMode } from '../../modules'

export type AppProps = {
  viewMode: ViewMode
  tree: MindMapNode
  id: string
}

export function AppView() {
  return (
    <div className="w-screen h-screen relative">
      <MainView />
      <ShareButton />
      <CreateNewButton />
      <ViewModeSwitch />
      <ZoomControls />
    </div>
  )
}

export function App({ viewMode, tree, id }: AppProps) {
  const store = makeStore({
    viewMode,
    tree: { root: tree, id, text: treeToMarkdown(tree) },
  })

  return (
    <Provider store={store}>
      <AppView />
    </Provider>
  )
}
