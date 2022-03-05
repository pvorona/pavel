import classNames from 'classnames'
import { getDocs } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState, forwardRef } from 'react'
import {
  Comparison,
  createComparison,
  getComparisonsCollectionRef,
} from '../../modules/comparisons'
import { HeaderView, PageTitleView } from './Header'

export default function ComparisonListPageWrapper() {
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
          <Link
            key={d.id}
            passHref
            href={`comparison/${encodeURIComponent(d.id)}`}
          >
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

    router.push(`comparison/${id}`)
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
