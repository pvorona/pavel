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
import { HeaderAuth, HeaderTitle, LandingHeader } from '../../modules'
import {
  withAuthUser,
  withAuthUserTokenSSR,
  useAuthUser,
  AuthAction,
} from 'next-firebase-auth'
import styles from './Comparison.module.scss'
import { Button } from '@pavel/components'

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
    <div className={classNames(styles['Content'])}>
      <CreateComparisonButton />
      {children}
    </div>
  )
}

export const ComparisonItem = forwardRef<HTMLAnchorElement, CardProps>(
  function ComparisonItem(props, ref) {
    return <Card {...props} ref={ref} />
  },
)

export function CreateComparisonButton() {
  const router = useRouter()
  const user = useAuthUser()

  async function onClick() {
    const { id } = await createComparison(user.id)

    // TODO:
    // Push response to store to avoid refetching

    router.push(COMPARISON(id))
  }

  return (
    <Button onClick={onClick} className="mb-4" size="sm">
      Create comparison
    </Button>
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
      className={classNames(styles['Card'], className)}
      {...props}
    />
  )
})
