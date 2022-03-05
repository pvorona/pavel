import React, { memo } from 'react'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'

export const ComparisonTable = memo(function ComparisonTable() {
  return (
    <div className={`w-full`}>
      <table className="min-w-[640px] mb-16 mx-auto">
        <thead>
          <tr
            className={'sticky top-0 z-20 bg-white dark:bg-[#202124]'}
            style={
              {
                // backgroundImage:
                //   'linear-gradient(to top, hsl(0deg 0% 0% / 10%) 1px, transparent 0)',
              }
            }
          >
            <TableHeader />
          </tr>
        </thead>
        <tbody>
          <TableBody />
        </tbody>
      </table>
    </div>
  )
})
