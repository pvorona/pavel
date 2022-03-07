import classNames from 'classnames'
import { getDocs } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState, forwardRef } from 'react'
import {
  COMPARISON,
  Comparison,
  createComparison,
  getComparisonsCollectionRef,
} from '@pavel/comparator-shared'
import { HeaderView, PageTitleView } from '../../modules'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  useAuthUser,
  AuthAction,
} from 'next-firebase-auth'

export const getServerSideProps = withAuthUserTokenSSR({
  whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})()

export default withAuthUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(ComparisonListPageWrapper)

function ComparisonListPageWrapper() {
  const [docsState, setDocsState] = useState<Comparison[]>([])

  useEffect(() => {
    const loadData = async () => {
      const docsSnapshots = await getDocs(getComparisonsCollectionRef())
      setDocsState(docsSnapshots.docs.map(doc => doc.data() as Comparison))
    }

    loadData()
  }, [])

  return (
    <>
      <HeaderView>
        <PageTitleView>Comparisons</PageTitleView>
      </HeaderView>

      <ComparisonList>
        {docsState.map(d => (
          <Link key={d.id} passHref href={COMPARISON(d.id)}>
            <ComparisonItem>{d.name}</ComparisonItem>
          </Link>
        ))}
      </ComparisonList>
    </>
  )
}

export function ComparisonList({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start h-full">
      <AddComparisonCard />
      {children}
    </div>
  )
}

export const ComparisonItem = forwardRef<HTMLAnchorElement, CardProps>(
  function ComparisonItem(props, ref) {
    return <Card {...props} ref={ref} />
  },
)

export function AddComparisonCard() {
  const router = useRouter()

  async function onClick() {
    const { id } = await createComparison()

    router.push(COMPARISON(id))
  }

  return (
    <Card
      onClick={onClick}
      className="bg-gray-4 text-white flex items-center justify-center text-4xl"
    >
      +
    </Card>
  )
}

type CardProps = {
  className?: string
  children: ReactNode
  onClick?: () => void
}

export const Card = forwardRef<HTMLAnchorElement, CardProps>(function Card(
  { className, onClick, ...props }: CardProps,
  ref,
) {
  return (
    <a
      ref={ref}
      onClick={onClick}
      className={classNames(
        'block shadow-2xl w-48 h-48 ml-3 rounded-sm',
        className,
      )}
      {...props}
    />
  )
})
