import React, { memo, useEffect, useRef, useState } from 'react'
import styles from './Comparison.module.css'
import { FeatureRows } from './FeatureRows'
import { TableHeader } from './TableHeader'

export const ComparisonTable = memo(function ComparisonTable() {
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement | undefined>()

  useEffect(() => {
    if (shouldScrollToBottom && scrollContainerRef.current) {
      setShouldScrollToBottom(false)

      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight
    }
  }, [shouldScrollToBottom])

  return (
    // <div className='mt-8 flex flex-col items-center overflow-hidden'>
    <div className="flex flex-col items-center overflow-hidden">
      <div
        className={`overflow-auto w-full ${styles.scrollContainer}`}
        ref={scrollContainerRef}
      >
        <table className="min-w-[640px] mb-16 mx-auto">
          <thead>
            <tr
              className="sticky top-0 z-20 bg-white dark:bg-[#202124]"
              style={{
                backgroundImage:
                  'linear-gradient(to top, hsl(0deg 0% 0% / 10%) 1px, transparent 0)',
              }}
            >
              <TableHeader />
            </tr>
          </thead>
          <tbody>
            <FeatureRows />
          </tbody>
        </table>
      </div>
    </div>
  )
})
