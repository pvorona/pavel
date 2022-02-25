import { Fragment } from 'react'
import { Button } from '../../common'
import { Avatars } from './Avatars'
import { breadcrumbs } from './Comparison.data'

export function ComparisonBreadcrumbs() {
  return (
    <div className="overflow-x-auto flex items-center -ml-3">
      {breadcrumbs.map((set, index) => (
        <Fragment key={set.id}>
          <Button type="link" className="mx-3">
            {set.title}
          </Button>
          {index !== breadcrumbs.length - 1 && '/'}
        </Fragment>
      ))}
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
    <Button className="text-lg bg-black text-white py-1 px-8 h-full">
      <span className="hidden md:inline">Share</span>
      <span className="md:hidden">S</span>
    </Button>
  )
}

export function Header() {
  return (
    <header className="flex justify-between mt-2 mx-3">
      <div className="whitespace-nowrap overflow-hidden flex">
        <ComparisonBreadcrumbs />
        <AddComparisonButton />
      </div>
      <div className="flex items-center">
        <Avatars />
        <ShareButton />
      </div>
    </header>
  )
}
