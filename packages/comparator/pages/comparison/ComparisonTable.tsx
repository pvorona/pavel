import { Button } from '../../common'
import { Fragment, useEffect, useRef, useState } from 'react'
import { currentComparison, options as initialOptions } from './Comparison.data'
import styles from './Comparison.module.css'
import { Feature, Option } from '../types'
import { uuid } from '@pavel/utils'

export function ComparisonTable() {
  const scrollContainerRef = useRef<HTMLDivElement | undefined>()
  const [features, setFeatures] = useState(currentComparison.features)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false)
  const [options, setOptions] = useState(initialOptions)

  function removeFeature(feature: Feature) {
    setFeatures(features => features.filter(f => f !== feature))
  }

  function toggleVisibility(feature: Feature) {
    const newFeature: Feature = {
      ...feature,
      expanded: !feature.expanded,
    }
    setFeatures(features => features.map(f => (f === feature ? newFeature : f)))
  }

  function addFeature() {
    const newFeature: Feature = {
      name: `Feature ${features.length}`,
      type: 'text',
      description: 'sample',
      expanded: true,
    } as const
    setFeatures(features => [...features, newFeature])
    setShouldScrollToBottom(true)
  }

  function addOption(index: number) {
    const newOption: Option = {
      id: uuid(),
      name: `Option ${index}`,
      features: {},
    }

    const newOptions = [...options]
    newOptions.splice(index, 0, newOption)

    setOptions(newOptions)
  }

  function removeOption(option: Option) {
    setOptions(options => options.filter(o => o !== option))
  }

  useEffect(() => {
    if (shouldScrollToBottom && scrollContainerRef.current) {
      setShouldScrollToBottom(false)

      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight
    }
  }, [shouldScrollToBottom])

  return (
    <div className={`mt-8 flex flex-col items-center overflow-hidden`}>
      <div
        className={`overflow-auto w-full ${styles.scrollContainer}`}
        ref={scrollContainerRef}
      >
        <table className="min-w-[640px] mb-16 mx-auto">
          <thead>
            <tr>
              {options.map((option, index) => (
                <th
                  key={option.id}
                  className="sticky top-0 px-3 py-4 bg-white dark:bg-[#202124] z-10"
                  style={{ width: `${100 / options.length}%` }}
                >
                  <button onClick={() => addOption(index)}>Add option</button>
                  <span contentEditable>{option.name}</span>
                  <button onClick={() => addOption(index + 1)}>
                    Add option
                  </button>
                  <button onClick={() => removeOption(option)}>X</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <Fragment key={`${feature.name}${index}`}>
                <tr className={`sticky left-3 top-[56px]`}>
                  <td className="pt-10" colSpan={options.length}>
                    <div className="inline-block sticky left-0 px-3 bg-white dark:bg-[#202124]">
                      <span contentEditable>{feature.name}</span>
                      <button onClick={() => removeFeature(feature)}>X</button>
                      <button onClick={() => toggleVisibility(feature)}>
                        Toggle visibility
                      </button>
                      {feature.description && (
                        <div contentEditable>{feature.description}</div>
                      )}
                    </div>
                  </td>
                </tr>
                {feature.expanded && (
                  <tr>
                    {options.map(option => (
                      <td
                        key={`${feature}-${option.id}`}
                        style={{ width: `${100 / options.length}%` }}
                        className="align-top"
                      >
                        <div
                          className="flex justify-center px-12 pt-2"
                          contentEditable
                        >
                          {option.features[feature.name]}
                        </div>
                      </td>
                    ))}
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="w-full mt-auto px-3 mb-3">
        <Button
          onClick={addFeature}
          className="bg-black text-white py-1 px-8 h-12 whitespace-nowrap w-full"
        >
          + Add Feature
        </Button>
      </div>
    </div>
  )
}
