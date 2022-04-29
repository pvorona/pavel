import {
  App,
  AppProps,
  createTreeId,
  DEFAULT_VIEW_MODE,
  getOrCreateTreeDoc,
  TREE_ID_QUERY_NAME,
  ViewMode,
  VIEW_MODE_QUERY_NAME,
} from '@pavel/mindmap-ui'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async context => {
  const { id, view } = context.query

  if (!id) {
    const id = createTreeId()

    return {
      redirect: {
        permanent: false,
        destination: `${context.resolvedUrl}?${TREE_ID_QUERY_NAME}=${id}&${VIEW_MODE_QUERY_NAME}=${DEFAULT_VIEW_MODE}`,
      },
    }
  }

  const tree = await getOrCreateTreeDoc(String(id))
  const viewMode =
    view === ViewMode.MINDMAP ? ViewMode.MINDMAP : ViewMode.MARKDOWN

  return {
    props: {
      viewMode,
      tree,
      id,
    },
  }
}

export function Index(props: AppProps) {
  return <App {...props} />
}

export default Index
