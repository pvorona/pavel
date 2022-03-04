// import { initNewComparison } from '../../modules/comparisons'
import { useDispatch, useSelector } from 'react-redux'
import { Header } from './Header'
import { ComparisonTable } from './ComparisonTable'
import { db } from '../../modules/firebase'
import { getDoc, doc, setDoc } from 'firebase/firestore'
import {
  addComparison,
  Comparison as ComparisonModel,
  selectComparisonById,
  selectCurrentComparisonId,
  selectCurrentComparisonOptionIds,
  setCurrentComparisonId,
} from '../../modules/comparisons'
import { addOption, Option, selectOptionById } from '../../modules/options'
import { useEffect } from 'react'

export function Main() {
  return (
    <div className="flex flex-col h-full">
      <ComparisonTable />
    </div>
  )
}

// Race conditions
// Options are fetched twice
function OptionObserver({ optionId }: { optionId: string }) {
  // const dispatch = useDispatch()
  const option = useSelector(selectOptionById(optionId))

  // useEffect(() => {
  //   const optionReference = doc(db, `Options/${option.id}`)

  //   return onSnapshot(optionReference, {
  //     next: documentSnapshot => {
  //       const parsedOption = documentSnapshot.data() as Option

  //       console.log({ parsedOption })
  //       if (!isEqual(option, parsedOption)) {
  //         console.log('parsed option is not equal, updating local state')
  //         dispatch(addOption(parsedOption))
  //       }
  //     },
  //   })
  // }, [dispatch, option])

  useEffect(() => {
    const optionReference = doc(db, `Options/${option.id}`)

    setDoc(optionReference, option)
  }, [option])

  return null
}

function OptionsObserver() {
  const optionIds = useSelector(selectCurrentComparisonOptionIds)

  return (
    <>
      {optionIds.map(optionId => (
        <OptionObserver key={optionId} optionId={optionId} />
      ))}
    </>
  )
}

function ComparisonObserver({ comparisonId }: { comparisonId: string }) {
  // const dispatch = useDispatch()
  const comparison = useSelector(selectComparisonById(comparisonId))

  // useEffect(() => {
  //   const comparisonReference = doc(db, `ComparisonSets/${comparison.id}`)

  //   return onSnapshot(comparisonReference, {
  //     next: documentSnapshot => {
  //       const parsedComparison = documentSnapshot.data() as ComparisonModel

  //       console.log({ parsedComparison })
  //       if (!isEqual(comparison, parsedComparison)) {
  //         console.log('parsed comparison is not equal, updating local state')
  //         dispatch(addComparison(parsedComparison))
  //       }
  //     },
  //   })
  // }, [dispatch, comparison])

  useEffect(() => {
    const comparisonReference = doc(db, `ComparisonSets/${comparison.id}`)

    setDoc(comparisonReference, comparison)
  }, [comparison])

  return null
}

export default function Comparison({ isNew }: { isNew: boolean }) {
  const dispatch = useDispatch()
  const currentComparisonId = useSelector(selectCurrentComparisonId)

  useEffect(() => {
    async function loadPageData() {
      try {
        const comparisonSnapshot = await getDoc(
          doc(db, 'ComparisonSets/EkKswJiF3rMGbwnQvjle'),
        )
        const comparison = comparisonSnapshot.data() as ComparisonModel
        const optionsSnapshots = await Promise.all(
          comparison.optionIds.map(optionId =>
            getDoc(doc(db, `Options/${optionId}`)),
          ),
        )
        const options = optionsSnapshots.map(optionsSnapshot =>
          optionsSnapshot.data(),
        ) as Option[]

        console.log('Documents received:', comparison, options)

        options.forEach(option => {
          dispatch(addOption(option))
        })
        dispatch(addComparison(comparison))
        dispatch(setCurrentComparisonId(comparison.id))

        return { comparison, options }
      } catch (e) {
        console.error('Error fetching documents:', e)
      }
    }

    loadPageData()
  }, [])

  // if (isNew) {
  //   dispatch(initNewComparison())
  // }

  if (currentComparisonId === null) {
    return 'Loading...'
  }

  return (
    <>
      <OptionsObserver />
      <ComparisonObserver comparisonId={currentComparisonId} />
      <div className="h-full overflow-auto flex flex-col dark:bg-[#202124] dark:text-[#e7eaed] selection:bg-black selection:text-white dark:selection:bg-gray-3">
        <Header />
        <Main />
      </div>
    </>
  )
}
