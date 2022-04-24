import { COMPARISON_LIST } from '@pavel/comparator-shared'
import { IconButton } from '@pavel/components'
import { useRouter } from 'next/router'

export function BackIcon() {
  const router = useRouter()

  function goBack() {
    router.push(COMPARISON_LIST)
  }

  return (
    <IconButton
      onClick={goBack}
      className="-ml-3 -mt-3 -mb-3 p-3 text-black dark:text-white "
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 10 10"
        className="rotate-180"
        stroke="currentColor"
      >
        <path d="M1 1l4 4-4 4" fill="none" />
      </svg>
    </IconButton>
  )
}
