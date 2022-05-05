import {
  selectCurrentComparisonName,
  setCurrentComparisonProperty,
} from '../comparisons'
import { useDispatch, useSelector } from 'react-redux'
import { Button, TextField, Variant } from '@pavel/components'
import { HeaderAuth, HeaderTitle, LandingHeader } from '../LandingHeader'
import { BackIcon } from '../BackButton'

export function ComparisonName() {
  const dispatch = useDispatch()
  const currentComparisonName = useSelector(selectCurrentComparisonName)

  const onComparisonNameChange = (value: string) => {
    dispatch(setCurrentComparisonProperty({ name: value }) as any)
  }

  return (
    // <PageTitleView>
    <TextField onInput={onComparisonNameChange}>
      {currentComparisonName}
    </TextField>
    // </PageTitleView>
  )
}

export function AddComparisonButton() {
  return (
    <Button className="mx-3" variant={Variant.Link}>
      + <span className="hidden md:inline">Add new comparison</span>
    </Button>
  )
}

export function ShareButton() {
  return (
    <Button>
      <span className="hidden md:inline">Share</span>
      <span className="md:hidden">S</span>
    </Button>
  )
}

export function Header() {
  return (
    <LandingHeader>
      <HeaderTitle className="flex items-center">
        <BackIcon />
        <ComparisonName />
        {/* <AddComparisonButton /> */}
      </HeaderTitle>
      <HeaderAuth />
    </LandingHeader>
  )
}

// export function Header() {
//   return (
//     <HeaderView>
//       <div className="whitespace-nowrap overflow-hidden flex items-center">
//         <BackIcon />
//         <ComparisonName />
//         {/* <AddComparisonButton /> */}
//       </div>
//       <div className="flex items-center">
//         <Avatars />
//         <ShareButton />
//       </div>
//     </HeaderView>
//   )
// }

export function HeaderView(props) {
  return (
    <header
      className="flex justify-between items-center mt-2 mx-3"
      {...props}
    />
  )
}

export function PageTitleView(props) {
  return <div className="font-extralight dark:font-thin text-2xl" {...props} />
}
