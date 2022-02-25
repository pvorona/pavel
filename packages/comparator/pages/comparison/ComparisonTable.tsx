import { Button } from '../../common'
import { Fragment } from 'react'
import { currentComparison, options } from './Comparison.data'

import styles from './Comparison.module.css'

export function ComparisonTable() {
  return (
    <div className={`mt-8 flex flex-col items-center overflow-hidden`}>
      <div className={`overflow-auto w-full ${styles.scrollContainer}`}>
        <table className="min-w-[640px] mb-16 mx-auto">
          <thead>
            <tr>
              {options.map(option => (
                <th
                  key={option.id}
                  className="sticky top-0 px-3 py-4 bg-white dark:bg-dark-1 z-10"
                  style={{ width: `${100 / options.length}%` }}
                >
                  {option.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentComparison.features.map((feature, index) => (
              <Fragment key={feature}>
                <tr className={`sticky left-3 top-[56px]`}>
                  <td className={`pt-10`} colSpan="100%">
                    <span
                      className={`sticky left-0 px-3  bg-white dark:bg-dark-1`}
                    >
                      {feature}
                    </span>
                  </td>
                </tr>
                <tr>
                  {options.map(option => (
                    <td
                      key={`${feature}-${option.id}`}
                      style={{ width: `${100 / options.length}%` }}
                    >
                      <div className="flex justify-center px-12 pt-2">
                        {option.features[feature]}
                      </div>
                    </td>
                  ))}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full mt-auto px-3 mb-3">
        <Button className="bg-black text-white py-1 px-8 h-12 whitespace-nowrap w-full">
          + Add Feature
        </Button>
      </div>
    </div>
  )
}
