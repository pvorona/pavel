import { getOptionRef } from '@pavel/comparator-shared'
import { setDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectOptionById } from './options.selectors'

// Race conditions
// Options are fetched twice
export function OptionObserver({ optionId }: { optionId: string }) {
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
    const optionReference = getOptionRef(option.id)

    setDoc(optionReference, option)
  }, [option])

  return null
}
