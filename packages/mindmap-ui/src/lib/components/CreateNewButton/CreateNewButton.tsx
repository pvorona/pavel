import { Button, EditIcon, Variant } from '@pavel/components'
import { LoadingStatus } from '@pavel/types'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { createTreeId, TREE_ID_QUERY_NAME } from '../../modules'
import { Surface } from '../Surface'

export function CreateNewButton() {
  const [loadingStatus, setLoadingStatus] = useState(LoadingStatus.IDLE)
  const router = useRouter()

  const handleCreateNew = () => {
    setLoadingStatus(LoadingStatus.IN_PROGRESS)
    const url = new URL(window.location.href)
    const id = createTreeId()
    url.searchParams.set(TREE_ID_QUERY_NAME, id)
    router.push(url)
    setLoadingStatus(LoadingStatus.IDLE)
  }

  return (
    <Surface className="fixed bottom-8 left-12" rounded withBorder>
      <Button
        rounded
        variant={Variant.Unstyled}
        onClick={handleCreateNew}
        loadingStatus={loadingStatus}
      >
        {loadingStatus === LoadingStatus.IN_PROGRESS ? (
          <>
            <EditIcon className="-ml-3 mr-3" />
            Loading...
          </>
        ) : (
          <>
            <EditIcon className="-ml-3 mr-3" />
            Create new
          </>
        )}
      </Button>
    </Surface>
  )
}
