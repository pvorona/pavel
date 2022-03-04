import classNames from 'classnames'
import { getDocs } from 'firebase/firestore'
import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import { Comparison, getComparisonsPath } from '../../modules/comparisons'
import { HeaderView, PageTitleView } from './Header'

export default function ComparisonListPageWrapper() {
  const [docsState, setDocsState] = useState<Comparison[]>([])

  useEffect(() => {
    const loadData = async () => {
      const docsSnapshots = await getDocs(getComparisonsPath())
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
          <Link key={d.id} href={`comparison/${encodeURIComponent(d.id)}`}>
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

export function ComparisonItem(props) {
  return <Card {...props} />
}

export function AddComparisonCard() {
  return (
    <Card className="bg-gray-4 text-white flex items-center justify-center text-4xl">
      +
    </Card>
  )
}

export function Card({
  className,
  ...props
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={classNames('shadow-2xl w-48 h-48 ml-3 rounded-sm', className)}
      {...props}
    />
  )
}
