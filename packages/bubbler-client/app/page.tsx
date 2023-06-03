import { Background } from './Background'
import { Button } from './Button'
import { createUsername } from './createUsername'
import styles from './page.module.css'

export default async function Index() {
  const username = createUsername()

  return (
    <>
      <Background />
      <div className="flex flex-col h-full items-center justify-center text-white mt-16">
        {/* <div className="mt-36 text-4xl">Hello</div> */}
        <div className="text-4xl">Hello</div>
        <div className="mt-2 text-7xl">{username}</div>
        <Button className="mt-28 mb-11">New game</Button>
        {/* <Button className="mt-auto mb-11">New game</Button> */}
      </div>
    </>
  )
}
