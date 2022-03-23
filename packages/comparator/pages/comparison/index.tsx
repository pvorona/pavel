import classNames from 'classnames'
import { getDocs, query, where } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState, forwardRef } from 'react'
import {
  COMPARISON,
  Comparison,
  createComparison,
  getComparisonsCollectionRef,
} from '@pavel/comparator-shared'
import {
  HeaderAuth,
  HeaderTitle,
  HeaderView,
  LandingHeader,
  PageTitleView,
} from '../../modules'
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
  const user = useAuthUser()

  useEffect(() => {
    const loadData = async () => {
      const docsSnapshots = await getDocs(
        query(getComparisonsCollectionRef(), where('ownerId', '==', user.id)),
      )
      setDocsState(docsSnapshots.docs.map(doc => doc.data() as Comparison))
    }

    loadData()
  }, [user.id])

  return (
    <>
      <LandingHeader>
        <HeaderTitle>Your comparisons</HeaderTitle>
        <HeaderAuth />
      </LandingHeader>

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
  const user = useAuthUser()

  async function onClick() {
    const { id } = await createComparison(user.id)

    // TODO:
    // Push response to store to avoid refetching

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
