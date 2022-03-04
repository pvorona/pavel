import {
  selectCurrentComparisonId,
  selectCurrentComparisonName,
} from '../../modules/comparisons'
import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Button, TextField } from '../../shared'
import { Avatars } from './Avatars'

const breadcrumbs = [
  { id: 'directory 1', title: 'Directory' },
  { id: 'comparison 1', title: 'Comparison' },
]
// return (
//   <div className="overflow-x-auto flex items-center -ml-3">
//     {breadcrumbs.map((set, index) => (
//       <Fragment key={set.id}>
//         <Button type="link" className="mx-3">
//           {set.title}
//         </Button>
//         {index !== breadcrumbs.length - 1 && '/'}
//       </Fragment>
//     ))}
//   </div>
// )

export function ComparisonName() {
  const currentComparisonName = useSelector(selectCurrentComparisonName)

  return (
    <div className="overflow-x-auto flex items-center">
      {/* <Button type="link" className="mx-3"> */}
      <PageTitleView className="font-extralight dark:font-thin text-2xl">
        {currentComparisonName}
      </PageTitleView>
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
    <Button className="py-1 px-8 h-full">
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
  return <div className="font-extralight dark:font-thin text-xl" {...props} />
}
