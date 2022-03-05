import { selectCurrentComparisonName } from '../comparisons'
import { useSelector } from 'react-redux'
import { Button } from '@pavel/components'
import { Avatars } from '../Avatars'

export function ComparisonName() {
  const currentComparisonName = useSelector(selectCurrentComparisonName)

  return (
    <div className="overflow-x-auto flex items-center">
      {/* <Button type="link" className="mx-3"> */}
      <PageTitleView>{currentComparisonName}</PageTitleView>
      {/* </Button> */}
    </div>
  )
}

export function AddComparisonButton() {
  return (
    <Button className="mx-3" type="link">
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
    <header className="flex justify-between mt-2 mx-3">
      <div className="whitespace-nowrap overflow-hidden flex">
        <ComparisonName />
        {/* <AddComparisonButton /> */}
      </div>
      <div className="flex items-center">
        <Avatars />
        <ShareButton />
      </div>
    </header>
  )
}

export function HeaderView(props) {
  return <header className="flex justify-between mt-2 mx-3" {...props} />
}

export function PageTitleView(props) {
  return <div className="font-extralight dark:font-thin text-2xl" {...props} />
}
